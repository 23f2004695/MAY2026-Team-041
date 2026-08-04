import contextlib
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from prisma.errors import ForeignKeyViolationError

from app.core.mail import send_email_async
from app.modules.loans import repository
from app.modules.loans.constants import (
    FINE_PER_DAY,
    LOAN_PERIOD_DAYS,
    REMIND_COOLDOWN_HOURS,
    REMINDER_WINDOW_DAYS,
)
from app.modules.loans.schemas import LoanCreate, LoanOut
from app.modules.notifications import service as notifications_service


async def create_loan(
    created_by_id: str, payload: LoanCreate, *, duration_days: int = LOAN_PERIOD_DAYS
) -> LoanOut:
    due_date = datetime.now(UTC) + timedelta(days=duration_days)
    try:
        loan = await repository.create(
            book_id=payload.book_id,
            member_id=payload.member_id,
            due_date=due_date,
            created_by_id=created_by_id,
        )
    except ForeignKeyViolationError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Book or member not found"
        ) from exc

    return LoanOut.from_prisma(loan, now=datetime.now(UTC))


async def list_active_loans() -> list[LoanOut]:
    now = datetime.now(UTC)
    rows = await repository.list_active()
    return [LoanOut.from_prisma(row, now=now) for row in rows]


async def list_all_loans() -> list[LoanOut]:
    now = datetime.now(UTC)
    rows = await repository.list_all()
    return [LoanOut.from_prisma(row, now=now) for row in rows]


async def list_my_loans(member_id: str) -> list[LoanOut]:
    now = datetime.now(UTC)
    rows = await repository.list_for_member(member_id)
    return [LoanOut.from_prisma(row, now=now) for row in rows]


async def list_fines() -> list[LoanOut]:
    # Includes returned-but-still-unpaid loans, not just currently-overdue ones — a
    # member who returns a book late still owes the fine until it's marked paid.
    now = datetime.now(UTC)
    rows = await repository.list_past_due(now=now)
    out = [LoanOut.from_prisma(row, now=now) for row in rows]
    return [item for item in out if item.days_late > 0]


async def sum_outstanding_fines() -> int:
    fines = await list_fines()
    return sum(item.fine_amount for item in fines if not item.fine_paid)


async def settle_fines_for_member(member_id: str, amount_paid: int) -> int:
    """Clear a member's late-return fines after they've paid, returning the count settled.

    Recording a payment used to leave finePaid untouched, so a member who paid their
    fine kept seeing it owed on every view that derives fines from loans (their own
    dashboard, the guardian card, the IT-Head queue). Oldest fine first, and only
    while the amount paid still covers it — a short payment leaves the rest owed
    rather than wiping the whole balance.
    """
    loans = await list_my_loans(member_id)
    unpaid = [loan for loan in loans if loan.fine_amount > 0 and not loan.fine_paid]

    remaining = amount_paid
    settled = 0
    for loan in sorted(unpaid, key=lambda item: item.due_date):
        if loan.fine_amount > remaining:
            continue
        remaining -= loan.fine_amount
        await repository.mark_fine_paid(loan.id)
        settled += 1
    return settled


async def return_loan(loan_id: str) -> LoanOut:
    existing = await repository.find_by_id(loan_id)
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")
    if existing.returnedAt is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="This loan was already returned"
        )

    row = await repository.mark_returned(loan_id, returned_at=datetime.now(UTC))
    return LoanOut.from_prisma(row, now=datetime.now(UTC))


async def mark_fine_paid(loan_id: str) -> LoanOut:
    existing = await repository.find_by_id(loan_id)
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")

    row = await repository.mark_fine_paid(loan_id)
    return LoanOut.from_prisma(row, now=datetime.now(UTC))


def _reminder_message(loan) -> str:
    days_late = max(0, (datetime.now(UTC).date() - loan.dueDate.date()).days)
    if days_late > 0:
        fine = days_late * FINE_PER_DAY
        return (
            f"Reminder: '{loan.book.title}' is {days_late} day(s) overdue — "
            f"a fine of ₹{fine} is due. Please return it as soon as possible."
        )
    due = loan.dueDate.strftime("%b %d, %Y")
    return f"Reminder: '{loan.book.title}' is due back by {due}."


async def send_reminder(loan_id: str) -> None:
    existing = await repository.find_by_id(loan_id)
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")

    message = _reminder_message(existing)
    await notifications_service.create_notification(existing.memberId, "fine-reminder", message)
    await send_email_async(existing.member.email, "Library reminder: book due", message)
    await repository.mark_reminded(loan_id, reminded_at=datetime.now(UTC))


async def send_due_soon_reminders() -> None:
    """Nudge everyone whose loan is due within the window, at most once a day each.

    The sweep runs on startup as well as on its ~24h tick, so without the
    lastRemindedAt check every restart re-emailed and re-notified every member in the
    window — in dev, where --reload restarts on each file save, that meant dozens of
    blocking SMTP sends over and over (and a notifications table full of duplicates).
    """
    now = datetime.now(UTC)
    window_end = now + timedelta(days=REMINDER_WINDOW_DAYS)
    remind_cutoff = now - timedelta(hours=REMIND_COOLDOWN_HOURS)

    loans = await repository.list_active()
    for loan in loans:
        if loan.dueDate > window_end:
            continue
        if loan.lastRemindedAt is not None and loan.lastRemindedAt > remind_cutoff:
            continue
        # Per-loan, so one unreachable mailbox (or a provider rate limit) doesn't abort
        # the sweep and leave everyone after it un-nudged — the caller only suppresses
        # errors at the whole-sweep level.
        with contextlib.suppress(Exception):
            await send_reminder(loan.id)

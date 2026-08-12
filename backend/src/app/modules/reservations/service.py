from collections import defaultdict
from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status

from app.core.constants import Role
from app.modules.books import repository as books_repository
from app.modules.loans import repository as loans_repository
from app.modules.loans.constants import REMINDER_WINDOW_DAYS
from app.modules.notifications import service as notifications_service
from app.modules.reservations import repository
from app.modules.reservations.schemas import ReservationCreate, ReservationOut


async def _notify_managers(message: str) -> None:
    await notifications_service.notify_roles([Role.MANAGER], "reservation-requested", message)


async def _queue_info(reservation) -> tuple[int | None, int | None]:
    if reservation.status != "pending":
        return None, None

    pending = await repository.list_pending_for_book(reservation.bookId)
    position = next((i + 1 for i, r in enumerate(pending) if r.id == reservation.id), None)
    if position is None:
        return None, None

    available_now = await repository.count_available_copies(reservation.bookId)
    if position <= available_now:
        return position, 0

    # Copies still on loan, ordered by return date — the (position - available_now)-th
    # one to come back is what finally frees up a copy for this member's turn.
    loans_ahead = await loans_repository.list_active_for_book(reservation.bookId)
    needed = position - available_now
    if needed > len(loans_ahead):
        return position, None

    eta_date = loans_ahead[needed - 1].dueDate
    eta_days = max(0, (eta_date.date() - datetime.now(UTC).date()).days)
    return position, eta_days


async def list_my_reservations(member_id: str) -> list[ReservationOut]:
    """Same queue maths as _queue_info, but batched.

    Doing it per reservation meant ~4 queries each (pending list, book, active-loan
    count, active-loan list); this fetches all three inputs once for every book the
    member is waiting on, so the cost no longer grows with the number of reservations.
    """
    reservations = await repository.list_active_for_member(member_id)
    pending_ones = [r for r in reservations if r.status == "pending"]
    if not pending_ones:
        return [ReservationOut.from_prisma(r) for r in reservations]

    book_ids = list({r.bookId for r in pending_ones})
    all_pending = await repository.list_pending_for_books(book_ids)
    books = await books_repository.list_by_ids(book_ids)
    active_loans = await loans_repository.list_active_for_books(book_ids)

    queue_by_book: dict[str, list[str]] = defaultdict(list)
    for row in all_pending:
        queue_by_book[row.bookId].append(row.id)

    total_copies_by_book = {book.id: book.totalCopies for book in books}
    loans_by_book: dict[str, list] = defaultdict(list)
    for loan in active_loans:
        loans_by_book[loan.bookId].append(loan)

    today = datetime.now(UTC).date()
    out = []
    for r in reservations:
        position = eta_days = None
        if r.status == "pending":
            queue = queue_by_book.get(r.bookId, [])
            position = queue.index(r.id) + 1 if r.id in queue else None

        if position is not None:
            loans_ahead = loans_by_book.get(r.bookId, [])
            available_now = max(0, total_copies_by_book.get(r.bookId, 0) - len(loans_ahead))
            if position <= available_now:
                eta_days = 0
            else:
                needed = position - available_now
                if needed <= len(loans_ahead):
                    eta = loans_ahead[needed - 1].dueDate.date()
                    eta_days = max(0, (eta - today).days)

        out.append(ReservationOut.from_prisma(r, queue_position=position, eta_days=eta_days))
    return out


async def create_reservation(member_id: str, payload: ReservationCreate) -> ReservationOut:
    blocking_due_after = datetime.now(UTC) + timedelta(days=REMINDER_WINDOW_DAYS)
    reservation = await repository.create_reservation_if_allowed(
        member_id=member_id,
        book_id=payload.book_id,
        blocking_due_after=blocking_due_after,
    )
    if reservation is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have this book reserved or on loan",
        )

    await notifications_service.create_notification(
        member_id,
        "reservation-requested",
        f'Your request to borrow "{reservation.book.title}" is awaiting manager approval.',
    )
    await _notify_managers(
        f'{reservation.member.fullName} requested to borrow "{reservation.book.title}".'
    )
    position, eta_days = await _queue_info(reservation)
    return ReservationOut.from_prisma(reservation, queue_position=position, eta_days=eta_days)


async def cancel_reservation(member_id: str, reservation_id: str) -> None:
    reservation = await repository.find_by_id(reservation_id)
    if reservation is None or reservation.memberId != member_id or reservation.status != "pending":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    await repository.cancel_reservation(reservation_id)

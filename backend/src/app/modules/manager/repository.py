from datetime import datetime

from prisma.models import Book, Loan, User

from app.core.constants import Role
from app.db.pagination import paginate
from app.db.prisma import prisma


async def count_seat_bookings_created_between(start: datetime, end: datetime) -> int:
    return await prisma.seatbooking.count(where={"createdAt": {"gte": start, "lt": end}})


async def count_loans_created_between(start: datetime, end: datetime) -> int:
    return await prisma.loan.count(where={"createdAt": {"gte": start, "lt": end}})


async def count_loans_returned_between(start: datetime, end: datetime) -> int:
    return await prisma.loan.count(where={"returnedAt": {"gte": start, "lt": end}})


async def count_members_created_between(start: datetime, end: datetime) -> int:
    return await prisma.user.count(
        where={
            "role": {"name": Role.MEMBER},
            "deletedAt": None,
            "createdAt": {"gte": start, "lt": end},
        }
    )


async def count_pending_billing_requests() -> int:
    return await prisma.billingrequest.count(where={"status": "pending"})


async def count_pending_reservations() -> int:
    return await prisma.reservation.count(where={"status": "pending"})


async def count_open_support_tickets() -> int:
    return await prisma.supportticket.count(where={"status": "open"})


async def list_books(*, search: str | None, page: int, page_size: int) -> tuple[list[Book], int]:
    where: dict = {"deletedAt": None}
    if search:
        where["OR"] = [
            {"title": {"contains": search, "mode": "insensitive"}},
            {"author": {"contains": search, "mode": "insensitive"}},
        ]

    return await paginate(
        prisma.book,
        where=where,
        order={"title": "asc"},
        skip=(page - 1) * page_size,
        take=page_size,
    )


async def list_active_loans_for_books(book_ids: list[str]) -> list[Loan]:
    if not book_ids:
        return []
    # Pre-sorted by dueDate ascending so the first match per book is the soonest
    # a copy is expected back.
    return await prisma.loan.find_many(
        where={"bookId": {"in": book_ids}, "returnedAt": None},
        order={"dueDate": "asc"},
    )


async def list_loans_borrowed_since(start: datetime) -> list[Loan]:
    """One bulk fetch feeding three dashboard charts (most-borrowed books, member
    activity, overdue/fines) — each buckets a different subset/field of the same rows
    in Python, mirroring admin/service.py::get_profit_and_loss's bulk-fetch-then-bucket
    pattern rather than one query per month per chart.
    """
    return await prisma.loan.find_many(
        where={"borrowedAt": {"gte": start}},
        include={"book": True},
    )


async def list_members_created_since(start: datetime) -> list[User]:
    return await prisma.user.find_many(
        where={"role": {"name": Role.MEMBER}, "deletedAt": None, "createdAt": {"gte": start}}
    )

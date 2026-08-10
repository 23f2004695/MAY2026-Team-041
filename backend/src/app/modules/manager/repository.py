from datetime import datetime

from prisma.models import Book, Loan

from app.core.constants import Role
from app.db.prisma import prisma


async def count_seat_bookings_created_between(start: datetime, end: datetime) -> int:
    return await prisma.seatbooking.count(where={"createdAt": {"gte": start, "lt": end}})


async def count_loans_created_between(start: datetime, end: datetime) -> int:
    return await prisma.loan.count(where={"createdAt": {"gte": start, "lt": end}})


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


def _list_where(search: str | None, category: str | None) -> dict:
    where: dict = {"deletedAt": None}
    if search:
        where["OR"] = [
            {"title": {"contains": search, "mode": "insensitive"}},
            {"author": {"contains": search, "mode": "insensitive"}},
        ]
    if category and category.lower() != "all":
        where["category"] = category
    return where


# Returns every matching book, unpaginated. Availability (and therefore the
# "available"/"unavailable" status filter and any copies-based sort) can only be computed
# after joining active loans in the service layer, so pagination has to happen there too —
# a DB-level skip/take here would slice the wrong rows once a status filter is applied.
async def list_books(*, search: str | None, category: str | None) -> list[Book]:
    return await prisma.book.find_many(where=_list_where(search, category), order={"title": "asc"})


async def list_active_loans_for_books(book_ids: list[str]) -> list[Loan]:
    if not book_ids:
        return []
    # Pre-sorted by dueDate ascending so the first match per book is the soonest
    # a copy is expected back.
    return await prisma.loan.find_many(
        where={"bookId": {"in": book_ids}, "returnedAt": None},
        order={"dueDate": "asc"},
    )
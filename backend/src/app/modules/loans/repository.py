from datetime import datetime

from prisma.models import Loan

from app.db.prisma import prisma

INCLUDE = {"book": True, "member": True}


async def create(*, book_id: str, member_id: str, due_date: datetime, created_by_id: str) -> Loan:
    return await prisma.loan.create(
        data={
            "bookId": book_id,
            "memberId": member_id,
            "dueDate": due_date,
            "createdById": created_by_id,
        },
        include=INCLUDE,
    )


async def find_by_id(loan_id: str) -> Loan | None:
    return await prisma.loan.find_unique(where={"id": loan_id}, include=INCLUDE)


async def list_all() -> list[Loan]:
    return await prisma.loan.find_many(include=INCLUDE, order={"dueDate": "asc"})


async def list_past_due(*, now: datetime) -> list[Loan]:
    """Loans whose due date has passed — the only ones that can carry a fine.

    A superset of the fined set, not an exact match: a loan returned before it was due
    still shows up here and gets dropped by the days_late check in the service (Prisma
    can't compare returnedAt against dueDate in a where clause). Still far cheaper than
    loading and hydrating every loan ever created, which is what the fines view did.
    """
    return await prisma.loan.find_many(
        where={"dueDate": {"lt": now}},
        include=INCLUDE,
        order={"dueDate": "asc"},
    )


async def list_active() -> list[Loan]:
    return await prisma.loan.find_many(
        where={"returnedAt": None}, include=INCLUDE, order={"dueDate": "asc"}
    )


async def list_for_member(member_id: str) -> list[Loan]:
    return await prisma.loan.find_many(
        where={"memberId": member_id}, include=INCLUDE, order={"borrowedAt": "desc"}
    )


async def count_active_for_book(book_id: str) -> int:
    return await prisma.loan.count(where={"bookId": book_id, "returnedAt": None})


async def list_active_for_book(book_id: str) -> list[Loan]:
    return await prisma.loan.find_many(
        where={"bookId": book_id, "returnedAt": None},
        order={"dueDate": "asc"},
    )


async def list_active_for_books(book_ids: list[str]) -> list[Loan]:
    """Outstanding loans across several books at once, soonest due first."""
    return await prisma.loan.find_many(
        where={"bookId": {"in": book_ids}, "returnedAt": None},
        order={"dueDate": "asc"},
    )


async def mark_returned(loan_id: str, *, returned_at: datetime) -> Loan:
    return await prisma.loan.update(
        where={"id": loan_id}, data={"returnedAt": returned_at}, include=INCLUDE
    )


async def mark_reminded(loan_id: str, *, reminded_at: datetime) -> Loan:
    return await prisma.loan.update(
        where={"id": loan_id}, data={"lastRemindedAt": reminded_at}, include=INCLUDE
    )


async def mark_fine_paid(loan_id: str) -> Loan:
    return await prisma.loan.update(
        where={"id": loan_id}, data={"finePaid": True}, include=INCLUDE
    )

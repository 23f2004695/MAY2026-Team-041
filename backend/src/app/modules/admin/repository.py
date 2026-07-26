from datetime import datetime

from prisma.models import Expense

from app.core.constants import Role
from app.db.prisma import prisma


async def sum_payments(
    *, start: datetime, end: datetime | None = None, has_plan: bool | None = None
) -> int:
    where: dict = {"status": "success", "createdAt": {"gte": start}}
    if end is not None:
        where["createdAt"]["lt"] = end
    if has_plan is True:
        where["planMonths"] = {"not": None}
    elif has_plan is False:
        where["planMonths"] = None

    payments = await prisma.payment.find_many(where=where)
    return sum(payment.amount for payment in payments)


async def sum_expenses(
    *, start: datetime, end: datetime | None = None, category: str | None = None
) -> int:
    where: dict = {"createdAt": {"gte": start}}
    if end is not None:
        where["createdAt"]["lt"] = end
    if category is not None:
        where["category"] = category

    expenses = await prisma.expense.find_many(where=where)
    return sum(expense.amount for expense in expenses)


async def count_members(*, created_before: datetime | None = None) -> int:
    where: dict = {"role": {"name": Role.MEMBER}, "deletedAt": None}
    if created_before is not None:
        where["createdAt"] = {"lt": created_before}
    return await prisma.user.count(where=where)


async def create_expense(*, category: str, amount: int, logged_by_id: str) -> Expense:
    return await prisma.expense.create(
        data={"category": category, "amount": amount, "loggedById": logged_by_id}
    )


async def count_seat_bookings(*, date: datetime, hour: int) -> int:
    return await prisma.seatbooking.count(where={"date": date, "hour": hour})

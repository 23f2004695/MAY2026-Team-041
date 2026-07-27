from datetime import datetime

from prisma.models import Expense, Payment, User

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


async def list_plan_payments() -> list[Payment]:
    return await prisma.payment.find_many(
        where={"status": "success", "planMonths": {"not": None}}
    )


async def list_payments_since(start: datetime) -> list[Payment]:
    return await prisma.payment.find_many(
        where={"status": "success", "createdAt": {"gte": start}}
    )


async def list_expenses(*, start: datetime | None = None) -> list[Expense]:
    where: dict = {}
    if start is not None:
        where["createdAt"] = {"gte": start}
    return await prisma.expense.find_many(where=where)


async def list_member_created_dates() -> list[datetime]:
    members = await prisma.user.find_many(
        where={"role": {"name": Role.MEMBER}, "deletedAt": None}
    )
    return [member.createdAt for member in members]


async def list_member_ids() -> list[str]:
    members = await prisma.user.find_many(where={"role": {"name": Role.MEMBER}, "deletedAt": None})
    return [member.id for member in members]


async def list_members(
    *, search: str | None, page: int, page_size: int
) -> tuple[list[User], int]:
    where: dict = {"role": {"name": Role.MEMBER}, "deletedAt": None}
    if search:
        where["OR"] = [
            {"fullName": {"contains": search, "mode": "insensitive"}},
            {"email": {"contains": search, "mode": "insensitive"}},
        ]

    total = await prisma.user.count(where=where)
    items = await prisma.user.find_many(
        where=where,
        order={"createdAt": "desc"},
        skip=(page - 1) * page_size,
        take=page_size,
    )
    return items, total


# Latest-row-per-user via a single ordered query is simpler than a per-user lookup and
# avoids N+1s for a page of members; dict.setdefault keeps the first (most recent) row.
async def list_latest_payments(member_ids: list[str]) -> dict[str, Payment]:
    if not member_ids:
        return {}
    payments = await prisma.payment.find_many(
        where={"userId": {"in": member_ids}, "status": "success"},
        order={"createdAt": "desc"},
    )
    latest: dict[str, Payment] = {}
    for payment in payments:
        latest.setdefault(payment.userId, payment)
    return latest


async def list_latest_membership_payments(member_ids: list[str]) -> dict[str, Payment]:
    if not member_ids:
        return {}
    payments = await prisma.payment.find_many(
        where={
            "userId": {"in": member_ids},
            "status": "success",
            "planMonths": {"not": None},
        },
        order={"createdAt": "desc"},
    )
    latest: dict[str, Payment] = {}
    for payment in payments:
        latest.setdefault(payment.userId, payment)
    return latest


async def count_reading_progress_by_status(member_ids: list[str]) -> dict[str, dict[str, int]]:
    if not member_ids:
        return {}
    rows = await prisma.readingprogress.find_many(where={"memberId": {"in": member_ids}})
    counts: dict[str, dict[str, int]] = {}
    for row in rows:
        bucket = counts.setdefault(row.memberId, {"reading": 0, "completed": 0})
        bucket[row.status] = bucket.get(row.status, 0) + 1
    return counts


async def find_reported_member_ids(member_ids: list[str]) -> set[str]:
    if not member_ids:
        return set()
    posts = await prisma.communitypost.find_many(
        where={"authorId": {"in": member_ids}, "reported": True}
    )
    comments = await prisma.communitycomment.find_many(
        where={"authorId": {"in": member_ids}, "reported": True}
    )
    return {post.authorId for post in posts} | {comment.authorId for comment in comments}

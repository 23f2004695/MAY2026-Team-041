from prisma import Prisma
from prisma.models import Payment

from app.db.prisma import prisma


async def create_payment(
    *,
    user_id: str,
    amount: int,
    label: str,
    plan_months: int | None = None,
    client: Prisma | None = None,
) -> Payment:
    db = client or prisma
    return await db.payment.create(
        data={
            "userId": user_id,
            "amount": amount,
            "label": label,
            "planMonths": plan_months,
        },
    )


async def find_latest_membership_payment(user_id: str) -> Payment | None:
    return await prisma.payment.find_first(
        where={"userId": user_id, "planMonths": {"not": None}, "status": "success"},
        order={"createdAt": "desc"},
    )


# A user's payment history grows without bound over time — cap what a single request
# can return rather than hydrating every payment they've ever made. Display-only (no
# business logic sums or iterates this list), so the cap is safe.
LIST_LIMIT = 200


async def list_payments_for_user(user_id: str) -> list[Payment]:
    return await prisma.payment.find_many(
        where={"userId": user_id}, order={"createdAt": "desc"}, take=LIST_LIMIT
    )

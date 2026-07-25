from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, status
from prisma.models import User

from app.api.deps import get_current_user
from app.modules.payments import repository
from app.modules.payments.schemas import MembershipOut, PaymentCreate, PaymentOut

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payload: PaymentCreate,
    user: Annotated[User, Depends(get_current_user)],
) -> PaymentOut:
    payment = await repository.create_payment(
        user_id=user.id,
        amount=payload.amount,
        label=payload.label,
        plan_months=payload.plan_months,
    )
    return PaymentOut.from_prisma(payment)


@router.get("/me/membership", response_model=MembershipOut | None)
async def get_my_membership(
    user: Annotated[User, Depends(get_current_user)],
) -> MembershipOut | None:
    payment = await repository.find_latest_membership_payment(user.id)
    if payment is None:
        return None

    # ponytail: 30 days/month approximation, no calendar-month arithmetic in the
    # stdlib and this doesn't stack overlapping renewals — good enough until a real
    # membership/plan model exists (see FINAL_SPEC.md item 10).
    expires_at = payment.createdAt + timedelta(days=30 * payment.planMonths)
    return MembershipOut(
        plan_label=payment.label,
        purchased_at=payment.createdAt,
        expires_at=expires_at,
        is_active=expires_at > datetime.now(UTC),
    )

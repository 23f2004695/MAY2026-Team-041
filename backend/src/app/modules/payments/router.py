from datetime import UTC, datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from prisma.models import User

from app.api.deps import get_current_user
from app.core.constants import Role
from app.modules.coupons import service as coupons_service
from app.modules.loans import service as loans_service
from app.modules.notifications import service as notifications_service
from app.modules.payments import repository
from app.modules.payments import service as payments_service
from app.modules.payments.schemas import (
    MembershipOut,
    PaymentCreate,
    PaymentListResponse,
    PaymentOut,
    RazorpayOrderOut,
    RazorpayVerifyRequest,
)

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("", response_model=PaymentOut, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payload: PaymentCreate,
    user: Annotated[User, Depends(get_current_user)],
) -> PaymentOut:
    amount = payload.amount
    if payload.coupon_code:
        amount = await coupons_service.redeem_coupon(payload.coupon_code, payload.amount)

    payment = await repository.create_payment(
        user_id=user.id,
        amount=amount,
        label=payload.label,
        plan_months=payload.plan_months,
    )
    # No plan attached means this isn't a membership purchase — the "Pay Fine" button is
    # the only non-plan payment the UI creates, so put the money against the member's
    # outstanding fines. Without this the loan stays finePaid=false and the fine keeps
    # showing as owed everywhere after it's been paid.
    if payload.plan_months is None:
        await loans_service.settle_fines_for_member(user.id, amount)
    await notifications_service.create_notification(
        user.id, "payment-received", f"Payment of ₹{amount} received for {payload.label}."
    )
    return PaymentOut.from_prisma(payment)


@router.post("/pay-at-library", status_code=status.HTTP_204_NO_CONTENT)
async def pay_at_library(
    payload: PaymentCreate,
    user: Annotated[User, Depends(get_current_user)],
) -> None:
    message = f"{user.fullName} wants to pay ₹{payload.amount} in cash for {payload.label}."
    await notifications_service.notify_roles([Role.MANAGER], "payment-pending", message)


@router.post(
    "/razorpay/order", response_model=RazorpayOrderOut, status_code=status.HTTP_201_CREATED
)
async def create_razorpay_order(
    payload: PaymentCreate,
    user: Annotated[User, Depends(get_current_user)],
) -> RazorpayOrderOut:
    return await payments_service.create_razorpay_order(user, payload)


@router.post("/razorpay/verify", response_model=PaymentOut)
async def verify_razorpay_payment(
    payload: RazorpayVerifyRequest,
    user: Annotated[User, Depends(get_current_user)],
) -> PaymentOut:
    return await payments_service.verify_and_record_razorpay_payment(user, payload)


@router.get("/me", response_model=PaymentListResponse)
async def list_my_payments(
    user: Annotated[User, Depends(get_current_user)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=200)] = 20,
) -> PaymentListResponse:
    payments, total = await repository.list_payments_for_user(
        user.id, page=page, page_size=page_size
    )
    return PaymentListResponse(
        items=[PaymentOut.from_prisma(payment) for payment in payments],
        total=total,
        page=page,
        page_size=page_size,
    )


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

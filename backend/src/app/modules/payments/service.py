import razorpay
from fastapi import HTTPException, status
from prisma.models import User

from app.core.config import get_settings
from app.modules.coupons import service as coupons_service
from app.modules.loans import service as loans_service
from app.modules.notifications import service as notifications_service
from app.modules.payments import repository
from app.modules.payments.schemas import (
    PaymentCreate,
    PaymentOut,
    RazorpayOrderOut,
    RazorpayVerifyRequest,
)


def _get_client() -> razorpay.Client:
    settings = get_settings()
    if not settings.razorpay_key_id or not settings.razorpay_key_secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Razorpay is not configured on this server",
        )
    return razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))


async def create_razorpay_order(user: User, payload: PaymentCreate) -> RazorpayOrderOut:
    client = _get_client()

    # Coupon is redeemed (and its use consumed) at order-creation time, since that's
    # what determines the amount Razorpay actually charges — same as the direct
    # create_payment endpoint, just one step earlier in a two-step gateway flow.
    amount = payload.amount
    if payload.coupon_code:
        amount = await coupons_service.redeem_coupon(payload.coupon_code, payload.amount)

    order = client.order.create(
        {
            "amount": amount * 100,
            "currency": "INR",
            "notes": {
                "member_id": user.id,
                "label": payload.label,
                "plan_months": str(payload.plan_months or ""),
            },
        }
    )

    return RazorpayOrderOut(
        order_id=order["id"],
        amount=amount,
        currency="INR",
        key_id=get_settings().razorpay_key_id,
        label=payload.label,
    )


async def verify_and_record_razorpay_payment(
    user: User, payload: RazorpayVerifyRequest
) -> PaymentOut:
    client = _get_client()

    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": payload.razorpay_order_id,
                "razorpay_payment_id": payload.razorpay_payment_id,
                "razorpay_signature": payload.razorpay_signature,
            }
        )
    except razorpay.errors.SignatureVerificationError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Payment verification failed"
        ) from exc

    # The order's amount/label/member_id come back from Razorpay's own record of what
    # was created server-side — never re-trusted from the client at this step.
    order = client.order.fetch(payload.razorpay_order_id)
    notes = order.get("notes") or {}
    if notes.get("member_id") != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="This order does not belong to you"
        )

    amount = order["amount"] // 100
    label = notes.get("label") or "Payment"
    plan_months = int(notes["plan_months"]) if notes.get("plan_months") else None

    payment = await repository.create_payment(
        user_id=user.id, amount=amount, label=label, plan_months=plan_months
    )
    # Same rule as the direct create_payment endpoint — a verified payment with no plan
    # behind it is a fine payment, so settle what it covers (see settle_fines_for_member).
    if plan_months is None:
        await loans_service.settle_fines_for_member(user.id, amount)
    await notifications_service.create_notification(
        user.id, "payment-received", f"Payment of ₹{amount} received for {label}."
    )
    return PaymentOut.from_prisma(payment)

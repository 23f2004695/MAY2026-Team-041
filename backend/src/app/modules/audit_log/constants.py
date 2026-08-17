from enum import StrEnum


class AuditAction(StrEnum):
    # There is no expense approval step in this system, only logging — the old
    # "expenseApproved" value made the log answer a question nobody could ask.
    EXPENSE_LOGGED = "expenseLogged"
    REFUND_ISSUED = "refundIssued"
    REFUND_REJECTED = "refundRejected"
    FEE_WAIVED = "feeWaived"
    FEE_WAIVER_REJECTED = "feeWaiverRejected"
    PRICING_PLAN_UPDATED = "pricingPlanUpdated"
    ANNOUNCEMENT_SENT = "announcementSent"
    COUPON_GENERATED = "couponGenerated"

    # Privileged non-financial actions. Everything above is about money; without these
    # the log could not answer "who made this account an admin" or "who cleared this
    # fine", which are the questions an audit trail exists for.
    MEMBER_ROLE_CHANGED = "memberRoleChanged"
    MEMBER_ACTIVATION_CHANGED = "memberActivationChanged"
    PERMISSION_REQUEST_GRANTED = "permissionRequestGranted"
    PERMISSION_REQUEST_DENIED = "permissionRequestDenied"
    FINE_MARKED_PAID = "fineMarkedPaid"
    COMMUNITY_USER_BANNED = "communityUserBanned"
    COMMUNITY_USER_UNBANNED = "communityUserUnbanned"

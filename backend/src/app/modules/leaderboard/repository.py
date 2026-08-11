from prisma.models import EventRegistration, Loan, LoginActivity, ReadingProgress, Review, User

from app.core.constants import Role
from app.db.prisma import prisma


async def list_member_users() -> list[User]:
    return await prisma.user.find_many(
        where={"role": {"name": Role.MEMBER}, "deletedAt": None}
    )


async def list_completed_progress() -> list[ReadingProgress]:
    return await prisma.readingprogress.find_many(
        where={"status": "completed", "member": {"role": {"name": Role.MEMBER}}}
    )


async def list_reviews() -> list[Review]:
    return await prisma.review.find_many(
        where={"member": {"role": {"name": Role.MEMBER}}}
    )


async def list_event_registrations() -> list[EventRegistration]:
    return await prisma.eventregistration.find_many(
        where={"member": {"role": {"name": Role.MEMBER}}}
    )


async def list_returned_loans() -> list[Loan]:
    return await prisma.loan.find_many(
        where={"returnedAt": {"not": None}, "member": {"role": {"name": Role.MEMBER}}}
    )


async def list_login_activities() -> list[LoginActivity]:
    return await prisma.loginactivity.find_many(
        where={"member": {"role": {"name": Role.MEMBER}}}
    )


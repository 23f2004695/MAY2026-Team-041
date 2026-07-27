from prisma.models import Notification

from app.db.prisma import prisma


async def list_for_user(user_id: str) -> list[Notification]:
    return await prisma.notification.find_many(
        where={"userId": user_id}, order={"createdAt": "desc"}
    )


async def find(notification_id: str) -> Notification | None:
    return await prisma.notification.find_unique(where={"id": notification_id})


async def create(user_id: str, type_: str, message: str) -> Notification:
    return await prisma.notification.create(
        data={"userId": user_id, "type": type_, "message": message}
    )


async def mark_read(notification_id: str) -> Notification:
    return await prisma.notification.update(where={"id": notification_id}, data={"read": True})

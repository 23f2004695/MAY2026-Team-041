from datetime import UTC, datetime

from prisma.models import Event, EventRegistration

from app.db.prisma import prisma

_INCLUDE = {"registrations": {"include": {"member": True}}}


async def list_events(*, skip: int, take: int) -> tuple[list[Event], int]:
    where = {"deletedAt": None}
    total = await prisma.event.count(where=where)
    items = await prisma.event.find_many(
        where=where,
        include=_INCLUDE,
        order={"date": "asc"},
        skip=skip,
        take=take,
    )
    return items, total


async def find_by_id(event_id: str) -> Event | None:
    return await prisma.event.find_unique(where={"id": event_id}, include=_INCLUDE)


async def create_event(data: dict) -> Event:
    return await prisma.event.create(data=data, include=_INCLUDE)


async def update_event(event_id: str, data: dict) -> Event:
    return await prisma.event.update(where={"id": event_id}, data=data, include=_INCLUDE)


async def soft_delete_event(event_id: str) -> None:
    await prisma.event.update(
        where={"id": event_id}, data={"deletedAt": datetime.now(UTC)}
    )


async def find_registration(event_id: str, member_id: str) -> EventRegistration | None:
    return await prisma.eventregistration.find_unique(
        where={"eventId_memberId": {"eventId": event_id, "memberId": member_id}}
    )


async def create_registration(event_id: str, member_id: str) -> EventRegistration:
    return await prisma.eventregistration.create(
        data={"eventId": event_id, "memberId": member_id}
    )


async def delete_registration(event_id: str, member_id: str) -> None:
    await prisma.eventregistration.delete(
        where={"eventId_memberId": {"eventId": event_id, "memberId": member_id}}
    )


async def count_events_this_month() -> int:
    now = datetime.now(UTC)
    start = datetime(now.year, now.month, 1, tzinfo=UTC)
    return await prisma.event.count(where={"deletedAt": None, "date": {"gte": start}})


async def count_total_registrations() -> int:
    return await prisma.eventregistration.count()

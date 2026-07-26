from prisma.models import Reservation

from app.db.prisma import prisma

RESERVATION_INCLUDE = {"book": True}


async def find_by_id(reservation_id: str) -> Reservation | None:
    return await prisma.reservation.find_unique(
        where={"id": reservation_id}, include=RESERVATION_INCLUDE
    )


async def list_active_for_member(member_id: str) -> list[Reservation]:
    return await prisma.reservation.find_many(
        where={"memberId": member_id, "status": "active"},
        include=RESERVATION_INCLUDE,
        order={"createdAt": "desc"},
    )


async def create_reservation(*, member_id: str, book_id: str) -> Reservation:
    async with prisma.tx() as transaction:
        updated = await transaction.book.update_many(
            where={"id": book_id, "totalCopies": {"gt": 0}},
            data={"totalCopies": {"decrement": 1}},
        )
        if updated == 0:
            raise ValueError("Book is not available")

        return await transaction.reservation.create(
            data={"memberId": member_id, "bookId": book_id},
            include=RESERVATION_INCLUDE,
        )


async def cancel_reservation(reservation: Reservation) -> Reservation:
    async with prisma.tx() as transaction:
        await transaction.book.update(
            where={"id": reservation.bookId}, data={"totalCopies": {"increment": 1}}
        )
        return await transaction.reservation.update(
            where={"id": reservation.id},
            data={"status": "cancelled"},
            include=RESERVATION_INCLUDE,
        )

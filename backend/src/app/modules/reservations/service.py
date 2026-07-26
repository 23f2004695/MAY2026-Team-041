from fastapi import HTTPException, status

from app.modules.reservations import repository
from app.modules.reservations.schemas import ReservationCreate, ReservationOut


async def list_my_reservations(member_id: str) -> list[ReservationOut]:
    reservations = await repository.list_active_for_member(member_id)
    return [ReservationOut.from_prisma(r) for r in reservations]


async def create_reservation(member_id: str, payload: ReservationCreate) -> ReservationOut:
    try:
        reservation = await repository.create_reservation(
            member_id=member_id, book_id=payload.book_id
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Book is not available"
        ) from exc

    return ReservationOut.from_prisma(reservation)


async def cancel_reservation(member_id: str, reservation_id: str) -> None:
    reservation = await repository.find_by_id(reservation_id)
    if (
        reservation is None
        or reservation.memberId != member_id
        or reservation.status != "active"
    ):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    await repository.cancel_reservation(reservation)

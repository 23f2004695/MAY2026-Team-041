from datetime import datetime

from pydantic import BaseModel


class ReservationCreate(BaseModel):
    book_id: str


class ReservationOut(BaseModel):
    id: str
    book_id: str
    book_title: str
    status: str
    created_at: datetime

    @staticmethod
    def from_prisma(reservation) -> "ReservationOut":
        return ReservationOut(
            id=reservation.id,
            book_id=reservation.bookId,
            book_title=reservation.book.title,
            status=reservation.status,
            created_at=reservation.createdAt,
        )

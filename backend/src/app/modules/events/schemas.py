from datetime import datetime

from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    location: str = Field(min_length=1, max_length=255)
    date: datetime
    capacity: int = Field(gt=0)


class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    location: str | None = Field(default=None, min_length=1, max_length=255)
    date: datetime | None = None
    capacity: int | None = Field(default=None, gt=0)


class RegistrantOut(BaseModel):
    id: str
    full_name: str
    email: str


class EventOut(BaseModel):
    id: str
    title: str
    description: str | None
    location: str
    date: datetime
    capacity: int
    attendees: int
    registered: bool
    registrants: list[RegistrantOut]
    created_at: datetime

    @staticmethod
    def from_prisma(event, *, member_id: str | None = None) -> "EventOut":
        registrants = event.registrations or []
        return EventOut(
            id=event.id,
            title=event.title,
            description=event.description,
            location=event.location,
            date=event.date,
            capacity=event.capacity,
            attendees=len(registrants),
            registered=any(r.memberId == member_id for r in registrants) if member_id else False,
            registrants=[
                RegistrantOut(
                    id=r.member.id,
                    full_name=r.member.fullName,
                    email=r.member.email,
                )
                for r in registrants
            ],
            created_at=event.createdAt,
        )


class EventListResponse(BaseModel):
    items: list[EventOut]
    total: int


class AttendanceSummary(BaseModel):
    total_events_this_month: int
    total_attendees: int
    average_attendance_rate: float

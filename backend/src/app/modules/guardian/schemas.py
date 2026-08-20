from datetime import datetime

from pydantic import BaseModel

from app.modules.members.schemas import ReadingProgressOut


class GuardianLinkCreate(BaseModel):
    guardian_id: str
    member_id: str


class GuardianContactOut(BaseModel):
    """The guardian a member is linked to, as shown on their own settings page."""

    id: str
    full_name: str
    email: str
    linked_at: datetime


class GuardianChildOut(BaseModel):
    id: str
    full_name: str
    email: str
    currently_reading: list[ReadingProgressOut]
    completed: list[ReadingProgressOut]
    outstanding_fine: int
    fine_book_title: str | None
    fine_due_date: datetime | None
    subscription_expires_on: datetime | None

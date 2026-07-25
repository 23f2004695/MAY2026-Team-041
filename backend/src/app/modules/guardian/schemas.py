from pydantic import BaseModel

from app.modules.members.schemas import ReadingProgressOut


class GuardianLinkCreate(BaseModel):
    guardian_id: str
    member_id: str


class GuardianChildOut(BaseModel):
    id: str
    full_name: str
    email: str
    currently_reading: list[ReadingProgressOut]
    completed: list[ReadingProgressOut]

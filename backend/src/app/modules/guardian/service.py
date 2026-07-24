from fastapi import HTTPException, status
from prisma.errors import ForeignKeyViolationError, UniqueViolationError

from app.modules.guardian import repository
from app.modules.guardian.schemas import GuardianChildOut, GuardianLinkCreate
from app.modules.members.repository import list_reading_progress
from app.modules.members.schemas import ReadingProgressOut


async def link_child(payload: GuardianLinkCreate) -> None:
    try:
        await repository.create_link(
            guardian_id=payload.guardian_id, member_id=payload.member_id
        )
    except UniqueViolationError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This member already has a guardian",
        ) from exc
    except ForeignKeyViolationError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardian or member not found",
        ) from exc


async def list_my_children(guardian_id: str) -> list[GuardianChildOut]:
    children = await repository.list_children(guardian_id)

    result = []
    for child in children:
        child_progress = await list_reading_progress(child.id)
        progress = [ReadingProgressOut.from_prisma(p) for p in child_progress]
        result.append(
            GuardianChildOut(
                id=child.id,
                full_name=child.fullName,
                email=child.email,
                currently_reading=[p for p in progress if p.status == "reading"],
                completed=[p for p in progress if p.status == "completed"],
            )
        )
    return result

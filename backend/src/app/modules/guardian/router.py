from typing import Annotated

from fastapi import APIRouter, Depends, status
from prisma.models import User

from app.api.deps import require_role
from app.core.constants import Role
from app.modules.guardian import service
from app.modules.guardian.schemas import GuardianChildOut, GuardianLinkCreate

router = APIRouter(prefix="/guardian", tags=["guardian"])

manage_links = require_role(Role.ADMIN, Role.LIBRARIAN, Role.MANAGER)
as_guardian = require_role(Role.GUARDIAN)


@router.post("/links", status_code=status.HTTP_201_CREATED)
async def create_link(
    payload: GuardianLinkCreate,
    _: Annotated[User, Depends(manage_links)],
) -> None:
    await service.link_child(payload)


@router.get("/children", response_model=list[GuardianChildOut])
async def list_children(
    user: Annotated[User, Depends(as_guardian)],
) -> list[GuardianChildOut]:
    return await service.list_my_children(user.id)

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from prisma.models import User

from app.api.deps import require_role
from app.modules.members import service
from app.modules.members.schemas import MemberCreate, MemberListResponse, MemberOut, MemberUpdate

router = APIRouter(prefix="/members", tags=["members"])

manage_members = require_role("admin", "librarian", "manager")


@router.get("", response_model=MemberListResponse)
async def list_members(
    _: Annotated[User, Depends(manage_members)],
    search: Annotated[str | None, Query(description="Match against full name or email")] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> MemberListResponse:
    return await service.list_members(search=search, page=page, page_size=page_size)


@router.post("", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
async def create_member(
    payload: MemberCreate,
    _: Annotated[User, Depends(manage_members)],
) -> MemberOut:
    return await service.create_member(payload)


@router.put("/{member_id}", response_model=MemberOut)
async def update_member(
    member_id: UUID,
    payload: MemberUpdate,
    _: Annotated[User, Depends(manage_members)],
) -> MemberOut:
    return await service.update_member(str(member_id), payload)

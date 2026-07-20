from fastapi import HTTPException, status
from prisma.errors import UniqueViolationError

from app.core.security import hash_password
from app.modules.members import repository
from app.modules.members.schemas import MemberCreate, MemberListResponse, MemberOut, MemberUpdate


async def list_members(*, search: str | None, page: int, page_size: int) -> MemberListResponse:
    items, total = await repository.list_members(search=search, page=page, page_size=page_size)
    return MemberListResponse(
        items=[MemberOut.from_prisma(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
    )


async def create_member(payload: MemberCreate) -> MemberOut:
    role = await repository.upsert_role(payload.role_name)

    try:
        user = await repository.create_member(
            email=payload.email,
            password_hash=hash_password(payload.password),
            full_name=payload.full_name,
            phone=payload.phone,
            avatar_url=payload.avatar_url,
            role_id=role.id,
        )
    except UniqueViolationError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A member with this email already exists",
        ) from exc

    return MemberOut.from_prisma(user)


async def update_member(member_id: str, payload: MemberUpdate) -> MemberOut:
    existing = await repository.find_by_id(member_id)
    if existing is None or existing.deletedAt is not None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")

    fields_set = payload.model_fields_set
    data: dict = {}
    if payload.full_name is not None:
        data["fullName"] = payload.full_name
    if "phone" in fields_set:
        data["phone"] = payload.phone
    if "avatar_url" in fields_set:
        data["avatarUrl"] = payload.avatar_url
    if payload.is_active is not None:
        data["isActive"] = payload.is_active
    if payload.role_name is not None:
        role = await repository.upsert_role(payload.role_name)
        data["roleId"] = role.id

    if not data:
        return MemberOut.from_prisma(existing)

    updated = await repository.update_member(member_id, data)
    return MemberOut.from_prisma(updated)

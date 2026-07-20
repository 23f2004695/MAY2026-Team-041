from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RoleOut(BaseModel):
    id: str
    name: str


class MemberCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1, max_length=150)
    phone: str | None = Field(default=None, max_length=20)
    avatar_url: str | None = None
    role_name: str = Field(
        default="member",
        description="Defaults to 'member'",
    )


class MemberUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=150)
    phone: str | None = Field(default=None, max_length=20)
    avatar_url: str | None = None
    is_active: bool | None = None
    role_name: str | None = None


class MemberOut(BaseModel):
    id: str
    email: str
    full_name: str
    phone: str | None
    avatar_url: str | None
    role: RoleOut
    is_active: bool
    last_login_at: datetime | None
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def from_prisma(user) -> "MemberOut":
        return MemberOut(
            id=user.id,
            email=user.email,
            full_name=user.fullName,
            phone=user.phone,
            avatar_url=user.avatarUrl,
            role=RoleOut(id=user.role.id, name=user.role.name),
            is_active=user.isActive,
            last_login_at=user.lastLoginAt,
            created_at=user.createdAt,
            updated_at=user.updatedAt,
        )


class MemberListResponse(BaseModel):
    items: list[MemberOut]
    total: int
    page: int
    page_size: int

from prisma.models import Role, User

from app.db.prisma import prisma

MEMBER_INCLUDE = {"role": True}


async def get_role_by_name(name: str) -> Role | None:
    return await prisma.role.find_unique(where={"name": name})


async def upsert_role(name: str) -> Role:
    return await prisma.role.upsert(
        where={"name": name},
        data={"create": {"name": name}, "update": {}},
    )


async def find_by_id(member_id: str) -> User | None:
    return await prisma.user.find_unique(where={"id": member_id}, include=MEMBER_INCLUDE)


async def list_members(*, search: str | None, page: int, page_size: int) -> tuple[list[User], int]:
    where: dict = {"deletedAt": None}
    if search:
        where["OR"] = [
            {"fullName": {"contains": search, "mode": "insensitive"}},
            {"email": {"contains": search, "mode": "insensitive"}},
        ]

    total = await prisma.user.count(where=where)
    items = await prisma.user.find_many(
        where=where,
        include=MEMBER_INCLUDE,
        order={"createdAt": "desc"},
        skip=(page - 1) * page_size,
        take=page_size,
    )
    return items, total


async def create_member(
    *,
    email: str,
    password_hash: str,
    full_name: str,
    phone: str | None,
    avatar_url: str | None,
    role_id: str,
) -> User:
    return await prisma.user.create(
        data={
            "email": email,
            "passwordHash": password_hash,
            "fullName": full_name,
            "phone": phone,
            "avatarUrl": avatar_url,
            "roleId": role_id,
        },
        include=MEMBER_INCLUDE,
    )


async def update_member(member_id: str, data: dict) -> User:
    return await prisma.user.update(where={"id": member_id}, data=data, include=MEMBER_INCLUDE)

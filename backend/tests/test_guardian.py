import os
import uuid

os.environ["APP_ENV"] = "test"

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings
from app.core.constants import Role
from app.core.security import hash_password
from app.db.prisma import prisma
from app.main import create_app
from app.modules.members import repository

os.environ.setdefault("DATABASE_URL", get_settings().database_url)

TEST_EMAIL_DOMAIN = "@guardian-test.example.com"


def _unique_email() -> str:
    return f"{uuid.uuid4().hex}{TEST_EMAIL_DOMAIN}"


@pytest_asyncio.fixture(scope="module", autouse=True)
async def _db_connection():
    await prisma.connect()
    yield
    await prisma.readingprogress.delete_many(
        where={"member": {"email": {"endswith": TEST_EMAIL_DOMAIN}}}
    )
    await prisma.guardianlink.delete_many(
        where={"member": {"email": {"endswith": TEST_EMAIL_DOMAIN}}}
    )
    await prisma.book.delete_many(where={"title": {"startswith": "Guardian Test Book"}})
    await prisma.user.delete_many(where={"email": {"endswith": TEST_EMAIL_DOMAIN}})
    await prisma.disconnect()


@pytest_asyncio.fixture
async def client():
    app = create_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client


async def _make_user(role_name: str) -> object:
    role = await repository.upsert_role(role_name)
    return await repository.create_member(
        email=_unique_email(),
        password_hash=hash_password("Password123!"),
        full_name=f"{role_name.title()} User",
        phone=None,
        avatar_url=None,
        role_id=role.id,
    )


async def _login(client: AsyncClient, user) -> str:
    response = await client.post(
        "/api/v1/auth/login", json={"email": user.email, "password": "Password123!"}
    )
    return response.json()["access_token"]


async def test_member_cannot_have_two_guardians(client):
    admin = await _make_user(Role.ADMIN)
    guardian_one = await _make_user(Role.GUARDIAN)
    guardian_two = await _make_user(Role.GUARDIAN)
    member = await _make_user(Role.MEMBER)
    admin_token = await _login(client, admin)
    headers = {"Authorization": f"Bearer {admin_token}"}

    first = await client.post(
        "/api/v1/guardian/links",
        json={"guardian_id": guardian_one.id, "member_id": member.id},
        headers=headers,
    )
    assert first.status_code == 201

    second = await client.post(
        "/api/v1/guardian/links",
        json={"guardian_id": guardian_two.id, "member_id": member.id},
        headers=headers,
    )
    assert second.status_code == 409


async def test_guardian_sees_linked_member_reading_progress(client):
    admin = await _make_user(Role.ADMIN)
    guardian = await _make_user(Role.GUARDIAN)
    member = await _make_user(Role.MEMBER)
    admin_token = await _login(client, admin)

    await client.post(
        "/api/v1/guardian/links",
        json={"guardian_id": guardian.id, "member_id": member.id},
        headers={"Authorization": f"Bearer {admin_token}"},
    )

    book = await prisma.book.create(
        data={"title": "Guardian Test Book", "author": "Test Author", "category": "Fiction"}
    )
    member_token = await _login(client, member)
    await client.put(
        "/api/v1/members/me/reading-progress",
        json={"book_id": book.id, "status": "reading", "percent_complete": 40},
        headers={"Authorization": f"Bearer {member_token}"},
    )

    guardian_token = await _login(client, guardian)
    response = await client.get(
        "/api/v1/guardian/children", headers={"Authorization": f"Bearer {guardian_token}"}
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == member.id
    assert len(body[0]["currently_reading"]) == 1
    assert body[0]["currently_reading"][0]["book_title"] == "Guardian Test Book"
    assert body[0]["currently_reading"][0]["percent_complete"] == 40
    assert body[0]["completed"] == []


async def test_guardian_children_requires_guardian_role(client):
    member = await _make_user(Role.MEMBER)
    token = await _login(client, member)

    response = await client.get(
        "/api/v1/guardian/children", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 403

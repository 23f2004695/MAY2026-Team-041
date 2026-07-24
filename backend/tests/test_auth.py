import os
import uuid

os.environ["APP_ENV"] = "test"

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings
from app.core.constants import Role
from app.core.security import create_access_token, create_refresh_token, hash_password
from app.db.prisma import prisma
from app.main import create_app
from app.modules.members import repository as member_repository

os.environ.setdefault("DATABASE_URL", get_settings().database_url)

TEST_EMAIL_DOMAIN = "@auth-test.example.com"


def _unique_email() -> str:
    return f"{uuid.uuid4().hex}{TEST_EMAIL_DOMAIN}"


async def _make_user(role_name: str, *, is_active: bool = True):
    role = await member_repository.upsert_role(role_name)
    user = await member_repository.create_member(
        email=_unique_email(),
        password_hash=hash_password("Password123!"),
        full_name=f"Test {role_name.title()}",
        phone=None,
        avatar_url=None,
        role_id=role.id,
    )
    if not is_active:
        user = await prisma.user.update(where={"id": user.id}, data={"isActive": False})
    return user


@pytest_asyncio.fixture(scope="module", autouse=True)
async def _db_connection():
    await prisma.connect()
    yield
    await prisma.user.delete_many(where={"email": {"endswith": TEST_EMAIL_DOMAIN}})
    await prisma.disconnect()


@pytest_asyncio.fixture
async def admin_user():
    return await _make_user(Role.ADMIN)


def _anon_client() -> AsyncClient:
    app = create_app()
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def test_refresh_returns_new_token_pair(admin_user):
    refresh_token = create_refresh_token(admin_user.id, admin_user.tokenVersion)

    async with _anon_client() as client:
        response = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"] != refresh_token


async def test_refresh_rejects_reused_token(admin_user):
    refresh_token = create_refresh_token(admin_user.id, admin_user.tokenVersion)

    async with _anon_client() as client:
        first = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
        second = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})

    assert first.status_code == 200
    assert second.status_code == 401


async def test_refresh_reuse_also_revokes_latest_token(admin_user):
    original = create_refresh_token(admin_user.id, admin_user.tokenVersion)

    async with _anon_client() as client:
        first = await client.post("/api/v1/auth/refresh", json={"refresh_token": original})
        rotated_token = first.json()["refresh_token"]

        replay = await client.post("/api/v1/auth/refresh", json={"refresh_token": original})
        legitimate_attempt = await client.post(
            "/api/v1/auth/refresh", json={"refresh_token": rotated_token}
        )

    assert first.status_code == 200
    assert replay.status_code == 401
    assert legitimate_attempt.status_code == 401


async def test_refresh_rejects_access_token(admin_user):
    access_token = create_access_token(admin_user.id)

    async with _anon_client() as client:
        response = await client.post("/api/v1/auth/refresh", json={"refresh_token": access_token})

    assert response.status_code == 401


async def test_refresh_rejects_malformed_token():
    async with _anon_client() as client:
        response = await client.post("/api/v1/auth/refresh", json={"refresh_token": "not-a-jwt"})

    assert response.status_code == 401


async def test_refresh_rejects_inactive_user():
    user = await _make_user(Role.MEMBER, is_active=False)
    refresh_token = create_refresh_token(user.id, user.tokenVersion)

    async with _anon_client() as client:
        response = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})

    assert response.status_code == 401


async def test_new_access_token_authenticates_a_real_protected_route(admin_user):
    refresh_token = create_refresh_token(admin_user.id, admin_user.tokenVersion)

    async with _anon_client() as client:
        refreshed = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
        access_token = refreshed.json()["access_token"]

        response = await client.get(
            "/api/v1/members", headers={"Authorization": f"Bearer {access_token}"}
        )

    assert response.status_code == 200

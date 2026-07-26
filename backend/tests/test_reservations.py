import os
import uuid

os.environ["APP_ENV"] = "test"

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings
from app.core.constants import Role
from app.db.prisma import prisma
from app.main import create_app
from app.modules.members import repository as member_repository

os.environ.setdefault("DATABASE_URL", get_settings().database_url)

TEST_EMAIL_DOMAIN = "@reservations-test.example.com"
TEST_TITLE_MARKER = "RESERVATIONS-TEST-"


def _unique_email() -> str:
    return f"{uuid.uuid4().hex}{TEST_EMAIL_DOMAIN}"


def _book_payload(**overrides) -> dict:
    payload = {
        "title": f"{TEST_TITLE_MARKER}{uuid.uuid4().hex}",
        "author": "Test Author",
        "category": "Fiction",
        "total_copies": 1,
    }
    payload.update(overrides)
    return payload


async def _make_user(role_name: str):
    role = await member_repository.upsert_role(role_name)
    return await member_repository.create_member(
        email=_unique_email(),
        password_hash=None,
        full_name=f"Test {role_name.title()}",
        phone=None,
        avatar_url=None,
        role_id=role.id,
    )


@pytest_asyncio.fixture(scope="module", autouse=True)
async def _db_connection():
    await prisma.connect()
    yield
    await prisma.reservation.delete_many(
        where={"member": {"email": {"endswith": TEST_EMAIL_DOMAIN}}}
    )
    await prisma.book.delete_many(where={"title": {"startswith": TEST_TITLE_MARKER}})
    await prisma.user.delete_many(where={"email": {"endswith": TEST_EMAIL_DOMAIN}})
    await prisma.disconnect()


@pytest_asyncio.fixture
async def member_user():
    return await _make_user(Role.MEMBER)


@pytest_asyncio.fixture
async def librarian_user():
    return await _make_user(Role.LIBRARIAN)


def _client_as(user) -> AsyncClient:
    from app.api.deps import get_current_user

    app = create_app()
    app.dependency_overrides[get_current_user] = lambda: user
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def _create_book(librarian_user, **overrides) -> str:
    async with _client_as(librarian_user) as client:
        response = await client.post("/api/v1/books", json=_book_payload(**overrides))
    return response.json()["id"]


async def test_reserve_book_requires_authentication():
    app = create_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/reservations", json={"book_id": str(uuid.uuid4())})

    assert response.status_code == 401


async def test_reserve_available_book_holds_a_copy(member_user, librarian_user):
    book_id = await _create_book(librarian_user, total_copies=1)

    async with _client_as(member_user) as client:
        response = await client.post("/api/v1/reservations", json={"book_id": book_id})
        book_after = await client.get(f"/api/v1/books/{book_id}")
        notifications = await client.get("/api/v1/notifications/me")

    assert response.status_code == 201
    body = response.json()
    assert body["book_id"] == book_id
    assert body["status"] == "active"
    assert book_after.json()["total_copies"] == 0
    assert book_after.json()["available"] is False
    assert any(n["type"] == "reservation-ready" for n in notifications.json())


async def test_reserve_unavailable_book_conflicts(member_user, librarian_user):
    book_id = await _create_book(librarian_user, total_copies=0)

    async with _client_as(member_user) as client:
        response = await client.post("/api/v1/reservations", json={"book_id": book_id})

    assert response.status_code == 409


async def test_list_my_reservations_only_shows_active_ones(member_user, librarian_user):
    book_id = await _create_book(librarian_user, total_copies=1)

    async with _client_as(member_user) as client:
        created = await client.post("/api/v1/reservations", json={"book_id": book_id})
        reservation_id = created.json()["id"]
        listed_before = await client.get("/api/v1/reservations/me")

        await client.delete(f"/api/v1/reservations/{reservation_id}")
        listed_after = await client.get("/api/v1/reservations/me")

    assert any(r["id"] == reservation_id for r in listed_before.json())
    assert all(r["id"] != reservation_id for r in listed_after.json())


async def test_cancel_reservation_returns_the_copy(member_user, librarian_user):
    book_id = await _create_book(librarian_user, total_copies=1)

    async with _client_as(member_user) as client:
        created = await client.post("/api/v1/reservations", json={"book_id": book_id})
        reservation_id = created.json()["id"]

        cancel_response = await client.delete(f"/api/v1/reservations/{reservation_id}")
        book_after = await client.get(f"/api/v1/books/{book_id}")

    assert cancel_response.status_code == 204
    assert book_after.json()["total_copies"] == 1
    assert book_after.json()["available"] is True


async def test_cancel_reservation_twice_is_not_found(member_user, librarian_user):
    book_id = await _create_book(librarian_user, total_copies=1)

    async with _client_as(member_user) as client:
        created = await client.post("/api/v1/reservations", json={"book_id": book_id})
        reservation_id = created.json()["id"]

        await client.delete(f"/api/v1/reservations/{reservation_id}")
        second_cancel = await client.delete(f"/api/v1/reservations/{reservation_id}")

    assert second_cancel.status_code == 404


async def test_cancel_another_members_reservation_is_not_found(member_user, librarian_user):
    other_member = await _make_user(Role.MEMBER)
    book_id = await _create_book(librarian_user, total_copies=1)

    async with _client_as(member_user) as client:
        created = await client.post("/api/v1/reservations", json={"book_id": book_id})
        reservation_id = created.json()["id"]

    async with _client_as(other_member) as client:
        response = await client.delete(f"/api/v1/reservations/{reservation_id}")

    assert response.status_code == 404

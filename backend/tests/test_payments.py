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

TEST_EMAIL_DOMAIN = "@payments-test.example.com"


def _unique_email() -> str:
    return f"{uuid.uuid4().hex}{TEST_EMAIL_DOMAIN}"


@pytest_asyncio.fixture(scope="module", autouse=True)
async def _db_connection():
    await prisma.connect()
    yield
    await prisma.payment.delete_many(where={"user": {"email": {"endswith": TEST_EMAIL_DOMAIN}}})
    await prisma.user.delete_many(where={"email": {"endswith": TEST_EMAIL_DOMAIN}})
    await prisma.disconnect()


@pytest_asyncio.fixture
async def member_user():
    role = await repository.upsert_role(Role.MEMBER)
    return await repository.create_member(
        email=_unique_email(),
        password_hash=hash_password("Password123!"),
        full_name="Payer",
        phone=None,
        avatar_url=None,
        role_id=role.id,
    )


@pytest_asyncio.fixture
async def client():
    app = create_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client


async def test_create_payment_requires_authentication(client):
    response = await client.post("/api/v1/payments", json={"amount": 499, "label": "1 Month"})

    assert response.status_code == 401


async def test_create_payment_records_it_for_the_current_user(client, member_user):
    login = await client.post(
        "/api/v1/auth/login", json={"email": member_user.email, "password": "Password123!"}
    )
    token = login.json()["access_token"]

    response = await client.post(
        "/api/v1/payments",
        json={"amount": 499, "label": "1 Month — ₹499"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["amount"] == 499
    assert body["label"] == "1 Month — ₹499"
    assert body["status"] == "success"


async def test_create_payment_rejects_non_positive_amount(client, member_user):
    login = await client.post(
        "/api/v1/auth/login", json={"email": member_user.email, "password": "Password123!"}
    )
    token = login.json()["access_token"]

    response = await client.post(
        "/api/v1/payments",
        json={"amount": 0, "label": "Free?"},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 422


async def test_membership_requires_authentication(client):
    response = await client.get("/api/v1/payments/me/membership")

    assert response.status_code == 401


async def test_membership_is_null_with_no_plan_payments(client, member_user):
    login = await client.post(
        "/api/v1/auth/login", json={"email": member_user.email, "password": "Password123!"}
    )
    token = login.json()["access_token"]

    response = await client.get(
        "/api/v1/payments/me/membership", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json() is None


async def test_membership_ignores_fine_payments_without_plan_months(client, member_user):
    login = await client.post(
        "/api/v1/auth/login", json={"email": member_user.email, "password": "Password123!"}
    )
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    await client.post(
        "/api/v1/payments", json={"amount": 15, "label": "Fine owed"}, headers=headers
    )

    response = await client.get("/api/v1/payments/me/membership", headers=headers)

    assert response.status_code == 200
    assert response.json() is None


async def test_membership_reflects_latest_plan_payment(client, member_user):
    login = await client.post(
        "/api/v1/auth/login", json={"email": member_user.email, "password": "Password123!"}
    )
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    await client.post(
        "/api/v1/payments",
        json={"amount": 499, "label": "1 Month — ₹499", "plan_months": 1},
        headers=headers,
    )

    response = await client.get("/api/v1/payments/me/membership", headers=headers)

    assert response.status_code == 200
    body = response.json()
    assert body["plan_label"] == "1 Month — ₹499"
    assert body["is_active"] is True

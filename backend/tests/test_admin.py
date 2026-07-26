import os
import uuid

os.environ["APP_ENV"] = "test"

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.core.constants import Role
from app.db.prisma import prisma
from app.main import create_app
from app.modules.members import repository as member_repository

os.environ.setdefault("DATABASE_URL", get_settings().database_url)

TEST_EMAIL_DOMAIN = "@admin-dashboard-test.example.com"


def _unique_email() -> str:
    return f"{uuid.uuid4().hex}{TEST_EMAIL_DOMAIN}"


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
    domain_filter = {"email": {"endswith": TEST_EMAIL_DOMAIN}}
    await prisma.expense.delete_many(where={"loggedBy": domain_filter})
    await prisma.payment.delete_many(where={"user": domain_filter})
    await prisma.user.delete_many(where=domain_filter)
    await prisma.disconnect()


@pytest_asyncio.fixture
async def admin_user():
    return await _make_user(Role.ADMIN)


@pytest_asyncio.fixture
async def member_user():
    return await _make_user(Role.MEMBER)


def _client_as(user) -> AsyncClient:
    app = create_app()
    app.dependency_overrides[get_current_user] = lambda: user
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


def _anon_client() -> AsyncClient:
    app = create_app()
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def _get_dashboard(user) -> dict:
    async with _client_as(user) as client:
        response = await client.get("/api/v1/admin/dashboard")
    assert response.status_code == 200
    return response.json()


async def test_dashboard_requires_authentication():
    async with _anon_client() as client:
        response = await client.get("/api/v1/admin/dashboard")
    assert response.status_code == 401


async def test_dashboard_forbidden_for_member(member_user):
    async with _client_as(member_user) as client:
        response = await client.get("/api/v1/admin/dashboard")
    assert response.status_code == 403


async def test_dashboard_has_the_right_shape(admin_user):
    body = await _get_dashboard(admin_user)
    assert set(body.keys()) == {"stats", "cash_flow", "budget", "seat_status", "seat_occupancy"}
    assert len(body["cash_flow"]) == 4
    assert len(body["budget"]) == 4
    assert body["seat_status"]["total"] == 32
    assert len(body["seat_occupancy"]) == 12  # 9 AM - 8 PM


async def test_membership_payment_increases_revenue_and_membership_fees(
    admin_user, member_user
):
    before = await _get_dashboard(admin_user)

    async with _client_as(member_user) as client:
        response = await client.post(
            "/api/v1/payments",
            json={"amount": 499, "label": "1 Month — ₹499", "plan_months": 1},
        )
    assert response.status_code == 201

    after = await _get_dashboard(admin_user)

    assert after["stats"]["revenue_mtd"] == before["stats"]["revenue_mtd"] + 499
    membership_before = next(s for s in before["cash_flow"] if s["source"] == "membershipFees")
    membership_after = next(s for s in after["cash_flow"] if s["source"] == "membershipFees")
    assert membership_after["amount"] == membership_before["amount"] + 499


async def test_fine_payment_increases_revenue_but_not_membership_fees(admin_user, member_user):
    before = await _get_dashboard(admin_user)

    async with _client_as(member_user) as client:
        response = await client.post(
            "/api/v1/payments", json={"amount": 20, "label": "Overdue fine"}
        )
    assert response.status_code == 201

    after = await _get_dashboard(admin_user)

    assert after["stats"]["revenue_mtd"] == before["stats"]["revenue_mtd"] + 20
    membership_before = next(s for s in before["cash_flow"] if s["source"] == "membershipFees")
    membership_after = next(s for s in after["cash_flow"] if s["source"] == "membershipFees")
    assert membership_after["amount"] == membership_before["amount"]
    fines_before = next(s for s in before["cash_flow"] if s["source"] == "finesCollected")
    fines_after = next(s for s in after["cash_flow"] if s["source"] == "finesCollected")
    assert fines_after["amount"] == fines_before["amount"] + 20


async def test_log_expense_requires_admin_role(member_user):
    async with _client_as(member_user) as client:
        response = await client.post(
            "/api/v1/admin/expenses", json={"category": "marketing", "amount": 50}
        )
    assert response.status_code == 403


async def test_log_expense_increases_expenses_and_budget_spent(admin_user):
    before = await _get_dashboard(admin_user)

    async with _client_as(admin_user) as client:
        response = await client.post(
            "/api/v1/admin/expenses", json={"category": "marketing", "amount": 150}
        )
    assert response.status_code == 201
    assert response.json()["category"] == "marketing"
    assert response.json()["amount"] == 150

    after = await _get_dashboard(admin_user)

    assert after["stats"]["expenses_mtd"] == before["stats"]["expenses_mtd"] + 150
    assert after["stats"]["net_profit_mtd"] == before["stats"]["net_profit_mtd"] - 150
    marketing_before = next(c for c in before["budget"] if c["category"] == "marketing")
    marketing_after = next(c for c in after["budget"] if c["category"] == "marketing")
    assert marketing_after["spent"] == marketing_before["spent"] + 150
    assert marketing_after["budgeted"] == marketing_before["budgeted"]


async def test_log_expense_rejects_non_positive_amount(admin_user):
    async with _client_as(admin_user) as client:
        response = await client.post(
            "/api/v1/admin/expenses", json={"category": "marketing", "amount": 0}
        )
    assert response.status_code == 422


async def test_log_expense_rejects_unknown_category(admin_user):
    async with _client_as(admin_user) as client:
        response = await client.post(
            "/api/v1/admin/expenses", json={"category": "not-a-category", "amount": 10}
        )
    assert response.status_code == 422

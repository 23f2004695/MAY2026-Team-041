import asyncio
import contextlib
import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.routes.health import router as health_router
from app.core.config import Settings, get_settings
from app.core.logging import configure_logging
from app.core.rate_limit import limiter
from app.db.prisma import prisma
from app.modules.admin.router import router as admin_router
from app.modules.auth.router import router as auth_router
from app.modules.billing_requests.router import router as billing_requests_router
from app.modules.book_records.router import router as book_records_router
from app.modules.books.router import router as books_router
from app.modules.chat.router import router as chat_router
from app.modules.community.router import router as community_router
from app.modules.contact.router import router as contact_router
from app.modules.coupons.router import router as coupons_router
from app.modules.events.router import router as events_router
from app.modules.guardian.router import router as guardian_router
from app.modules.it_head.router import router as it_head_router
from app.modules.leaderboard.router import router as leaderboard_router
from app.modules.loans.router import router as loans_router
from app.modules.loans.service import send_due_soon_reminders
from app.modules.manager.router import router as manager_router
from app.modules.members.router import router as members_router
from app.modules.notifications.router import router as notifications_router
from app.modules.payments.router import router as payments_router
from app.modules.permission_requests.router import router as permission_requests_router
from app.modules.pricing_plans.router import router as pricing_plans_router
from app.modules.reservations.router import router as reservations_router
from app.modules.reviews.router import router as reviews_router
from app.modules.seat_booking.router import router as seat_booking_router
from app.modules.support_tickets.router import router as support_tickets_router
from app.modules.translate.router import router as translate_router

configure_logging()
logger = logging.getLogger(__name__)

REMINDER_LOOP_INTERVAL_SECONDS = 24 * 60 * 60


# This is an in-process asyncio task — running N app instances means N independent
# sweep loops, each on its own timer. That's safe from duplicate sends only because
# send_due_soon_reminders() checks Loan.lastRemindedAt (a DB-backed cooldown) before
# nudging, not because of anything here. Don't remove that check without accounting
# for multi-instance duplicate reminders.
async def _due_soon_reminder_loop() -> None:
    while True:
        # One bad run shouldn't kill the loop, but it must not vanish silently either.
        try:
            await send_due_soon_reminders()
        except Exception:
            logger.exception("send_due_soon_reminders failed")
        await asyncio.sleep(REMINDER_LOOP_INTERVAL_SECONDS)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    reminder_task: asyncio.Task | None = None
    if settings.app_env != "test":
        os.environ.setdefault("DATABASE_URL", settings.database_url)
        await prisma.connect()
        reminder_task = asyncio.create_task(_due_soon_reminder_loop())

    # ── Startup config summary ────────────────────────────────────────────
    llm_detail = {
        "bedrock": f"bedrock ({settings.bedrock_model_id}, region={settings.aws_region})",
        "ollama": f"ollama ({settings.ollama_model} @ {settings.ollama_base_url})",
        "openai": f"openai ({settings.openai_model})",
    }.get(settings.llm_mode.lower(), settings.llm_mode)
    print(f"""
╔══════════════════════════════════════════════════════╗
║              MAY2026 Team 041 — API                  ║
╠══════════════════════════════════════════════════════╣
║  DB   : {settings.database_url.split('@')[-1]:<44}║
║  LLM  : {llm_detail:<44}║
║  Redis: {settings.redis_url:<44}║
║  Env  : {settings.app_env:<44}║
╚══════════════════════════════════════════════════════╝
""")
    yield
    if reminder_task is not None:
        reminder_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await reminder_task
    if settings.app_env != "test":
        await prisma.disconnect()


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()

    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.backend_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(GZipMiddleware, minimum_size=1000)

    app.state.limiter = limiter
    # slowapi's own documented handler is typed for RateLimitExceeded specifically,
    # narrower than add_exception_handler's general Exception signature — safe at
    # runtime (Starlette dispatches by the registered exception type), just not
    # expressible in add_exception_handler's overloads.
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]
    app.add_middleware(SlowAPIMiddleware)

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

    app.include_router(health_router)
    app.include_router(auth_router, prefix=settings.api_prefix)
    app.include_router(members_router, prefix=settings.api_prefix)
    app.include_router(books_router, prefix=settings.api_prefix)
    app.include_router(book_records_router, prefix=settings.api_prefix)
    app.include_router(payments_router, prefix=settings.api_prefix)
    app.include_router(guardian_router, prefix=settings.api_prefix)
    app.include_router(manager_router, prefix=settings.api_prefix)
    app.include_router(reservations_router, prefix=settings.api_prefix)
    app.include_router(translate_router, prefix=settings.api_prefix)
    app.include_router(community_router, prefix=settings.api_prefix)
    app.include_router(contact_router, prefix=settings.api_prefix)
    app.include_router(seat_booking_router, prefix=settings.api_prefix)
    app.include_router(notifications_router, prefix=settings.api_prefix)
    app.include_router(reviews_router, prefix=settings.api_prefix)
    app.include_router(admin_router, prefix=settings.api_prefix)
    app.include_router(billing_requests_router, prefix=settings.api_prefix)
    app.include_router(pricing_plans_router, prefix=settings.api_prefix)
    app.include_router(coupons_router, prefix=settings.api_prefix)
    app.include_router(support_tickets_router, prefix=settings.api_prefix)
    app.include_router(events_router, prefix=settings.api_prefix)
    app.include_router(chat_router, prefix=settings.api_prefix)
    app.include_router(permission_requests_router, prefix=settings.api_prefix)
    app.include_router(loans_router, prefix=settings.api_prefix)
    app.include_router(it_head_router, prefix=settings.api_prefix)
    app.include_router(leaderboard_router, prefix=settings.api_prefix)
    return app


app = create_app()

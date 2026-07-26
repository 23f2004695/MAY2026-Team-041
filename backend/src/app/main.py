import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.core.config import Settings, get_settings
from app.db.prisma import prisma
from app.modules.admin.router import router as admin_router
from app.modules.auth.router import router as auth_router
from app.modules.books.router import router as books_router
from app.modules.community.router import router as community_router
from app.modules.guardian.router import router as guardian_router
from app.modules.members.router import router as members_router
from app.modules.notifications.router import router as notifications_router
from app.modules.payments.router import router as payments_router
from app.modules.reservations.router import router as reservations_router
from app.modules.reviews.router import router as reviews_router
from app.modules.seat_booking.router import router as seat_booking_router
from app.modules.translate.router import router as translate_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    if settings.app_env != "test":
        os.environ.setdefault("DATABASE_URL", settings.database_url)
        await prisma.connect()
    yield
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

    app.include_router(health_router)
    app.include_router(auth_router, prefix=settings.api_prefix)
    app.include_router(members_router, prefix=settings.api_prefix)
    app.include_router(books_router, prefix=settings.api_prefix)
    app.include_router(payments_router, prefix=settings.api_prefix)
    app.include_router(guardian_router, prefix=settings.api_prefix)
    app.include_router(reservations_router, prefix=settings.api_prefix)
    app.include_router(translate_router, prefix=settings.api_prefix)
    app.include_router(community_router, prefix=settings.api_prefix)
    app.include_router(seat_booking_router, prefix=settings.api_prefix)
    app.include_router(notifications_router, prefix=settings.api_prefix)
    app.include_router(reviews_router, prefix=settings.api_prefix)
    app.include_router(admin_router, prefix=settings.api_prefix)
    return app


app = create_app()

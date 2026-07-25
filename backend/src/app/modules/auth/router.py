from typing import Annotated

from fastapi import APIRouter, Depends, status
from prisma.models import User

from app.api.deps import get_current_user
from app.modules.auth import service
from app.modules.auth.schemas import (
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UpdateProfileRequest,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest) -> TokenResponse:
    return await service.register(payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    return await service.login(payload)


@router.post("/google", response_model=TokenResponse)
async def google(payload: GoogleLoginRequest) -> TokenResponse:
    return await service.google_login(payload)


@router.patch("/me", response_model=TokenResponse)
async def update_profile(
    payload: UpdateProfileRequest,
    user: Annotated[User, Depends(get_current_user)],
) -> TokenResponse:
    return await service.update_profile(user, payload)

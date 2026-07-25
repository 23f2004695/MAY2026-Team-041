from fastapi import HTTPException, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from prisma.errors import UniqueViolationError
from prisma.models import User

from app.core.config import get_settings
from app.core.constants import Role
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.schemas import (
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UpdateProfileRequest,
)
from app.modules.members import repository
from app.modules.members.schemas import MemberOut

InvalidCredentials = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
)


async def register(payload: RegisterRequest) -> TokenResponse:
    role = await repository.upsert_role(Role.MEMBER.value)

    try:
        user = await repository.create_member(
            email=payload.email,
            password_hash=hash_password(payload.password),
            full_name=payload.full_name,
            phone=payload.phone,
            avatar_url=None,
            role_id=role.id,
        )
    except UniqueViolationError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        ) from exc

    await repository.touch_last_login(user.id)
    return _issue_token(user)


async def login(payload: LoginRequest) -> TokenResponse:
    user = await repository.find_by_email(payload.email)
    if (
        user is None
        or user.passwordHash is None
        or not verify_password(payload.password, user.passwordHash)
    ):
        raise InvalidCredentials
    if not user.isActive or user.deletedAt is not None:
        raise InvalidCredentials

    await repository.touch_last_login(user.id)
    return _issue_token(user)


async def google_login(payload: GoogleLoginRequest) -> TokenResponse:
    settings = get_settings()
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google login is not configured on this server",
        )

    try:
        claims = google_id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            audience=settings.google_client_id,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token"
        ) from exc

    if not claims.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email is not verified",
        )

    email: str = claims["email"]
    user = await repository.find_by_email(email)
    is_new_user = user is None

    if user is None:
        role = await repository.upsert_role(Role.MEMBER.value)
        user = await repository.create_member(
            email=email,
            password_hash=None,
            full_name=claims.get("name") or email.split("@")[0],
            phone=None,
            avatar_url=claims.get("picture"),
            role_id=role.id,
        )
    elif not user.isActive or user.deletedAt is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="This account is disabled"
        )

    await repository.touch_last_login(user.id)
    return _issue_token(user, is_new_user=is_new_user)


async def update_profile(user: User, payload: UpdateProfileRequest) -> TokenResponse:
    fields_set = payload.model_fields_set
    data: dict = {}
    if payload.full_name is not None:
        data["fullName"] = payload.full_name
    if "phone" in fields_set:
        data["phone"] = payload.phone
    if payload.password is not None:
        data["passwordHash"] = hash_password(payload.password)
    if "avatar_url" in fields_set:
        data["avatarUrl"] = payload.avatar_url

    updated = await repository.update_member(user.id, data) if data else user
    return _issue_token(updated)


def _issue_token(user: User, *, is_new_user: bool = False) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user.id),
        user=MemberOut.from_prisma(user),
        is_new_user=is_new_user,
    )

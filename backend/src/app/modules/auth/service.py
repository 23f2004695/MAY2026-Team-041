import jwt
from fastapi import HTTPException, status

from app.core.security import create_access_token, create_refresh_token, decode_token
from app.db.prisma import prisma
from app.modules.auth.schemas import RefreshRequest, TokenPair

InvalidRefreshTokenError = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired refresh token",
)


async def refresh_tokens(payload: RefreshRequest) -> TokenPair:
    try:
        claims = decode_token(payload.refresh_token)
    except jwt.InvalidTokenError as exc:
        raise InvalidRefreshTokenError from exc

    if claims.get("type") != "refresh":
        raise InvalidRefreshTokenError

    user_id = claims.get("sub")
    token_version = claims.get("ver")
    if user_id is None or token_version is None:
        raise InvalidRefreshTokenError

    user = await prisma.user.find_unique(where={"id": user_id})
    if user is None or user.deletedAt is not None or not user.isActive:
        raise InvalidRefreshTokenError

    if token_version != user.tokenVersion:
        await prisma.user.update(where={"id": user_id}, data={"tokenVersion": {"increment": 1}})
        raise InvalidRefreshTokenError

    rotated = await prisma.user.update(
        where={"id": user_id}, data={"tokenVersion": {"increment": 1}}
    )

    return TokenPair(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id, rotated.tokenVersion),
    )

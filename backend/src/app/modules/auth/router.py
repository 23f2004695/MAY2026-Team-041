from fastapi import APIRouter

from app.modules.auth import service
from app.modules.auth.schemas import RefreshRequest, TokenPair

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest) -> TokenPair:
    return await service.refresh_tokens(payload)

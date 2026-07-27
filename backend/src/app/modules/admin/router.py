from typing import Annotated

from fastapi import APIRouter, Depends, status
from prisma.models import User

from app.api.deps import require_role
from app.core.constants import Role
from app.modules.admin import service
from app.modules.admin.schemas import AdminDashboardOut, ExpenseCreate, ExpenseOut

router = APIRouter(prefix="/admin", tags=["admin"])

manage_admin = require_role(Role.ADMIN)


@router.get("/dashboard", response_model=AdminDashboardOut)
async def get_dashboard(_: Annotated[User, Depends(manage_admin)]) -> AdminDashboardOut:
    return await service.get_dashboard()


@router.post("/expenses", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
async def log_expense(
    payload: ExpenseCreate, user: Annotated[User, Depends(manage_admin)]
) -> ExpenseOut:
    return await service.log_expense(user.id, payload)

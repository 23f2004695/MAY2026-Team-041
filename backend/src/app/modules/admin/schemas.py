from datetime import datetime

from pydantic import BaseModel, Field

from app.modules.admin.constants import ExpenseCategory


class TrendOut(BaseModel):
    direction: str  # "up" | "down"
    percent: int


class AdminStatsOut(BaseModel):
    revenue_mtd: int
    revenue_trend: TrendOut
    expenses_mtd: int
    expenses_trend: TrendOut
    net_profit_mtd: int
    net_profit_trend: TrendOut
    total_members: int
    total_members_trend: TrendOut


class RevenueSourceOut(BaseModel):
    source: str  # membershipFees | eventTickets | finesCollected | donationsValue
    amount: int


class BudgetCategoryOut(BaseModel):
    category: ExpenseCategory
    budgeted: int
    spent: int


class ExpenseCreate(BaseModel):
    category: ExpenseCategory
    amount: int = Field(gt=0)


class ExpenseOut(BaseModel):
    id: str
    category: str
    amount: int
    created_at: datetime

    @staticmethod
    def from_prisma(expense) -> "ExpenseOut":
        return ExpenseOut(
            id=expense.id,
            category=expense.category,
            amount=expense.amount,
            created_at=expense.createdAt,
        )


class SeatStatusOut(BaseModel):
    available: int
    booked: int
    total: int


class SeatOccupancySlotOut(BaseModel):
    hour: int
    percent_filled: int


class AdminDashboardOut(BaseModel):
    stats: AdminStatsOut
    cash_flow: list[RevenueSourceOut]
    budget: list[BudgetCategoryOut]
    seat_status: SeatStatusOut
    seat_occupancy: list[SeatOccupancySlotOut]

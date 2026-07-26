from datetime import UTC, datetime, timedelta

from app.modules.admin import repository
from app.modules.admin.constants import EXPENSE_BUDGETS, OPEN_HOURS
from app.modules.admin.schemas import (
    AdminDashboardOut,
    AdminStatsOut,
    BudgetCategoryOut,
    ExpenseCreate,
    ExpenseOut,
    RevenueSourceOut,
    SeatOccupancySlotOut,
    SeatStatusOut,
    TrendOut,
)
from app.modules.seat_booking.constants import SEAT_LABELS

TOTAL_SEATS = len(SEAT_LABELS)


def _month_start(moment: datetime) -> datetime:
    return datetime(moment.year, moment.month, 1, tzinfo=UTC)


def _previous_month_start(moment: datetime) -> datetime:
    last_day_of_previous_month = _month_start(moment) - timedelta(days=1)
    return _month_start(last_day_of_previous_month)


def _trend(current: int, previous: int) -> TrendOut:
    if previous == 0:
        return TrendOut(direction="up", percent=100 if current > 0 else 0)
    percent = round(abs(current - previous) / previous * 100)
    return TrendOut(direction="up" if current >= previous else "down", percent=percent)


async def get_dashboard() -> AdminDashboardOut:
    now = datetime.now(UTC)
    this_month_start = _month_start(now)
    last_month_start = _previous_month_start(now)

    revenue_mtd = await repository.sum_payments(start=this_month_start)
    revenue_last_month = await repository.sum_payments(start=last_month_start, end=this_month_start)
    membership_fees = await repository.sum_payments(start=this_month_start, has_plan=True)
    fines_collected = await repository.sum_payments(start=this_month_start, has_plan=False)

    expenses_mtd = await repository.sum_expenses(start=this_month_start)
    expenses_last_month = await repository.sum_expenses(start=last_month_start, end=this_month_start)

    net_profit_mtd = revenue_mtd - expenses_mtd
    net_profit_last_month = revenue_last_month - expenses_last_month

    total_members = await repository.count_members()
    total_members_last_month = await repository.count_members(created_before=this_month_start)

    budget = [
        BudgetCategoryOut(
            category=category,
            budgeted=budgeted,
            spent=await repository.sum_expenses(start=this_month_start, category=category.value),
        )
        for category, budgeted in EXPENSE_BUDGETS.items()
    ]

    today = now.date()
    yesterday = today - timedelta(days=1)
    today_midnight = datetime(today.year, today.month, today.day, tzinfo=UTC)
    yesterday_midnight = datetime(yesterday.year, yesterday.month, yesterday.day, tzinfo=UTC)

    booked_this_hour = await repository.count_seat_bookings(date=today_midnight, hour=now.hour)
    seat_status = SeatStatusOut(
        available=TOTAL_SEATS - booked_this_hour, booked=booked_this_hour, total=TOTAL_SEATS
    )

    seat_occupancy = [
        SeatOccupancySlotOut(
            hour=hour,
            percent_filled=round(
                await repository.count_seat_bookings(date=yesterday_midnight, hour=hour)
                / TOTAL_SEATS
                * 100
            ),
        )
        for hour in OPEN_HOURS
    ]

    return AdminDashboardOut(
        stats=AdminStatsOut(
            revenue_mtd=revenue_mtd,
            revenue_trend=_trend(revenue_mtd, revenue_last_month),
            expenses_mtd=expenses_mtd,
            expenses_trend=_trend(expenses_mtd, expenses_last_month),
            net_profit_mtd=net_profit_mtd,
            net_profit_trend=_trend(net_profit_mtd, net_profit_last_month),
            total_members=total_members,
            total_members_trend=_trend(total_members, total_members_last_month),
        ),
        cash_flow=[
            RevenueSourceOut(source="membershipFees", amount=membership_fees),
            RevenueSourceOut(source="eventTickets", amount=0),
            RevenueSourceOut(source="finesCollected", amount=fines_collected),
            RevenueSourceOut(source="donationsValue", amount=0),
        ],
        budget=budget,
        seat_status=seat_status,
        seat_occupancy=seat_occupancy,
    )


async def log_expense(user_id: str, payload: ExpenseCreate) -> ExpenseOut:
    expense = await repository.create_expense(
        category=payload.category.value, amount=payload.amount, logged_by_id=user_id
    )
    return ExpenseOut.from_prisma(expense)

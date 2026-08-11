from collections import defaultdict
from dataclasses import dataclass

from app.modules.leaderboard import repository
from app.modules.leaderboard.schemas import LeaderboardEntryOut
from app.modules.members.service import _compute_streaks

LEADERBOARD_LIMIT = 50


@dataclass
class MemberStats:
    member_id: str
    full_name: str
    avatar_url: str | None
    score: int
    books_completed: int
    reviews_count: int
    events_attended: int
    on_time_returns: int
    reading_streak: int
    is_current_user: bool


async def get_leaderboard(current_user_id: str) -> list[LeaderboardEntryOut]:
    members = await repository.list_member_users()
    if not members:
        return []

    completed_progress = await repository.list_completed_progress()
    reviews = await repository.list_reviews()
    events = await repository.list_event_registrations()
    returned_loans = await repository.list_returned_loans()
    login_activities = await repository.list_login_activities()

    # Aggregate counts per member
    completed_counts: dict[str, int] = defaultdict(int)
    for p in completed_progress:
        completed_counts[p.memberId] += 1

    review_counts: dict[str, int] = defaultdict(int)
    for r in reviews:
        review_counts[r.memberId] += 1

    event_counts: dict[str, int] = defaultdict(int)
    for e in events:
        event_counts[e.memberId] += 1

    on_time_returns: dict[str, int] = defaultdict(int)
    late_returns: dict[str, int] = defaultdict(int)
    for loan in returned_loans:
        if loan.returnedAt and loan.dueDate and loan.returnedAt <= loan.dueDate:
            on_time_returns[loan.memberId] += 1
        else:
            late_returns[loan.memberId] += 1

    login_dates_per_member: dict[str, set] = defaultdict(set)
    for activity in login_activities:
        if activity.date:
            login_dates_per_member[activity.memberId].add(activity.date.date())

    # Build intermediate records
    member_stats: list[MemberStats] = []
    for m in members:
        m_id = m.id
        books_completed = completed_counts[m_id]
        reviews_cnt = review_counts[m_id]
        events_cnt = event_counts[m_id]
        on_time_cnt = on_time_returns[m_id]
        late_cnt = late_returns[m_id]
        current_streak, _ = _compute_streaks(login_dates_per_member[m_id])

        # Scoring:
        # Complete a book: 100
        # Write a review: 25
        # Event: 30
        # On-time return: 15
        # Late return: -10
        # 7-day streak: 50
        score = (
            (books_completed * 100)
            + (reviews_cnt * 25)
            + (events_cnt * 30)
            + (on_time_cnt * 15)
            - (late_cnt * 10)
            + (50 if current_streak >= 7 else 0)
        )

        member_stats.append(
            MemberStats(
                member_id=m_id,
                full_name=m.fullName,
                avatar_url=m.avatarUrl,
                score=score,
                books_completed=books_completed,
                reviews_count=reviews_cnt,
                events_attended=events_cnt,
                on_time_returns=on_time_cnt,
                reading_streak=current_streak,
                is_current_user=m_id == current_user_id,
            )
        )

    # Tie-breaking hierarchy:
    # 1. Total Score (DESC)
    # 2. Books Completed (DESC)
    # 3. Reviews Count (DESC)
    # 4. Reading Streak (DESC)
    # 5. Full Name Alphabetical A-Z (ASC)
    member_stats.sort(
        key=lambda x: (
            -x.score,
            -x.books_completed,
            -x.reviews_count,
            -x.reading_streak,
            x.full_name.lower(),
        )
    )

    results = []
    for rank, stats in enumerate(member_stats, start=1):
        badges = []
        if stats.books_completed >= 10:
            badges.append("bookworm")
        if stats.reading_streak >= 7:
            badges.append("7_day_streak")
        if stats.reviews_count >= 10:
            badges.append("top_reviewer")
        if stats.on_time_returns >= 10:
            badges.append("perfect_returner")
        if rank == 1:
            badges.append("reading_champion")
        if stats.events_attended >= 5:
            badges.append("community_star")

        results.append(
            LeaderboardEntryOut(
                rank=rank,
                member_id=stats.member_id,
                full_name=stats.full_name,
                avatar_url=stats.avatar_url,
                score=stats.score,
                books_completed=stats.books_completed,
                reviews_count=stats.reviews_count,
                reading_streak=stats.reading_streak,
                badges=badges,
                is_current_user=stats.is_current_user,
            )
        )

    return results

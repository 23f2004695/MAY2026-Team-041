import { PageHeader, StatisticCard } from '@/components/common';
import { BooksDueSoon } from '../components/BooksDueSoon';
import { CurrentlyBorrowed } from '../components/CurrentlyBorrowed';
import { MonthlyChallengeCard, ReadingProgressCard } from '../components/ProgressCards';
import { QuickActions } from '../components/QuickActions';
import { RecentNotifications, UpcomingEvents } from '../components/RecentActivity';
import {
  booksDueSoon,
  currentlyBorrowedBooks,
  dashboardStats,
  dashboardUser,
  monthlyChallenge,
  readingProgressSummary,
  recentNotifications,
  upcomingEvents,
} from '@/mocks/dashboard';

export function MemberDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${dashboardUser.name.split(' ')[0]}`}
        description={`${dashboardUser.membershipPlan} · Here's what's happening with your library`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatisticCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BooksDueSoon books={booksDueSoon} />
        <CurrentlyBorrowed books={currentlyBorrowedBooks} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentNotifications notifications={recentNotifications} />
        <UpcomingEvents events={upcomingEvents} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReadingProgressCard
          currentBook={readingProgressSummary.currentBook}
          percentComplete={readingProgressSummary.percentComplete}
          pagesRead={readingProgressSummary.pagesRead}
          totalPages={readingProgressSummary.totalPages}
        />
        <MonthlyChallengeCard
          title={monthlyChallenge.title}
          current={monthlyChallenge.current}
          target={monthlyChallenge.target}
        />
      </div>

      <QuickActions />
    </div>
  );
}

import { useTranslation } from 'react-i18next';

import { StatisticCard } from '@/components/common';
import { BooksDueSoon } from '../components/BooksDueSoon';
import { CurrentlyBorrowed } from '../components/CurrentlyBorrowed';
import { MonthlyChallengeCard, ReadingProgressCard } from '../components/ProgressCards';
import { QuickActions } from '../components/QuickActions';
import { RecentNotifications, UpcomingEvents } from '../components/RecentActivity';
import { WelcomeSection } from '../components/WelcomeSection';
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

export function DashboardPage() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col gap-6">
      <WelcomeSection name={dashboardUser.name} membershipPlan={dashboardUser.membershipPlan} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatisticCard
            key={stat.id}
            icon={stat.icon}
            label={t(`stats.${stat.id}.label`)}
            value={stat.value}
          />
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

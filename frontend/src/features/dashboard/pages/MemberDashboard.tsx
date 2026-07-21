import { BookOpen, CalendarCheck, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { BooksDueSoon } from '../components/BooksDueSoon';
import { CurrentlyBorrowed } from '../components/CurrentlyBorrowed';
import { MemberSubscription } from '../components/MemberSubscription';
import { MonthlyChallengeCard, ReadingProgressCard } from '../components/ProgressCards';
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('dashboard.welcomeBack', { name: dashboardUser.name.split(' ')[0] })}
        description={t('dashboard.subtitle', {
          plan: t(`dashboard.membershipPlans.${dashboardUser.membershipPlanKey}`),
        })}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value={stat.value} />
        ))}
      </div>

      <MemberSubscription
        planLabel={t(`dashboard.membershipPlans.${dashboardUser.membershipPlanKey}`)}
        expiresOn={dashboardUser.subscriptionExpiresOn}
        outstandingFine={dashboardUser.outstandingFine}
        fineReasonKey={dashboardUser.fineReasonKey}
        fineBookTitle={dashboardUser.fineBookTitle}
        fineDueDate={dashboardUser.fineDueDate}
        fineDailyPenalty={dashboardUser.fineDailyPenalty}
        fineEscalatedAmount={dashboardUser.fineEscalatedAmount}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BooksDueSoon books={booksDueSoon} />
        <CurrentlyBorrowed books={currentlyBorrowedBooks} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentNotifications notifications={recentNotifications} />
        <UpcomingEvents events={upcomingEvents} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

      <QuickActionsCard
        title={t('dashboard.quickActions.title')}
        actions={[
          {
            label: t('dashboard.quickActions.browseBooks'),
            icon: BookOpen,
            onClick: () => navigate(ROUTES.BOOKS),
          },
          {
            label: t('dashboard.quickActions.bookASeat'),
            icon: CalendarCheck,
            onClick: () => navigate(ROUTES.SEAT_BOOKING),
          },
          {
            label: t('dashboard.quickActions.viewReservations'),
            icon: Ticket,
            onClick: () => navigate(ROUTES.RESERVATIONS),
          },
        ]}
      />
    </div>
  );
}

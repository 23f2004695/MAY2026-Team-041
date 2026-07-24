import { BookOpen, CalendarCheck, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { dashboardStats } from '@/mocks/dashboard';
import { useAuth, type Membership } from '@/providers/AuthProvider';
import { BooksDueSoon } from '../components/BooksDueSoon';
import { CurrentlyBorrowed } from '../components/CurrentlyBorrowed';
import { MemberSubscription } from '../components/MemberSubscription';
import { RecentNotifications, UpcomingEvents } from '../components/RecentActivity';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ponytail: only name and membership (derived from real Payment records) come from the
// backend — borrowing, reservations, seat bookings, reading points/progress, and
// notifications have no backend yet (see FRONTEND_VS_SPEC.md), so those show honest
// empty/zero states instead of the old fabricated mock numbers.
export function MemberDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fullName, getMembership } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    getMembership().then(setMembership).catch(() => setMembership(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('dashboard.welcomeBack', { name: (fullName ?? '').split(' ')[0] || 'there' })}
        description={membership ? membership.plan_label : t('dashboard.subscription.noPlan')}
      />

      <h2 className="sr-only">{t('common.dashboardSectionsHeading')}</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value="0" />
        ))}
      </div>

      <MemberSubscription
        planLabel={membership ? membership.plan_label : 'No active plan'}
        expiresOn={membership ? formatDate(membership.expires_at) : undefined}
        outstandingFine="₹0"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BooksDueSoon books={[]} />
        <CurrentlyBorrowed books={[]} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentNotifications notifications={[]} />
        <UpcomingEvents events={[]} />
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

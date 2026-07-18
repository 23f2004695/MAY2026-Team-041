import { Armchair, BookPlus, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { managerStats, pendingPayments, registrationRequests, walkInRequests } from '@/mocks/manager';

import { NewRegistrations } from '../components/NewRegistrations';
import { PendingPayments } from '../components/PendingPayments';
import { WalkInAssistance } from '../components/WalkInAssistance';

// Manager duties: assist walk-in members with seat/book counter service
// (taking their email and booking/issuing on their behalf) and help new
// visitors register — no event management.
export function ManagerDashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('managerDashboard.pageTitle')}
        description={t('managerDashboard.pageDescription')}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {managerStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value={stat.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WalkInAssistance requests={walkInRequests} />
        <NewRegistrations requests={registrationRequests} />
      </div>

      <PendingPayments payments={pendingPayments} />

      <QuickActionsCard
        actions={[
          {
            label: t('managerDashboard.quickActions.bookSeatForMember'),
            icon: Armchair,
            onClick: () => comingSoonToast(t('managerDashboard.quickActions.toasts.bookingSeat')),
          },
          {
            label: t('managerDashboard.quickActions.issueBookForMember'),
            icon: BookPlus,
            onClick: () => comingSoonToast(t('managerDashboard.quickActions.toasts.issuingBook')),
          },
          {
            label: t('managerDashboard.quickActions.registerNewMember'),
            icon: UserPlus,
            onClick: () => comingSoonToast(t('managerDashboard.quickActions.toasts.registeringMember')),
          },
        ]}
      />
    </div>
  );
}

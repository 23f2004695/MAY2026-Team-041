import { BookPlus, QrCode, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { librarianStats, overdueLoans, pendingReservationQueue } from '@/mocks/librarian';

import { OverdueBooks } from '../components/OverdueBooks';
import { PendingReservationQueue } from '../components/PendingReservationQueue';

export function LibrarianDashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('librarianDashboard.pageTitle')}
        description={t('librarianDashboard.pageDescription')}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {librarianStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OverdueBooks loans={overdueLoans} />
        <PendingReservationQueue reservations={pendingReservationQueue} />
      </div>

      <QuickActionsCard
        actions={[
          {
            label: t('librarianDashboard.quickActions.issueBook'),
            icon: BookPlus,
            onClick: () => comingSoonToast(t('librarianDashboard.quickActions.toasts.issuingBook')),
          },
          {
            label: t('librarianDashboard.quickActions.returnBook'),
            icon: RotateCcw,
            onClick: () => comingSoonToast(t('librarianDashboard.quickActions.toasts.returningBook')),
          },
          {
            label: t('librarianDashboard.quickActions.scanQr'),
            icon: QrCode,
            onClick: () => comingSoonToast(t('librarianDashboard.quickActions.toasts.scanningQr')),
          },
        ]}
      />
    </div>
  );
}

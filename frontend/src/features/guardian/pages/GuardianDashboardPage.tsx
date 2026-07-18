import { HandCoins, MessageSquare, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { childBorrowedBooks, children, guardianStats } from '@/mocks/guardian';

import { BorrowedBooksByChild } from '../components/BorrowedBooksByChild';
import { ChildrenPresence } from '../components/ChildrenPresence';
import { SeatReservationForChild } from '../components/SeatReservationForChild';
import { SubscriptionAndFines } from '../components/SubscriptionAndFines';

export function GuardianDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('guardian.pageTitle')} description={t('guardian.pageDescription')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {guardianStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChildrenPresence children={children} />
        <BorrowedBooksByChild books={childBorrowedBooks} children={children} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SubscriptionAndFines children={children} />
        <SeatReservationForChild children={children} />
      </div>

      <QuickActionsCard
        actions={[
          {
            label: t('guardian.quickActions.payAllFines'),
            icon: HandCoins,
            onClick: () => comingSoonToast(t('guardian.quickActions.toasts.payingAllFines')),
          },
          {
            label: t('guardian.quickActions.renewSubscription'),
            icon: RefreshCw,
            onClick: () => comingSoonToast(t('guardian.quickActions.toasts.renewingSubscription')),
          },
          {
            label: t('guardian.quickActions.contactLibrarian'),
            icon: MessageSquare,
            onClick: () => comingSoonToast(t('guardian.quickActions.toasts.contactingLibrarian')),
          },
        ]}
      />
    </div>
  );
}

import { KeyRound, ShieldOff, TicketCheck, UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import {
  accessEntries,
  bookRecords,
  feeStatusEntries,
  issueTickets,
  itHeadStats,
  lateReturnEntries,
} from '@/mocks/itHead';

import { AccessControl } from '../components/AccessControl';
import { BookRecords } from '../components/BookRecords';
import { FeeStatus } from '../components/FeeStatus';
import { IssueResolution } from '../components/IssueResolution';
import { LateReturnFines } from '../components/LateReturnFines';

export function ITHeadDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('itHead.pageTitle')} description={t('itHead.pageDescription')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {itHeadStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value={stat.value} />
        ))}
      </div>

      <AccessControl entries={accessEntries} />

      <div className="grid gap-4 lg:grid-cols-2">
        <IssueResolution tickets={issueTickets} />
        <BookRecords records={bookRecords} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FeeStatus entries={feeStatusEntries} />
        <LateReturnFines entries={lateReturnEntries} />
      </div>

      <QuickActionsCard
        actions={[
          {
            label: t('itHead.quickActions.grantAccess'),
            icon: KeyRound,
            onClick: () => comingSoonToast(t('itHead.quickActions.toasts.grantingAccess')),
          },
          {
            label: t('itHead.quickActions.deactivateUser'),
            icon: ShieldOff,
            onClick: () => comingSoonToast(t('itHead.quickActions.toasts.deactivatingUser')),
          },
          {
            label: t('itHead.quickActions.resolveIssue'),
            icon: TicketCheck,
            onClick: () => comingSoonToast(t('itHead.quickActions.toasts.resolvingIssue')),
          },
          {
            label: t('itHead.quickActions.logBookChange'),
            icon: UploadCloud,
            onClick: () => comingSoonToast(t('itHead.quickActions.toasts.loggingBookChange')),
          },
        ]}
      />
    </div>
  );
}

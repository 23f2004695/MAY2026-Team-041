import { CalendarPlus, ClipboardList, Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { events } from '@/mocks/events';
import { managerStats, readingSessions } from '@/mocks/manager';

import { ManagerEvents } from '../components/ManagerEvents';
import { ReadingSessionsCard } from '../components/ReadingSessionsCard';

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

      <div className="grid gap-4 lg:grid-cols-2">
        <ManagerEvents events={events} />
        <ReadingSessionsCard sessions={readingSessions} />
      </div>

      <QuickActionsCard
        actions={[
          {
            label: t('managerDashboard.quickActions.createEvent'),
            icon: CalendarPlus,
            onClick: () => comingSoonToast(t('managerDashboard.quickActions.toasts.creatingEvent')),
          },
          {
            label: t('managerDashboard.quickActions.recordAttendance'),
            icon: ClipboardList,
            onClick: () =>
              comingSoonToast(t('managerDashboard.quickActions.toasts.recordingAttendance')),
          },
          {
            label: t('managerDashboard.quickActions.postUpdate'),
            icon: Megaphone,
            onClick: () => comingSoonToast(t('managerDashboard.quickActions.toasts.postingUpdate')),
          },
        ]}
      />
    </div>
  );
}

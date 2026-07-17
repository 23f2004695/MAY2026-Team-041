import { CalendarPlus, ClipboardList, Megaphone } from 'lucide-react';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { events } from '@/mocks/events';
import { managerStats, readingSessions } from '@/mocks/manager';

import { ManagerEvents } from '../components/ManagerEvents';
import { ReadingSessionsCard } from '../components/ReadingSessionsCard';

export function ManagerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manager Dashboard"
        description="Events, sessions, and attendance overview"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {managerStats.map((stat) => (
          <StatisticCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ManagerEvents events={events} />
        <ReadingSessionsCard sessions={readingSessions} />
      </div>

      <QuickActionsCard
        actions={[
          {
            label: 'Create Event',
            icon: CalendarPlus,
            onClick: () => comingSoonToast('Creating an event'),
          },
          {
            label: 'Record Attendance',
            icon: ClipboardList,
            onClick: () => comingSoonToast('Recording attendance'),
          },
          {
            label: 'Post Update',
            icon: Megaphone,
            onClick: () => comingSoonToast('Posting a community update'),
          },
        ]}
      />
    </div>
  );
}

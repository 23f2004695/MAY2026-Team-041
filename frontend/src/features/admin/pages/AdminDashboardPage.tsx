import { BookPlus, CalendarPlus, Megaphone, Settings2, UserPlus } from 'lucide-react';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { adminReports, adminStats, auditLog, pendingRequests, roleDistribution } from '@/mocks/admin';

import { AuditLog } from '../components/AuditLog';
import { PendingRequests } from '../components/PendingRequests';
import { RolesPermissions } from '../components/RolesPermissions';

export function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Admin Dashboard" description="Platform overview and administration" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <StatisticCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <PendingRequests requests={pendingRequests} />

      <div className="grid gap-4 lg:grid-cols-2">
        <RolesPermissions roles={roleDistribution} />
        <AuditLog entries={auditLog} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {adminReports.map((report) => (
              <div key={report.label} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{report.label}</span>
                <Button size="sm" variant="ghost" onClick={() => comingSoonToast(report.label)}>
                  {report.value}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <QuickActionsCard
          actions={[
            { label: 'Add Book', icon: BookPlus, onClick: () => comingSoonToast('Adding a book') },
            {
              label: 'Invite Member',
              icon: UserPlus,
              onClick: () => comingSoonToast('Inviting a member'),
            },
            {
              label: 'Create Event',
              icon: CalendarPlus,
              onClick: () => comingSoonToast('Creating an event'),
            },
            {
              label: 'Announcement',
              icon: Megaphone,
              onClick: () => comingSoonToast('Sending an announcement'),
            },
            {
              label: 'Platform Settings',
              icon: Settings2,
              onClick: () => comingSoonToast('Opening platform settings'),
            },
          ]}
        />
      </div>
    </div>
  );
}

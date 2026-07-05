import { BookPlus, CalendarPlus, Megaphone, UserPlus } from 'lucide-react';

import { StatisticCard } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { adminReports, adminStats, pendingRequests } from '@/mocks/admin';

import { PendingRequests } from '../components/PendingRequests';

export function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform overview and administration</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <StatisticCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <PendingRequests requests={pendingRequests} />

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

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              leadingIcon={<BookPlus className="size-4" />}
              onClick={() => comingSoonToast('Adding a book')}
            >
              Add Book
            </Button>
            <Button
              variant="outline"
              leadingIcon={<UserPlus className="size-4" />}
              onClick={() => comingSoonToast('Inviting a member')}
            >
              Invite Member
            </Button>
            <Button
              variant="outline"
              leadingIcon={<CalendarPlus className="size-4" />}
              onClick={() => comingSoonToast('Creating an event')}
            >
              Create Event
            </Button>
            <Button
              variant="outline"
              leadingIcon={<Megaphone className="size-4" />}
              onClick={() => comingSoonToast('Sending an announcement')}
            >
              Announcement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

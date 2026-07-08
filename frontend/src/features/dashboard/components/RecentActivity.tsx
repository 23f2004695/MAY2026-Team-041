import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { DashboardEvent, DashboardNotification } from '@/mocks/dashboard';

export function RecentNotifications({ notifications }: { notifications: DashboardNotification[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <li key={notification.id} className="text-sm">
              <p className="text-foreground">{notification.title}</p>
              <p className="text-muted-foreground">{notification.timestamp}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function UpcomingEvents({ events }: { events: DashboardEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{event.title}</span>
              <span className="text-muted-foreground">{event.date}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

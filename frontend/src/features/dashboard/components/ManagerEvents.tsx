import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { Event } from '@/mocks/events';

export interface ManagerEventsProps {
  events: Event[];
}

export function ManagerEvents({ events }: ManagerEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <EmptyState title="No events scheduled" description="Create one to get started." />
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.date} · {event.attendees}/{event.capacity} attending ·{' '}
                    {event.managers.length} manager{event.managers.length === 1 ? '' : 's'}{' '}
                    assigned
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => comingSoonToast(`Managing "${event.title}"`)}
                >
                  Manage
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

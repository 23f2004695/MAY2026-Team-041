import { Calendar, MapPin, Users } from 'lucide-react';

import { Badge, Button, Drawer } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { Event } from '@/mocks/events';

export interface EventDetailsDrawerProps {
  event: Event | null;
  onClose: () => void;
  onToggleRegistration: (event: Event) => void;
}

export function EventDetailsDrawer({
  event,
  onClose,
  onToggleRegistration,
}: EventDetailsDrawerProps) {
  return (
    <Drawer open={event != null} onClose={onClose} title={event?.title ?? 'Event details'}>
      {event && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">{event.description}</p>

          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="size-4" /> {event.date}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" /> {event.location}
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              {event.attendees}/{event.capacity} attending
            </span>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold text-foreground">Registration</p>
            <div className="mt-2 flex items-center justify-between">
              {event.registered ? (
                <Badge variant="success">You’re registered</Badge>
              ) : (
                <Badge variant="outline">Not registered</Badge>
              )}
              <Button
                size="sm"
                variant={event.registered ? 'outline' : 'primary'}
                onClick={() => {
                  onToggleRegistration(event);
                  comingSoonToast(event.registered ? 'Cancelling registration' : 'Registering');
                }}
              >
                {event.registered ? 'Cancel registration' : 'Register'}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold text-foreground">Volunteer Assignments</p>
            {event.volunteers.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No volunteers assigned yet.</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1.5">
                {event.volunteers.map((volunteer) => (
                  <li key={volunteer.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{volunteer.name}</span>
                    <span className="text-muted-foreground">{volunteer.role}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}

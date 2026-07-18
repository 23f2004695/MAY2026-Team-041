import { Calendar, MapPin, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Drawer open={event != null} onClose={onClose} title={event?.title ?? t('events.details.defaultTitle')}>
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
              {t('events.details.attending', { attendees: event.attendees, capacity: event.capacity })}
            </span>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold text-foreground">{t('events.details.registrationTitle')}</p>
            <div className="mt-2 flex items-center justify-between">
              {event.registered ? (
                <Badge variant="success">{t('events.details.registered')}</Badge>
              ) : (
                <Badge variant="outline">{t('events.details.notRegistered')}</Badge>
              )}
              <Button
                size="sm"
                variant={event.registered ? 'outline' : 'primary'}
                onClick={() => {
                  onToggleRegistration(event);
                  comingSoonToast(
                    event.registered
                      ? t('events.details.toasts.cancellingRegistration')
                      : t('events.details.toasts.registering'),
                  );
                }}
              >
                {event.registered ? t('events.details.cancelRegistration') : t('events.details.register')}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold text-foreground">
              {t('events.details.managerAssignmentsTitle')}
            </p>
            {event.managers.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {t('events.details.noManagersAssigned')}
              </p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1.5">
                {event.managers.map((manager) => (
                  <li key={manager.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{manager.name}</span>
                    <span className="text-muted-foreground">{manager.role}</span>
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

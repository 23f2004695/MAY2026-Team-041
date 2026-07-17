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
  const { t } = useTranslation('events');

  return (
    <Drawer
      open={event != null}
      onClose={onClose}
      title={event ? t(`list.${event.id}.title`) : t('drawer.title')}
    >
      {event && (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">{t(`list.${event.id}.description`)}</p>

          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="size-4" /> {event.date}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" /> {t(`list.${event.id}.location`)}
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              {t('card.attending', { attendees: event.attendees, capacity: event.capacity })}
            </span>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold text-foreground">{t('drawer.registration')}</p>
            <div className="mt-2 flex items-center justify-between">
              {event.registered ? (
                <Badge variant="success">{t('drawer.registered')}</Badge>
              ) : (
                <Badge variant="outline">{t('drawer.notRegistered')}</Badge>
              )}
              <Button
                size="sm"
                variant={event.registered ? 'outline' : 'primary'}
                onClick={() => {
                  onToggleRegistration(event);
                  comingSoonToast(
                    event.registered
                      ? t('drawer.toast.cancelling')
                      : t('drawer.toast.registering'),
                  );
                }}
              >
                {event.registered ? t('drawer.cancelRegistration') : t('drawer.register')}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-3">
            <p className="text-sm font-semibold text-foreground">
              {t('drawer.volunteerAssignments')}
            </p>
            {event.volunteers.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{t('drawer.noVolunteers')}</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-1.5">
                {event.volunteers.map((volunteer) => (
                  <li key={volunteer.name} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{volunteer.name}</span>
                    <span className="text-muted-foreground">
                      {t(`list.${event.id}.volunteers.${volunteer.id}`)}
                    </span>
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

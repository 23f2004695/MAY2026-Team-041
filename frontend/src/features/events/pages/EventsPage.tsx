import { useState } from 'react';
import { CalendarCheck, Percent, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { StatisticCard, EventCard, PageHeader } from '@/components/common';
import { attendanceSummary, events as mockEvents, type Event } from '@/mocks/events';

import { EventDetailsDrawer } from '../components/EventDetailsDrawer';

export function EventsPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState(mockEvents);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const activeEvent = events.find((event) => event.id === activeEventId) ?? null;

  function toggleRegistration(event: Event) {
    setEvents((prev) =>
      prev.map((entry) =>
        entry.id === event.id
          ? {
              ...entry,
              registered: !entry.registered,
              attendees: entry.attendees + (entry.registered ? -1 : 1),
            }
          : entry,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('events.pageTitle')}
        description={t('events.pageDescription')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticCard
          icon={CalendarCheck}
          label={t('events.stats.eventsThisMonth')}
          value={String(attendanceSummary.totalEventsThisMonth)}
        />
        <StatisticCard
          icon={Users}
          label={t('events.stats.totalAttendees')}
          value={String(attendanceSummary.totalAttendees)}
        />
        <StatisticCard
          icon={Percent}
          label={t('events.stats.avgAttendanceRate')}
          value={`${Math.round(attendanceSummary.averageAttendanceRate * 100)}%`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            attendees={event.attendees}
            capacity={event.capacity}
            registered={event.registered}
            onViewDetails={() => setActiveEventId(event.id)}
          />
        ))}
      </div>

      <EventDetailsDrawer
        event={activeEvent}
        onClose={() => setActiveEventId(null)}
        onToggleRegistration={toggleRegistration}
      />
    </div>
  );
}

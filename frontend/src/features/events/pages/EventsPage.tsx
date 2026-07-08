import { useState } from 'react';
import { CalendarCheck, Percent, Users } from 'lucide-react';

import { StatisticCard, EventCard } from '@/components/common';
import { attendanceSummary, events as mockEvents, type Event } from '@/mocks/events';

import { EventDetailsDrawer } from '../components/EventDetailsDrawer';

export function EventsPage() {
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
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Events</h1>
        <p className="mt-1 text-muted-foreground">Upcoming library events and community programs</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticCard
          icon={CalendarCheck}
          label="Events This Month"
          value={String(attendanceSummary.totalEventsThisMonth)}
        />
        <StatisticCard
          icon={Users}
          label="Total Attendees"
          value={String(attendanceSummary.totalAttendees)}
        />
        <StatisticCard
          icon={Percent}
          label="Avg. Attendance Rate"
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

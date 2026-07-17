export interface EventVolunteer {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  date: string;
  attendees: number;
  capacity: number;
  registered: boolean;
  volunteers: EventVolunteer[];
}

export const events: Event[] = [
  {
    id: 'scifi-book-club',
    date: 'Jul 10, 2026, 6:00 PM',
    attendees: 18,
    capacity: 30,
    registered: true,
    volunteers: [
      { id: 'amaraOkafor', name: 'Amara Okafor' },
      { id: 'liamFitzgerald', name: 'Liam Fitzgerald' },
    ],
  },
  {
    id: 'author-talk',
    date: 'Jul 18, 2026, 7:00 PM',
    attendees: 42,
    capacity: 80,
    registered: false,
    volunteers: [{ id: 'danielCho', name: 'Daniel Cho' }],
  },
  {
    id: 'kids-story-hour',
    date: 'Jul 22, 2026, 10:00 AM',
    attendees: 12,
    capacity: 20,
    registered: false,
    volunteers: [{ id: 'priyaSharma', name: 'Priya Sharma' }],
  },
  {
    id: 'volunteer-orientation',
    date: 'Jul 28, 2026, 5:00 PM',
    attendees: 6,
    capacity: 15,
    registered: false,
    volunteers: [],
  },
];

export const attendanceSummary = {
  totalEventsThisMonth: 4,
  totalAttendees: 78,
  // 78 attendees across 145 capacity (30 + 80 + 20 + 15) ≈ 54%.
  averageAttendanceRate: 0.54,
};

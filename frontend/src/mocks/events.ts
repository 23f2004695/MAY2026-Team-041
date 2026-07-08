export interface EventVolunteer {
  name: string;
  role: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  attendees: number;
  capacity: number;
  registered: boolean;
  volunteers: EventVolunteer[];
}

export const events: Event[] = [
  {
    id: 'scifi-book-club',
    title: 'Sci-Fi Book Club Meetup',
    date: 'Jul 10, 2026, 6:00 PM',
    location: 'Main Hall, Community Library',
    description: 'Monthly discussion on this month’s pick, "Project Hail Mary".',
    attendees: 18,
    capacity: 30,
    registered: true,
    volunteers: [
      { name: 'Amara Okafor', role: 'Discussion Lead' },
      { name: 'Liam Fitzgerald', role: 'Setup' },
    ],
  },
  {
    id: 'author-talk',
    title: 'Author Talk: Local Writers Night',
    date: 'Jul 18, 2026, 7:00 PM',
    location: 'Auditorium, Community Library',
    description: 'An evening with three local authors discussing their debut novels.',
    attendees: 42,
    capacity: 80,
    registered: false,
    volunteers: [{ name: 'Daniel Cho', role: 'Registration Desk' }],
  },
  {
    id: 'kids-story-hour',
    title: 'Kids Story Hour',
    date: 'Jul 22, 2026, 10:00 AM',
    location: 'Children’s Wing',
    description: 'Weekly story-telling session for children ages 4-8.',
    attendees: 12,
    capacity: 20,
    registered: false,
    volunteers: [{ name: 'Priya Sharma', role: 'Storyteller' }],
  },
  {
    id: 'volunteer-orientation',
    title: 'Volunteer Orientation',
    date: 'Jul 28, 2026, 5:00 PM',
    location: 'Meeting Room B',
    description: 'Orientation session for new volunteers joining the library programs.',
    attendees: 6,
    capacity: 15,
    registered: false,
    volunteers: [],
  },
];

export const attendanceSummary = {
  totalEventsThisMonth: 4,
  totalAttendees: 78,
  averageAttendanceRate: 0.72,
};

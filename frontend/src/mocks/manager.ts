import { BookMarked, Calendar, TrendingUp, Users, type LucideIcon } from 'lucide-react';

import { attendanceSummary, events } from './events';

export interface ManagerStat {
  icon: LucideIcon;
  label: string;
  value: string;
}

export const managerStats: ManagerStat[] = [
  { icon: Calendar, label: 'Upcoming Events', value: String(events.length) },
  { icon: Users, label: 'Attendees This Month', value: String(attendanceSummary.totalAttendees) },
  {
    icon: TrendingUp,
    label: 'Avg. Attendance Rate',
    value: `${Math.round(attendanceSummary.averageAttendanceRate * 100)}%`,
  },
  { icon: BookMarked, label: 'Active Reading Sessions', value: '3' },
];

export interface ReadingSession {
  id: string;
  title: string;
  date: string;
  facilitator: string;
  participants: number;
}

export const readingSessions: ReadingSession[] = [
  {
    id: 'rs1',
    title: 'Sci-Fi Book Club — Chapter Discussion',
    date: 'Jul 10, 2026, 6:00 PM',
    facilitator: 'Ananya Iyer',
    participants: 18,
  },
  {
    id: 'rs2',
    title: "Kids Story Hour Rehearsal",
    date: 'Jul 15, 2026, 4:00 PM',
    facilitator: 'Priya Sharma',
    participants: 4,
  },
  {
    id: 'rs3',
    title: 'New Manager Orientation Prep',
    date: 'Jul 26, 2026, 5:00 PM',
    facilitator: 'Rahul Nair',
    participants: 2,
  },
];

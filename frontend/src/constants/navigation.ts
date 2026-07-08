import {
  BookMarked,
  BookOpen,
  Calendar,
  CalendarCheck,
  Home,
  LayoutDashboard,
  type LucideIcon,
  MessageCircle,
  Settings,
  ShieldCheck,
  Star,
  Ticket,
  Trophy,
} from 'lucide-react';

import { Icons } from './icons';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const userNavigation: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Books', path: ROUTES.BOOKS, icon: BookOpen },
  { label: 'Reservations', path: ROUTES.RESERVATIONS, icon: Ticket },
  { label: 'Seat Booking', path: ROUTES.SEAT_BOOKING, icon: CalendarCheck },
  { label: 'Community', path: ROUTES.COMMUNITY, icon: MessageCircle },
  { label: 'Events', path: ROUTES.EVENTS, icon: Calendar },
  { label: 'Reading Progress', path: ROUTES.READING_PROGRESS, icon: BookMarked },
  { label: 'Leaderboard', path: ROUTES.LEADERBOARD, icon: Trophy },
  { label: 'Reviews', path: ROUTES.REVIEWS, icon: Star },
  { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Icons.bell },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const adminNavigation: NavItem[] = [
  { label: 'Admin Overview', path: ROUTES.ADMIN, icon: ShieldCheck },
  { label: 'Back to App', path: ROUTES.DASHBOARD, icon: Home },
];

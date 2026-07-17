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
  labelKey: string;
  path: string;
  icon: LucideIcon;
}

export const userNavigation: NavItem[] = [
  { labelKey: 'nav.dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { labelKey: 'nav.books', path: ROUTES.BOOKS, icon: BookOpen },
  { labelKey: 'nav.reservations', path: ROUTES.RESERVATIONS, icon: Ticket },
  { labelKey: 'nav.seatBooking', path: ROUTES.SEAT_BOOKING, icon: CalendarCheck },
  { labelKey: 'nav.community', path: ROUTES.COMMUNITY, icon: MessageCircle },
  { labelKey: 'nav.events', path: ROUTES.EVENTS, icon: Calendar },
  { labelKey: 'nav.readingProgress', path: ROUTES.READING_PROGRESS, icon: BookMarked },
  { labelKey: 'nav.leaderboard', path: ROUTES.LEADERBOARD, icon: Trophy },
  { labelKey: 'nav.reviews', path: ROUTES.REVIEWS, icon: Star },
  { labelKey: 'nav.notifications', path: ROUTES.NOTIFICATIONS, icon: Icons.bell },
  { labelKey: 'nav.settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const adminNavigation: NavItem[] = [
  { labelKey: 'nav.adminOverview', path: ROUTES.ADMIN, icon: ShieldCheck },
  { labelKey: 'nav.backToApp', path: ROUTES.DASHBOARD, icon: Home },
];

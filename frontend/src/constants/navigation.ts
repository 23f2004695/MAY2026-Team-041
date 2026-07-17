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

// `label` holds an i18n key (translated at render time in Sidebar), not display text.
export const userNavigation: NavItem[] = [
  { label: 'nav.dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'nav.books', path: ROUTES.BOOKS, icon: BookOpen },
  { label: 'nav.reservations', path: ROUTES.RESERVATIONS, icon: Ticket },
  { label: 'nav.seatBooking', path: ROUTES.SEAT_BOOKING, icon: CalendarCheck },
  { label: 'nav.community', path: ROUTES.COMMUNITY, icon: MessageCircle },
  { label: 'nav.events', path: ROUTES.EVENTS, icon: Calendar },
  { label: 'nav.readingProgress', path: ROUTES.READING_PROGRESS, icon: BookMarked },
  { label: 'nav.leaderboard', path: ROUTES.LEADERBOARD, icon: Trophy },
  { label: 'nav.reviews', path: ROUTES.REVIEWS, icon: Star },
  { label: 'nav.notifications', path: ROUTES.NOTIFICATIONS, icon: Icons.bell },
  { label: 'nav.settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const adminOverviewNavItem: NavItem = {
  label: 'nav.adminOverview',
  path: ROUTES.ADMIN,
  icon: ShieldCheck,
};

export const adminNavigation: NavItem[] = [
  adminOverviewNavItem,
  { label: 'nav.backToApp', path: ROUTES.DASHBOARD, icon: Home },
];

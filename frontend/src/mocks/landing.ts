import {
  BarChart3,
  BookMarked,
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarDays,
  Gift,
  type LucideIcon,
  MessagesSquare,
  QrCode,
  Trophy,
  Users,
} from 'lucide-react';

import type { SeatStatus } from '@/components/common';

// Display copy for everything below lives in i18n locale files (src/i18n/locales/*.json),
// keyed by `id`. These mocks hold only structural/icon data plus real-world proper nouns
// (book titles, person names) that a real backend wouldn't translate either.

export interface Statistic {
  id: string;
  icon: LucideIcon;
  value: string;
}

export const statistics: Statistic[] = [
  { id: 'booksAvailable', icon: BookOpen, value: '4,600+' },
  { id: 'members', icon: Users, value: '140+' },
  { id: 'readingClubs', icon: MessagesSquare, value: '6' },
  { id: 'eventsHosted', icon: CalendarDays, value: '52' },
  { id: 'booksBorrowed', icon: BookMarked, value: '6,800+' },
  { id: 'studySeats', icon: CalendarCheck, value: '24' },
];

export interface Feature {
  id: string;
  icon: LucideIcon;
}

export const features: Feature[] = [
  { id: 'digitalLibrary', icon: BookOpen },
  { id: 'qrBorrowing', icon: QrCode },
  { id: 'seatBooking', icon: CalendarCheck },
  { id: 'aiLibrarian', icon: Bot },
  { id: 'readingChallenges', icon: Trophy },
  { id: 'communityDiscussions', icon: MessagesSquare },
  { id: 'bookDonations', icon: Gift },
  { id: 'analyticsDashboard', icon: BarChart3 },
];

export interface HowItWorksStep {
  step: number;
}

export const howItWorksSteps: HowItWorksStep[] = [
  { step: 1 },
  { step: 2 },
  { step: 3 },
  { step: 4 },
];

export interface AIRecommendedBook {
  id: string;
  title: string;
  available: boolean;
}

export const aiRecommendedBooks: AIRecommendedBook[] = [
  { id: 'atomicHabits', title: 'Atomic Habits', available: true },
  { id: 'psychologyOfMoney', title: 'The Psychology of Money', available: false },
  { id: 'ikigai', title: 'Ikigai', available: true },
];

export interface MoodRecommendation {
  id: string;
  emoji: string;
  books: string[];
}

export const moodRecommendations: MoodRecommendation[] = [
  {
    id: 'happy',
    emoji: '\u{1F60A}',
    books: ['The House in the Cerulean Sea', 'Anne of Green Gables'],
  },
  { id: 'relaxed', emoji: '\u{1F60C}', books: ['Norwegian Wood', 'The Overstory'] },
  {
    id: 'curious',
    emoji: '\u{1F92F}',
    books: ['Sapiens', 'A Short History of Nearly Everything'],
  },
  { id: 'motivated', emoji: '\u{1F60E}', books: ['Atomic Habits', 'Can’t Hurt Me'] },
  { id: 'studyMode', emoji: '\u{1F4DA}', books: ['Deep Work', 'How to Read a Book'] },
];

export const seatStats: Record<SeatStatus, number> = {
  available: 18,
  reserved: 6,
  occupied: 12,
};

export interface Achievement {
  id: string;
}

export const achievements: Achievement[] = [
  { id: 'firstBook' },
  { id: 'bookWorm' },
  { id: 'topReader' },
  { id: 'monthlyChampion' },
];

export interface CommunityHighlight {
  id: string;
  icon: LucideIcon;
}

export const communityHighlights: CommunityHighlight[] = [
  { id: 'bookDiscussions', icon: MessagesSquare },
  { id: 'reviews', icon: Trophy },
  { id: 'readingClubs', icon: Users },
  { id: 'volunteerPrograms', icon: Gift },
];

export interface Testimonial {
  id: string;
  name: string;
}

export const testimonials: Testimonial[] = [
  { id: 'priyaSharma', name: 'Priya Sharma' },
  { id: 'rahulNair', name: 'Rahul Nair' },
  { id: 'ananyaIyer', name: 'Ananya Iyer' },
  { id: 'karanMalhotra', name: 'Karan Malhotra' },
];

export interface FaqItem {
  id: string;
}

export const faqs: FaqItem[] = [
  { id: 'reservations' },
  { id: 'seatBookings' },
  { id: 'donations' },
  { id: 'aiLibrarian' },
];

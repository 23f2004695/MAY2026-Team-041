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

export interface Statistic {
  icon: LucideIcon;
  id: string;
  value: string;
}

export const statistics: Statistic[] = [
  { icon: BookOpen, id: 'booksAvailable', value: '12,400+' },
  { icon: Users, id: 'members', value: '3,200+' },
  { icon: MessagesSquare, id: 'readingClubs', value: '85' },
  { icon: CalendarDays, id: 'eventsHosted', value: '210' },
  { icon: BookMarked, id: 'booksBorrowed', value: '48,000+' },
  { icon: CalendarCheck, id: 'studySeats', value: '60' },
];

export interface Feature {
  icon: LucideIcon;
  id: string;
}

export const features: Feature[] = [
  { icon: BookOpen, id: 'digitalLibrary' },
  { icon: QrCode, id: 'qrBorrowing' },
  { icon: CalendarCheck, id: 'seatBooking' },
  { icon: Bot, id: 'aiLibrarian' },
  { icon: Trophy, id: 'readingChallenges' },
  { icon: MessagesSquare, id: 'communityDiscussions' },
  { icon: Gift, id: 'bookDonations' },
  { icon: BarChart3, id: 'analyticsDashboard' },
];

export interface HowItWorksStep {
  step: number;
  id: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  { step: 1, id: 'register' },
  { step: 2, id: 'searchBooks' },
  { step: 3, id: 'borrowReserve' },
  { step: 4, id: 'readParticipate' },
];

export interface AIMessage {
  role: 'user' | 'ai';
  id: string;
}

export const aiConversation: AIMessage[] = [
  { role: 'user', id: 'userPrompt' },
  { role: 'ai', id: 'aiResponse' },
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

export interface SeatPreview {
  id: string;
  status: SeatStatus;
}

export const seatAvailability: SeatPreview[] = [
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'B1',
  'B2',
  'B3',
  'B4',
  'B5',
  'B6',
].map((id, index) => ({
  id,
  status: (
    ['available', 'available', 'reserved', 'available', 'occupied', 'available'] as SeatStatus[]
  )[index % 6],
}));

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
  icon: LucideIcon;
  id: string;
}

export const communityHighlights: CommunityHighlight[] = [
  { icon: MessagesSquare, id: 'bookDiscussions' },
  { icon: Trophy, id: 'reviews' },
  { icon: Users, id: 'readingClubs' },
  { icon: Gift, id: 'volunteerPrograms' },
];

export interface Testimonial {
  id: string;
  name: string;
}

export const testimonials: Testimonial[] = [
  { id: 'priyaSharma', name: 'Priya Sharma' },
  { id: 'danielCho', name: 'Daniel Cho' },
  { id: 'amaraOkafor', name: 'Amara Okafor' },
  { id: 'liamFitzgerald', name: 'Liam Fitzgerald' },
  { id: 'ananyaIyer', name: 'Ananya Iyer' },
  { id: 'marcusBenson', name: 'Marcus Benson' },
  { id: 'fatimaAlRashid', name: 'Fatima Al-Rashid' },
  { id: 'kenjiTanaka', name: 'Kenji Tanaka' },
  { id: 'graceMwangi', name: 'Grace Mwangi' },
  { id: 'diegoFernandez', name: 'Diego Fernández' },
  { id: 'sarahOConnor', name: 'Sarah OConnor' },
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

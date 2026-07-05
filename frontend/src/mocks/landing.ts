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
  label: string;
  value: string;
}

export const statistics: Statistic[] = [
  { icon: BookOpen, label: 'Books Available', value: '12,400+' },
  { icon: Users, label: 'Members', value: '3,200+' },
  { icon: MessagesSquare, label: 'Reading Clubs', value: '85' },
  { icon: CalendarDays, label: 'Events Hosted', value: '210' },
  { icon: BookMarked, label: 'Books Borrowed', value: '48,000+' },
  { icon: CalendarCheck, label: 'Study Seats', value: '60' },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: BookOpen,
    title: 'Digital Library',
    description: 'Search, filter, and browse the full catalog of books, authors, and categories.',
  },
  {
    icon: QrCode,
    title: 'QR Borrowing',
    description: 'Scan a book’s QR code to borrow or return it in seconds, no paperwork.',
  },
  {
    icon: CalendarCheck,
    title: 'Seat Booking',
    description: 'Reserve a quiet study seat ahead of time and see live availability.',
  },
  {
    icon: Bot,
    title: 'AI Librarian',
    description: 'Get personalized book suggestions from a conversational reading assistant.',
  },
  {
    icon: Trophy,
    title: 'Reading Challenges',
    description: 'Track your progress and earn achievements as you read more.',
  },
  {
    icon: MessagesSquare,
    title: 'Community Discussions',
    description: 'Join reading clubs, share reviews, and discuss your favorite books.',
  },
  {
    icon: Gift,
    title: 'Book Donations',
    description: 'Donate books you’ve finished and help grow the shared collection.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Librarians and admins get insight into trends, popular books, and usage.',
  },
];

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  { step: 1, title: 'Register', description: 'Create a free membership in under a minute.' },
  { step: 2, title: 'Search Books', description: 'Find titles by category, author, or mood.' },
  {
    step: 3,
    title: 'Borrow / Reserve',
    description: 'Pick up a copy or reserve one that’s checked out.',
  },
  {
    step: 4,
    title: 'Read & Participate',
    description: 'Track progress and join the community around it.',
  },
];

export interface AIMessage {
  role: 'user' | 'ai';
  message: string;
}

export const aiConversation: AIMessage[] = [
  { role: 'user', message: 'Suggest beginner books for Machine Learning.' },
  {
    role: 'ai',
    message:
      'Here are five recommendations: "Hands-On Machine Learning", "The Hundred-Page ML Book", "Python Machine Learning", "Deep Learning for Coders", and "Grokking Machine Learning".',
  },
];

export interface MoodRecommendation {
  mood: string;
  emoji: string;
  books: string[];
}

export const moodRecommendations: MoodRecommendation[] = [
  {
    mood: 'Happy',
    emoji: '\u{1F60A}',
    books: ['The House in the Cerulean Sea', 'Anne of Green Gables'],
  },
  { mood: 'Relaxed', emoji: '\u{1F60C}', books: ['Norwegian Wood', 'The Overstory'] },
  {
    mood: 'Curious',
    emoji: '\u{1F92F}',
    books: ['Sapiens', 'A Short History of Nearly Everything'],
  },
  { mood: 'Motivated', emoji: '\u{1F60E}', books: ['Atomic Habits', 'Can’t Hurt Me'] },
  { mood: 'Study Mode', emoji: '\u{1F4DA}', books: ['Deep Work', 'How to Read a Book'] },
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
  label: string;
  description: string;
}

export const achievements: Achievement[] = [
  { label: 'First Book', description: 'Borrow your first book' },
  { label: 'Book Worm', description: 'Read 10 books in a year' },
  { label: 'Top Reader', description: 'Reach the top of the monthly leaderboard' },
  { label: 'Monthly Champion', description: 'Complete every weekly challenge in a month' },
];

export interface CommunityHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const communityHighlights: CommunityHighlight[] = [
  {
    icon: MessagesSquare,
    title: 'Book Discussions',
    description: 'Talk through plot twists and themes with other readers.',
  },
  {
    icon: Trophy,
    title: 'Reviews',
    description: 'Rate and review books to help the community pick their next read.',
  },
  {
    icon: Users,
    title: 'Reading Clubs',
    description: 'Join a club that matches your favorite genre and reading pace.',
  },
  {
    icon: Gift,
    title: 'Volunteer Programs',
    description: 'Help run events, sort donations, or mentor new members.',
  },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Member since 2023',
    quote: 'The seat booking feature alone saved me so many wasted trips to a full library.',
  },
  {
    name: 'Daniel Cho',
    role: 'Reading Club Lead',
    quote: 'Running our monthly book club is so much easier with the discussion boards built in.',
  },
  {
    name: 'Amara Okafor',
    role: 'Volunteer',
    quote:
      'Coordinating donations and events used to be all spreadsheets. Now it’s all in one place.',
  },
  {
    name: 'Liam Fitzgerald',
    role: 'Member since 2024',
    quote: 'The AI librarian recommended books I never would have picked myself, and I loved them.',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'How do reservations work?',
    answer:
      'If a book is checked out, you can reserve it and you’ll be notified as soon as it’s back on the shelf.',
  },
  {
    question: 'How do seat bookings work?',
    answer:
      'Pick an open time slot on the seat map and it’s held for you until your session starts.',
  },
  {
    question: 'Can I donate books?',
    answer:
      'Yes, submit a donation request and a librarian will review and approve it for the shared collection.',
  },
  {
    question: 'What is AI Librarian?',
    answer:
      'A conversational assistant that recommends books based on your interests, mood, or reading history.',
  },
];

import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Calendar,
  CalendarCheck,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  QrCode,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

// Display copy lives in i18n locale files (src/i18n/locales/*.json) under "pricing",
// keyed by `id`. These mocks hold only structural/numeric data — the actual
// billing prices and discount percentages a real backend would supply.

export type DurationId = '1m' | '3m' | '6m' | '12m';
export type ExtraFeatureId = 'prioritySupport' | 'earlyAccess' | 'freeOnboarding';

export interface PricingDuration {
  id: DurationId;
  months: number;
  /** Total price charged for the whole billing cycle, in INR. */
  price: number;
  savePercent: number;
  badge?: 'mostPopular' | 'bestValue';
  extraFeatureIds: ExtraFeatureId[];
}

export const pricingDurations: PricingDuration[] = [
  { id: '1m', months: 1, price: 499, savePercent: 0, extraFeatureIds: [] },
  {
    id: '3m',
    months: 3,
    price: 1349,
    savePercent: 10,
    badge: 'mostPopular',
    extraFeatureIds: [],
  },
  {
    id: '6m',
    months: 6,
    price: 2449,
    savePercent: 18,
    extraFeatureIds: ['prioritySupport'],
  },
  {
    id: '12m',
    months: 12,
    price: 4499,
    savePercent: 25,
    badge: 'bestValue',
    extraFeatureIds: ['prioritySupport', 'earlyAccess', 'freeOnboarding'],
  },
];

// Every plan includes this same core feature set (see pricing.coreFeatures.* in i18n).
export const coreFeatureIds = [
  'unlimitedBooks',
  'unlimitedMembers',
  'qrBorrowing',
  'seatReservation',
  'aiLibrarian',
  'readingChallenges',
  'events',
  'emailNotifications',
  'basicAnalytics',
] as const;

export interface IncludedFeature {
  id: string;
  icon: LucideIcon;
}

export const includedFeatures: IncludedFeature[] = [
  { id: 'bookManagement', icon: BookOpen },
  { id: 'memberManagement', icon: Users },
  { id: 'qrBorrowing', icon: QrCode },
  { id: 'aiLibrarian', icon: Bot },
  { id: 'seatReservation', icon: CalendarCheck },
  { id: 'eventManagement', icon: CalendarDays },
  { id: 'readingChallenges', icon: Trophy },
  { id: 'notifications', icon: Bell },
  { id: 'analytics', icon: BarChart3 },
  { id: 'multiDevice', icon: Smartphone },
  { id: 'secureAuth', icon: ShieldCheck },
  { id: 'responsiveDashboard', icon: LayoutDashboard },
];

export interface WhyLongerPlanCard {
  id: DurationId;
  icon: LucideIcon;
}

export const whyLongerPlans: WhyLongerPlanCard[] = [
  { id: '1m', icon: Rocket },
  { id: '3m', icon: GraduationCap },
  { id: '6m', icon: Calendar },
  { id: '12m', icon: Sparkles },
];

export interface PricingFaq {
  id: string;
}

export const pricingFaqs: PricingFaq[] = [
  { id: 'upgrade' },
  { id: 'cancel' },
  { id: 'discount' },
  { id: 'support' },
  { id: 'switchLonger' },
  { id: 'freeTrial' },
];

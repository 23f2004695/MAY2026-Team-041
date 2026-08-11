import { BookMarked, BookOpen, CalendarCheck, Flame, Star, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { LeaveLibraryReviewModal } from '@/features/reviews/components/LeaveLibraryReviewModal';
import { LibraryReviewCard } from '@/features/reviews/components/LibraryReviewCard';
import { apiGet } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import type { DueBook } from '@/mocks/dashboard';
import {
  useAuth,
  type LoanRecord,
  type Membership,
  type ReadingStreak,
  type Reservation,
  type SeatBookingRecord,
} from '@/providers/AuthProvider';

import { useNotificationsQuery } from '../../notifications/hooks/useNotificationsQuery';
import { BooksDueSoon } from '../components/BooksDueSoon';
import { CurrentlyBorrowed } from '../components/CurrentlyBorrowed';
import { MemberStatModal, type MemberStatKey } from '../components/MemberStatModal';
import { MemberSubscription } from '../components/MemberSubscription';
import { RecentNotifications, UpcomingEvents } from '../components/RecentActivity';

// Calendar-day difference (ignores time-of-day) so "3 days left" doesn't flicker
// to "2 days left" a few hours before midnight.
function daysUntil(iso: string): number {
  const due = new Date(iso);
  const now = new Date();
  const dueMidnight = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
  const nowMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((dueMidnight - nowMidnight) / (24 * 60 * 60 * 1000));
}

const EMPTY_STREAK: ReadingStreak = { current_streak_days: 0, longest_streak_days: 0 };

interface EventItem {
  id: string;
  title: string;
  date: string;
}

export function MemberDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    token,
    fullName,
    getMembership,
    getMyLoans,
    getMyReservations,
    getMySeatBookings,
    getReadingStreak,
  } = useAuth();

  // Shared with the notification bell and panel — this page no longer refetches a list
  // the bell already has cached.
  const { notifications } = useNotificationsQuery();

  const [membership, setMembership] = useState<Membership | null>(null);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [seatBookings, setSeatBookings] = useState<SeatBookingRecord[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [streak, setStreak] = useState<ReadingStreak>(EMPTY_STREAK);
  const [activeStat, setActiveStat] = useState<MemberStatKey | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getMembership().then((data) => {
      if (!cancelled) setMembership(data);
    }).catch(() => {
      if (!cancelled) setMembership(null);
    });
    getMyLoans().then((data) => {
      if (!cancelled) setLoans(data);
    }).catch(() => {
      if (!cancelled) setLoans([]);
    });
    getMyReservations().then((data) => {
      if (!cancelled) setReservations(data);
    }).catch(() => {
      if (!cancelled) setReservations([]);
    });
    getMySeatBookings().then((data) => {
      if (!cancelled) setSeatBookings(data);
    }).catch(() => {
      if (!cancelled) setSeatBookings([]);
    });
    apiGet<{ items: EventItem[] }>('/events?page_size=100', token ?? undefined)
      .then((data) => {
        if (!cancelled) setEvents(data.items || []);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });
    getReadingStreak().then((data) => {
      if (!cancelled) setStreak(data);
    }).catch(() => {
      if (!cancelled) setStreak(EMPTY_STREAK);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const activeLoans = useMemo(() => loans.filter((loan) => loan.status !== 'returned'), [loans]);
  const currentlyBorrowed = useMemo(
    () =>
      activeLoans.map((loan) => ({
        id: loan.id,
        title: loan.book_title,
        borrowedOn: formatDate(loan.borrowed_at),
      })),
    [activeLoans],
  );
  const booksDueSoon: DueBook[] = useMemo(
    () =>
      loans
        .filter((loan) => loan.status === 'active')
        .map((loan) => ({
          id: loan.id,
          title: loan.book_title,
          dueDate: formatDate(loan.due_date),
          daysLeft: daysUntil(loan.due_date),
        }))
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 5),
    [loans],
  );

  const [now] = useState(Date.now);
  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => new Date(e.date).getTime() >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
        .map((e) => ({
          id: e.id,
          title: e.title,
          date: formatDate(e.date),
        })),
    [events, now],
  );

  const unpaidFines = useMemo(
    () => loans.filter((loan) => loan.fine_amount > 0 && !loan.fine_paid),
    [loans],
  );
  const totalFine = useMemo(
    () => unpaidFines.reduce((sum, loan) => sum + loan.fine_amount, 0),
    [unpaidFines],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('dashboard.welcomeBack', { name: (fullName ?? '').split(' ')[0] || 'there' })}
        description={membership ? membership.plan_label : t('dashboard.subscription.noPlan')}
      />

      <h2 className="sr-only">{t('common.dashboardSectionsHeading')}</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatisticCard
          icon={BookOpen}
          label={t('dashboard.stats.booksBorrowed')}
          value={String(activeLoans.length)}
          onClick={() => setActiveStat('booksBorrowed')}
          selected={activeStat === 'booksBorrowed'}
        />
        <StatisticCard
          icon={BookMarked}
          label={t('dashboard.stats.booksReserved')}
          value={String(reservations.length)}
          onClick={() => setActiveStat('booksReserved')}
          selected={activeStat === 'booksReserved'}
        />
        <StatisticCard
          icon={CalendarCheck}
          label={t('dashboard.stats.seatBookings')}
          value={String(seatBookings.length)}
          onClick={() => setActiveStat('seatBookings')}
          selected={activeStat === 'seatBookings'}
        />
        <StatisticCard
          icon={Flame}
          label={t('readingProgress.readingStreak.title')}
          value={t('readingProgress.readingStreak.currentDays', {
            count: streak.current_streak_days,
          })}
          onClick={() => setActiveStat('readingStreak')}
          selected={activeStat === 'readingStreak'}
        />
      </div>

      <MemberSubscription
        planLabel={membership ? membership.plan_label : 'No active plan'}
        expiresOn={membership ? formatDate(membership.expires_at) : undefined}
        outstandingFine={formatCurrency(totalFine)}
        fineReasonKey={unpaidFines.length > 0 ? 'lateReturn' : undefined}
        fineBookTitle={unpaidFines[0]?.book_title}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BooksDueSoon books={booksDueSoon} />
        <CurrentlyBorrowed books={currentlyBorrowed} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentNotifications notifications={notifications.slice(0, 5)} />
        <UpcomingEvents events={upcomingEvents} />
      </div>

      <LibraryReviewCard onOpenModal={() => setIsReviewModalOpen(true)} />

      <QuickActionsCard
        title={t('dashboard.quickActions.title')}
        actions={[
          {
            label: t('dashboard.quickActions.browseBooks'),
            icon: BookOpen,
            onClick: () => navigate(ROUTES.BOOKS),
          },
          {
            label: t('dashboard.quickActions.bookASeat'),
            icon: CalendarCheck,
            onClick: () => navigate(ROUTES.SEAT_BOOKING),
          },
          {
            label: t('dashboard.quickActions.viewReservations'),
            icon: Ticket,
            onClick: () => navigate(ROUTES.RESERVATIONS),
          },
          {
            label: t('dashboard.quickActions.writeReview', 'Write Library Review'),
            icon: Star,
            onClick: () => setIsReviewModalOpen(true),
          },
        ]}
      />

      <LeaveLibraryReviewModal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />

      <MemberStatModal
        statKey={activeStat}
        onClose={() => setActiveStat(null)}
        activeLoans={activeLoans}
        reservations={reservations}
        seatBookings={seatBookings}
        streak={streak}
        onBrowseBooks={() => navigate(ROUTES.BOOKS)}
        onViewReservations={() => navigate(ROUTES.RESERVATIONS)}
        onManageSeatBookings={() => navigate(ROUTES.SEAT_BOOKING)}
        onViewReadingProgress={() => navigate(ROUTES.READING_PROGRESS)}
      />
    </div>
  );
}
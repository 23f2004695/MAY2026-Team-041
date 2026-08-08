import { BookMarked, BookOpen, CalendarCheck, Flame, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { ROUTES } from '@/constants/routes';
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

export function MemberDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
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
  const [streak, setStreak] = useState<ReadingStreak>(EMPTY_STREAK);

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
    getReadingStreak().then((data) => {
      if (!cancelled) setStreak(data);
    }).catch(() => {
      if (!cancelled) setStreak(EMPTY_STREAK);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        />
        <StatisticCard
          icon={BookMarked}
          label={t('dashboard.stats.booksReserved')}
          value={String(reservations.length)}
        />
        <StatisticCard
          icon={CalendarCheck}
          label={t('dashboard.stats.seatBookings')}
          value={String(seatBookings.length)}
        />
        <StatisticCard
          icon={Flame}
          label={t('readingProgress.readingStreak.title')}
          value={t('readingProgress.readingStreak.currentDays', {
            count: streak.current_streak_days,
          })}
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
        <UpcomingEvents events={[]} />
      </div>

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
        ]}
      />
    </div>
  );
}

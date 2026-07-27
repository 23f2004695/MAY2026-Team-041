import {
  AlertCircle,
  Armchair,
  Award,
  BookOpen,
  ClipboardList,
  Clock,
  FileText,
  IndianRupee,
  KeyRound,
  TicketCheck,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProgressBar, StatisticCard } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { auditLog } from '@/mocks/admin';
import { children, childBorrowedBooks, guardianStats } from '@/mocks/guardian';
import { accessEntries, issueTickets } from '@/mocks/itHead';
import { pendingPayments, registrationRequests, walkInRequests } from '@/mocks/manager';
import { useAuth, type Membership, type ReadingProgressEntry } from '@/providers/AuthProvider';

import { AuditLog } from '@/features/admin/components/AuditLog';
import { NewRegistrations } from '@/features/dashboard/components/NewRegistrations';
import { WalkInAssistance } from '@/features/dashboard/components/WalkInAssistance';
import { BorrowedBooksByChild } from '@/features/guardian/components/BorrowedBooksByChild';
import { ChildrenPresence } from '@/features/guardian/components/ChildrenPresence';
import { AccessControl } from '@/features/it-head/components/AccessControl';
import { IssueResolution } from '@/features/it-head/components/IssueResolution';

import { ProfileHeader } from '../components/ProfileHeader';

function AdminProfile() {
  const { t } = useTranslation();
  const myActivity = useMemo(() => auditLog.filter((entry) => entry.actor.self), []);
  const expensesApproved = myActivity.filter(
    (entry) => entry.action.key === 'expenseApproved',
  ).length;
  const finesWaived = myActivity.filter((entry) => entry.action.key === 'fineWaived').length;

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader name={t('auth.login.roles.admin')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatisticCard
          icon={ClipboardList}
          label={t('profile.adminStats.actionsThisMonth')}
          value={String(myActivity.length)}
        />
        <StatisticCard
          icon={IndianRupee}
          label={t('profile.adminStats.expensesApproved')}
          value={String(expensesApproved)}
        />
        <StatisticCard
          icon={Wallet}
          label={t('profile.adminStats.finesWaived')}
          value={String(finesWaived)}
        />
      </div>

      <AuditLog entries={myActivity} />
    </div>
  );
}

function GuardianProfile() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader name={t('auth.login.roles.guardian')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {guardianStats.map((stat) => (
          <StatisticCard
            key={stat.labelKey}
            icon={stat.icon}
            label={t(stat.labelKey)}
            value={stat.value}
          />
        ))}
      </div>

      <ChildrenPresence children={children} />
      <BorrowedBooksByChild books={childBorrowedBooks} children={children} />
    </div>
  );
}

function ManagerProfile() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader name={t('auth.login.roles.manager')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatisticCard
          icon={Armchair}
          label={t('profile.managerStats.walkInRequests')}
          value={String(walkInRequests.length)}
        />
        <StatisticCard
          icon={UserPlus}
          label={t('profile.managerStats.newRegistrations')}
          value={String(registrationRequests.length)}
        />
        <StatisticCard
          icon={IndianRupee}
          label={t('profile.managerStats.pendingPayments')}
          value={String(pendingPayments.length)}
        />
      </div>

      <WalkInAssistance requests={walkInRequests} />
      <NewRegistrations
        requests={registrationRequests}
        onRegister={(request) => comingSoonToast(request.name)}
      />
    </div>
  );
}

function ITHeadProfile() {
  const { t } = useTranslation();
  const openIssues = useMemo(
    () => issueTickets.filter((ticket) => ticket.status === 'open').length,
    [],
  );
  const resolvedIssues = useMemo(
    () => issueTickets.filter((ticket) => ticket.status === 'resolved').length,
    [],
  );
  const pendingPermissions = useMemo(
    () => accessEntries.filter((entry) => entry.pendingPermission).length,
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader name={t('auth.login.roles.it-head')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatisticCard
          icon={AlertCircle}
          label={t('profile.itHeadStats.openIssues')}
          value={String(openIssues)}
        />
        <StatisticCard
          icon={TicketCheck}
          label={t('profile.itHeadStats.resolvedIssues')}
          value={String(resolvedIssues)}
        />
        <StatisticCard
          icon={KeyRound}
          label={t('profile.itHeadStats.pendingPermissions')}
          value={String(pendingPermissions)}
        />
      </div>

      <AccessControl entries={accessEntries} />
      <IssueResolution tickets={issueTickets} />
    </div>
  );
}

function formatJoinDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ponytail: booksRead comes from real ReadingProgress (status=completed); pagesRead
// and hoursRead have no tracking source at all (no page counts, no time tracking)
// so they show honest zeros instead of fabricated numbers. Achievements and borrow
// history have no backend yet (gamification/Loan out of scope for now) — honest
// empty states rather than the old mock badges/table rows.
function MemberProfile() {
  const { t } = useTranslation();
  const { fullName, email, getMembership, getMyReadingProgress } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [progress, setProgress] = useState<ReadingProgressEntry[]>([]);

  useEffect(() => {
    getMembership().then(setMembership).catch(() => setMembership(null));
    getMyReadingProgress().then(setProgress).catch(() => setProgress([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentlyReading = progress.filter((entry) => entry.status === 'reading');
  const booksRead = progress.filter((entry) => entry.status === 'completed').length;

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        name={fullName ?? ''}
        email={email ?? undefined}
        joinDate={membership ? formatJoinDate(membership.purchased_at) : undefined}
        planLabel={membership?.is_active ? membership.plan_label : undefined}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatisticCard icon={BookOpen} label={t('profile.stats.booksRead')} value={String(booksRead)} />
        <StatisticCard icon={FileText} label={t('profile.stats.pagesRead')} value="0" />
        <StatisticCard icon={Clock} label={t('profile.stats.hoursRead')} value="0" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.achievements.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Award}
            title={t('profile.achievements.empty.title')}
            description={t('profile.achievements.empty.description')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.currentReading.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentlyReading.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={t('readingProgress.emptyState.title')}
              description={t('readingProgress.lists.currentlyReading.emptyDescription')}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {currentlyReading.map((entry) => (
                <div key={entry.id}>
                  <p className="text-sm font-medium text-foreground">{entry.book_title}</p>
                  <ProgressBar percent={entry.percent_complete} className="mt-1.5" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.borrowHistory.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={ClipboardList}
            title={t('profile.borrowHistory.empty.title')}
            description={t('profile.borrowHistory.empty.description')}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function ProfilePage() {
  const { role } = useAuth();

  if (role === 'admin') return <AdminProfile />;
  if (role === 'manager') return <ManagerProfile />;
  if (role === 'it-head') return <ITHeadProfile />;
  if (role === 'guardian') return <GuardianProfile />;

  return <MemberProfile />;
}

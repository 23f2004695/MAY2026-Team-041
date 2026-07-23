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
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ProgressBar, StatisticCard } from '@/components/common';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { auditLog } from '@/mocks/admin';
import { children, childBorrowedBooks, guardianStats } from '@/mocks/guardian';
import { accessEntries, issueTickets } from '@/mocks/itHead';
import { pendingPayments, registrationRequests, walkInRequests } from '@/mocks/manager';
import {
  borrowHistory,
  currentReading,
  profileAchievements,
  profileOverview,
  readingStats,
} from '@/mocks/profile';
import { useAuth } from '@/providers/AuthProvider';

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
      <NewRegistrations requests={registrationRequests} />
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

export function ProfilePage() {
  const { t } = useTranslation();
  const { role } = useAuth();

  if (role === 'admin') return <AdminProfile />;
  if (role === 'manager') return <ManagerProfile />;
  if (role === 'it-head') return <ITHeadProfile />;
  if (role === 'guardian') return <GuardianProfile />;

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        name={profileOverview.name}
        email={profileOverview.email}
        joinDate={profileOverview.joinDate}
        membershipPlanKey={profileOverview.membershipPlanKey}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatisticCard
          icon={BookOpen}
          label={t('profile.stats.booksRead')}
          value={String(readingStats.booksRead)}
        />
        <StatisticCard
          icon={FileText}
          label={t('profile.stats.pagesRead')}
          value={readingStats.pagesRead.toLocaleString()}
        />
        <StatisticCard
          icon={Clock}
          label={t('profile.stats.hoursRead')}
          value={String(readingStats.hoursRead)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.achievements.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {profileAchievements.map((achievement) => (
              <li key={achievement.id}>
                <Badge
                  variant="success"
                  className="gap-1.5 px-3 py-1.5 text-sm"
                  title={t(achievement.descriptionKey)}
                >
                  <Award className="size-3.5" />
                  {t(achievement.labelKey)}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.currentReading.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {currentReading.map((book) => (
            <div key={book.title}>
              <p className="text-sm font-medium text-foreground">
                {book.title}{' '}
                <span className="font-normal text-muted-foreground">
                  {t('profile.currentReading.by', { author: book.author })}
                </span>
              </p>
              <ProgressBar percent={book.percentComplete} className="mt-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.borrowHistory.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('profile.borrowHistory.columns.title')}</TableHead>
                <TableHead>{t('profile.borrowHistory.columns.borrowedOn')}</TableHead>
                <TableHead>{t('profile.borrowHistory.columns.returnedOn')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowHistory.map((entry) => (
                <TableRow key={entry.title}>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.borrowedOn}</TableCell>
                  <TableCell>{entry.returnedOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

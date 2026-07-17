import { Award, BookOpen, Clock, FileText } from 'lucide-react';
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
import {
  borrowHistory,
  currentReading,
  profileAchievements,
  profileOverview,
  readingStats,
} from '@/mocks/profile';

import { ProfileHeader } from '../components/ProfileHeader';

export function ProfilePage() {
  const { t } = useTranslation('profile');

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        name={profileOverview.name}
        email={profileOverview.email}
        joinDate={profileOverview.joinDate}
        membershipPlan={profileOverview.membershipPlan}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatisticCard
          icon={BookOpen}
          label={t('stats.booksRead')}
          value={String(readingStats.booksRead)}
        />
        <StatisticCard
          icon={FileText}
          label={t('stats.pagesRead')}
          value={readingStats.pagesRead.toLocaleString()}
        />
        <StatisticCard
          icon={Clock}
          label={t('stats.hoursRead')}
          value={String(readingStats.hoursRead)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('achievements.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {profileAchievements.map((achievement) => (
              <li key={achievement.id}>
                <Badge
                  variant="success"
                  className="gap-1.5 px-3 py-1.5 text-sm"
                  title={t(`achievements.items.${achievement.id}.description`)}
                >
                  <Award className="size-3.5" />
                  {t(`achievements.items.${achievement.id}.label`)}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('currentReading.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {currentReading.map((book) => (
            <div key={book.title}>
              <p className="text-sm font-medium text-foreground">
                {book.title}{' '}
                <span className="font-normal text-muted-foreground">
                  {t('currentReading.by', { author: book.author })}
                </span>
              </p>
              <ProgressBar percent={book.percentComplete} className="mt-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('borrowHistory.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('borrowHistory.columns.title')}</TableHead>
                <TableHead>{t('borrowHistory.columns.borrowedOn')}</TableHead>
                <TableHead>{t('borrowHistory.columns.returnedOn')}</TableHead>
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

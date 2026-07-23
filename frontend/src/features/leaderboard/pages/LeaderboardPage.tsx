import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/components/common';
import {
  Avatar,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { cn } from '@/lib/cn';
import { leaderboard } from '@/mocks/leaderboard';
import { useAuth } from '@/providers/AuthProvider';

const medalColor: Record<number, string> = {
  1: 'text-warning',
  2: 'text-muted-foreground',
  3: 'text-danger',
};

export function LeaderboardPage() {
  const { t } = useTranslation();
  const { role } = useAuth();
  // Only members are leaderboard participants — staff and guardians are
  // viewing someone else's stats, never their own, however the mock data
  // happens to be flagged.
  const isParticipant = role === 'member';

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('leaderboard.pageTitle')}
        description={t('leaderboard.pageDescription')}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('leaderboard.table.rank')}</TableHead>
            <TableHead>{t('leaderboard.table.reader')}</TableHead>
            <TableHead>{t('leaderboard.table.points')}</TableHead>
            <TableHead>{t('leaderboard.table.badges')}</TableHead>
            <TableHead>{t('leaderboard.table.hoursRead')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry) => {
            const isYou = isParticipant && entry.isCurrentUser;
            return (
              <TableRow key={entry.rank} className={cn(isYou && 'bg-primary/5')}>
                <TableCell>
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    {entry.rank <= 3 && <Award className={cn('size-4', medalColor[entry.rank])} />}
                    {entry.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <Avatar name={entry.name} size="sm" />
                    {entry.name}
                    {isYou && (
                      <Badge variant="outline" className="ml-1">
                        {t('common.you')}
                      </Badge>
                    )}
                  </span>
                </TableCell>
                <TableCell>{entry.points.toLocaleString()}</TableCell>
                <TableCell>{entry.badges}</TableCell>
                <TableCell>{t('leaderboard.hoursSuffix', { hours: entry.hoursRead })}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

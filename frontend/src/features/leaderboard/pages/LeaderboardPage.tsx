import { Award } from 'lucide-react';

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

const medalColor: Record<number, string> = {
  1: 'text-warning',
  2: 'text-muted-foreground',
  3: 'text-danger',
};

export function LeaderboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">Top readers in the community this month</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Reader</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Badges</TableHead>
            <TableHead>Hours Read</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry) => (
            <TableRow key={entry.rank} className={cn(entry.isCurrentUser && 'bg-primary/5')}>
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
                  {entry.isCurrentUser && (
                    <Badge variant="outline" className="ml-1">
                      You
                    </Badge>
                  )}
                </span>
              </TableCell>
              <TableCell>{entry.points.toLocaleString()}</TableCell>
              <TableCell>{entry.badges}</TableCell>
              <TableCell>{entry.hoursRead}h</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

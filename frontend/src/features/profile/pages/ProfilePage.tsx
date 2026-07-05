import { Award, BookOpen, Clock, FileText } from 'lucide-react';

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
  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        name={profileOverview.name}
        email={profileOverview.email}
        joinDate={profileOverview.joinDate}
        membershipPlan={profileOverview.membershipPlan}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatisticCard icon={BookOpen} label="Books Read" value={String(readingStats.booksRead)} />
        <StatisticCard
          icon={FileText}
          label="Pages Read"
          value={readingStats.pagesRead.toLocaleString()}
        />
        <StatisticCard icon={Clock} label="Hours Read" value={String(readingStats.hoursRead)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {profileAchievements.map((achievement) => (
              <li key={achievement.label}>
                <Badge
                  variant="success"
                  className="gap-1.5 px-3 py-1.5 text-sm"
                  title={achievement.description}
                >
                  <Award className="size-3.5" />
                  {achievement.label}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Reading</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {currentReading.map((book) => (
            <div key={book.title}>
              <p className="text-sm font-medium text-foreground">
                {book.title}{' '}
                <span className="font-normal text-muted-foreground">by {book.author}</span>
              </p>
              <ProgressBar percent={book.percentComplete} className="mt-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Borrow History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Borrowed On</TableHead>
                <TableHead>Returned On</TableHead>
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

import { Award } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle, Pagination, TableToolbar } from '@/components/common';
import { NoResults } from '@/components/feedback';
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
import { usePagination, useSortedItems } from '@/hooks';
import { cn } from '@/lib/cn';
import { useAuth, type LeaderboardEntry } from '@/providers/AuthProvider';

const PAGE_SIZE = 10;
const medalColor: Record<number, string> = {
  1: 'text-warning',
  2: 'text-muted-foreground',
  3: 'text-danger',
};

// There's no per-period data on LeaderboardEntry (no weekly/monthly/yearly scores),
// only an overall rank — so this is a rank cutoff, not a time window. Naming it
// "Weekly"/"Monthly"/"Yearly" would promise a feature that doesn't exist.
type LeaderboardView = 'top50' | 'all';
type LeaderboardSort = 'scoreHigh' | 'scoreLow' | 'nameAsc' | 'nameDesc';

export function LeaderboardPage() {
  const { t } = useTranslation();
  const { getLeaderboard } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [view, setView] = useState<LeaderboardView>('top50');
  const [sort, setSort] = useState<LeaderboardSort>('scoreHigh');

  useEffect(() => {
    getLeaderboard().then(setEntries).catch(() => setEntries([]));
  }, [getLeaderboard]);

  const filteredEntries = useMemo(
    () =>
      view === 'all' ? entries : entries.filter((entry) => entry.rank <= 50 || entry.is_current_user),
    [entries, view],
  );

  const sortConfig = useMemo(
    () => ({
      compare: (a: LeaderboardEntry, b: LeaderboardEntry) => {
        switch (sort) {
          case 'scoreLow':
            return a.books_completed - b.books_completed;
          case 'nameAsc':
            return a.full_name.localeCompare(b.full_name);
          case 'nameDesc':
            return b.full_name.localeCompare(a.full_name);
          case 'scoreHigh':
          default:
            return b.books_completed - a.books_completed;
        }
      },
    }),
    [sort],
  );

  const visibleEntries = useSortedItems(filteredEntries, sortConfig);

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(
    visibleEntries,
    PAGE_SIZE,
  );

  function resetFilters() {
    setView('top50');
    setSort('scoreHigh');
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('leaderboard.pageTitle')}
        description={t('leaderboard.pageDescription')}
      />

      {entries.length === 0 ? (
        <NoResults
          icon={Award}
          title={t('leaderboard.empty.title')}
          description={t('leaderboard.empty.description')}
        />
      ) : (
        <>
          <TableToolbar
            filters={[
              {
                label: 'Show',
                value: view,
                onChange: (value) => {
                  setView(value as LeaderboardView);
                  setPage(1);
                },
                options: [
                  { value: 'top50', label: 'Top 50' },
                  { value: 'all', label: 'Everyone' },
                ],
              },
            ]}
            sort={{
              label: 'Sort',
              value: sort,
              onChange: (value) => {
                setSort(value as LeaderboardSort);
                setPage(1);
              },
              options: [
                { value: 'scoreHigh', label: 'Highest Score' },
                { value: 'scoreLow', label: 'Lowest Score' },
                { value: 'nameAsc', label: 'Name A–Z' },
                { value: 'nameDesc', label: 'Name Z–A' },
              ],
            }}
            onReset={resetFilters}
            resetLabel="Reset"
          />

          {visibleEntries.length === 0 ? (
            <NoResults
              icon={Award}
              title={t('leaderboard.empty.title')}
              description={t('leaderboard.empty.description')}
              action={
                <button type="button" onClick={resetFilters} className="text-sm font-medium text-primary">
                  Reset
                </button>
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('leaderboard.table.rank')}</TableHead>
                    <TableHead>{t('leaderboard.table.reader')}</TableHead>
                    <TableHead>{t('leaderboard.table.booksCompleted')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((entry) => (
                    <TableRow key={entry.member_id} className={cn(entry.is_current_user && 'bg-primary/5')}>
                      <TableCell>
                        <span className="flex items-center gap-1.5 font-semibold text-foreground">
                          {entry.rank <= 3 && <Award className={cn('size-4', medalColor[entry.rank])} />}
                          {entry.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Avatar name={entry.full_name} size="sm" />
                          {entry.full_name}
                          {entry.is_current_user && (
                            <Badge variant="outline" className="ml-1">
                              {t('common.you')}
                            </Badge>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>{entry.books_completed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

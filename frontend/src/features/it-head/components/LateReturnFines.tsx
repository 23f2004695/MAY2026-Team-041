import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Pagination, TableToolbar } from '@/components/common';
import { NoResults } from '@/components/feedback';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { usePagination } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import { useAuth, type LoanRecord } from '@/providers/AuthProvider';

export function LateReturnFines({ entries, onChanged }: { entries: LoanRecord[]; onChanged: () => void }) {
  const { t } = useTranslation();
  const { sendFineReminder, markFinePaid } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortValue, setSortValue] = useState('amount');

  // /loans/fines keeps every late-return row forever (fine_paid included) so the
  // dashboard total can still be computed from it — this view is the "still owe
  // money" queue though, so a paid fine has no reason to keep taking up a row here.
  const unpaid = useMemo(() => {
    const items = [...entries].filter((entry) => !entry.fine_paid);
    const filtered = items.filter((entry) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'unpaid') return !entry.fine_paid;
      if (statusFilter === 'paid') return entry.fine_paid;
      return true;
    });

    switch (sortValue) {
      case 'member':
        return filtered.sort((a, b) => a.member_name.localeCompare(b.member_name));
      case 'amount-desc':
        return filtered.sort((a, b) => b.fine_amount - a.fine_amount);
      case 'amount':
      default:
        return filtered.sort((a, b) => a.fine_amount - b.fine_amount);
    }
  }, [entries, sortValue, statusFilter]);

  const { page, setPage, totalPages, paginatedItems, totalItems } = usePagination(unpaid, 3);

  async function handleRemind(entry: LoanRecord) {
    try {
      await sendFineReminder(entry.id);
      toast.success(t('itHead.lateFines.reminderToast', { name: entry.member_name }));
    } catch (err) {
      toast.error(getErrorMessage(err, t('common.errors.generic')));
    }
  }

  async function handleMarkPaid(entry: LoanRecord) {
    try {
      await markFinePaid(entry.id);
      toast.success(t('itHead.lateFines.markedPaidToast', { name: entry.member_name }));
      onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err, t('common.errors.generic')));
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>{t('itHead.lateFines.title')}</CardTitle>
        <TableToolbar
          variant="icon-only"
          filters={[
            {
              label: t('itHead.lateFines.filters.statusLabel'),
              value: statusFilter,
              onChange: (value) => {
                setStatusFilter(value);
                setPage(1);
              },
              options: [
                { value: 'all', label: t('itHead.lateFines.filters.all') },
                { value: 'unpaid', label: t('itHead.lateFines.status.unpaid') },
              ],
            },
          ]}
          sort={{
            label: t('common.actions.sort'),
            value: sortValue,
            onChange: (value) => {
              setSortValue(value);
              setPage(1);
            },
            options: [
              { value: 'amount', label: t('itHead.lateFines.sort.amountLowToHigh') },
              { value: 'amount-desc', label: t('itHead.lateFines.sort.amountHighToLow') },
              { value: 'member', label: t('itHead.lateFines.sort.memberName') },
            ],
          }}
          onReset={() => {
            setStatusFilter('all');
            setSortValue('amount');
            setPage(1);
          }}
          resetLabel={t('common.actions.reset')}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {unpaid.length === 0 ? (
          <NoResults title={t('itHead.lateFines.empty')} />
        ) : (
          <>
            {paginatedItems.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{entry.book_title}</p>
                  <p className="text-muted-foreground">
                    {t('itHead.lateFines.borrowedBy', { name: entry.member_name })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('itHead.lateFines.dueDate', { date: formatDate(entry.due_date) })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger">{t('itHead.lateFines.daysLate', { count: entry.days_late })}</Badge>
                  <span className="font-medium text-foreground">{formatCurrency(entry.fine_amount)}</span>
                  <Badge variant="warning">{t('itHead.lateFines.status.unpaid')}</Badge>
                  <Button size="sm" variant="outline" onClick={() => handleRemind(entry)}>
                    {t('itHead.lateFines.sendReminder')}
                  </Button>
                  <Button size="sm" onClick={() => handleMarkPaid(entry)}>
                    {t('itHead.lateFines.markPaid')}
                  </Button>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={3}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

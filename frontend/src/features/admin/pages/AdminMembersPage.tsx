import { SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '@/components/common';
import { NoResults } from '@/components/feedback';
import {
  Avatar,
  Badge,
  Pagination,
  SearchBar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { useAuth, type AdminMemberRecord } from '@/providers/AuthProvider';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function LastPaymentCell({ member }: { member: AdminMemberRecord }) {
  const { t } = useTranslation();
  if (member.last_payment_amount === null || member.last_payment_at === null) {
    return <span className="text-muted-foreground">{t('admin.members.noPayment')}</span>;
  }
  return (
    <div>
      <p className="font-medium text-foreground">{formatCurrency(member.last_payment_amount)}</p>
      <p className="text-xs text-muted-foreground">
        {member.last_payment_label} · {formatDate(member.last_payment_at)}
      </p>
    </div>
  );
}

function PlanCell({ member }: { member: AdminMemberRecord }) {
  const { t } = useTranslation();
  if (member.plan_label === null || member.plan_expires_at === null) {
    return <span className="text-muted-foreground">{t('admin.members.noPlan')}</span>;
  }
  return (
    <div>
      <p className="font-medium text-foreground">{member.plan_label}</p>
      <p className="text-xs text-muted-foreground">
        {t(
          member.plan_is_active ? 'admin.members.planActiveUntil' : 'admin.members.planExpired',
          { date: formatDate(member.plan_expires_at) },
        )}
      </p>
    </div>
  );
}

function ProgressCell({ member }: { member: AdminMemberRecord }) {
  const { t } = useTranslation();
  if (member.books_reading === 0 && member.books_completed === 0) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className="text-xs text-muted-foreground">
      {member.books_reading > 0 && (
        <p>{t('admin.members.booksReading', { count: member.books_reading })}</p>
      )}
      {member.books_completed > 0 && (
        <p>{t('admin.members.booksCompleted', { count: member.books_completed })}</p>
      )}
    </div>
  );
}

export function AdminMembersPage() {
  const { t } = useTranslation();
  const { getAdminMembers } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminMemberRecord[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      getAdminMembers({ search, page, page_size: PAGE_SIZE })
        .then((data) => {
          if (cancelled) return;
          setItems(data.items);
          setTotal(data.total);
        })
        .catch(() => {
          if (cancelled) return;
          setItems([]);
          setTotal(0);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, page, getAdminMembers]);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('admin.members.pageTitle')}
        description={t('admin.members.pageDescription')}
      />

      <SearchBar
        value={search}
        onChange={updateSearch}
        placeholder={t('admin.members.searchPlaceholder')}
        className="max-w-sm"
      />

      {items.length === 0 ? (
        <NoResults
          icon={SearchX}
          title={t('admin.members.empty.title')}
          description={t('admin.members.empty.description')}
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.members.table.member')}</TableHead>
                <TableHead>{t('admin.members.table.lastPayment')}</TableHead>
                <TableHead>{t('admin.members.table.plan')}</TableHead>
                <TableHead>{t('admin.members.table.progress')}</TableHead>
                <TableHead>{t('admin.members.table.reported')}</TableHead>
                <TableHead>{t('admin.members.table.joined')}</TableHead>
                <TableHead>{t('admin.members.table.events')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={member.full_name} size="sm" />
                      <div>
                        <p className="font-medium text-foreground">{member.full_name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <LastPaymentCell member={member} />
                  </TableCell>
                  <TableCell>
                    <PlanCell member={member} />
                  </TableCell>
                  <TableCell>
                    <ProgressCell member={member} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.reported ? 'danger' : 'outline'}>
                      {t(member.reported ? 'admin.members.reportedYes' : 'admin.members.reportedNo')}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(member.joined_at)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {t('admin.members.eventsNotTracked')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

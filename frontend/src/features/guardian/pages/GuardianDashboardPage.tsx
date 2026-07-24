import { BookOpen, HandCoins, MessageSquare, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { childBorrowedBooks, children, guardianStats } from '@/mocks/guardian';
import { useAuth, type GuardianChild } from '@/providers/AuthProvider';

import { BorrowedBooksByChild } from '../components/BorrowedBooksByChild';
import { ChildrenPresence } from '../components/ChildrenPresence';
import { SeatReservationForChild } from '../components/SeatReservationForChild';
import { SubscriptionAndFines } from '../components/SubscriptionAndFines';

// ponytail: only linkedChildren + reading progress come from the real
// GuardianLink/ReadingProgress tables — presence, fines, borrowed books and
// seat booking have no backend yet, so those sections stay on mock data.
function ChildrenReadingProgress({ realChildren }: { realChildren: GuardianChild[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('readingProgress.pageTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {realChildren.length === 0 ? (
          <p className="text-muted-foreground">{t('readingProgress.emptyState.title')}</p>
        ) : (
          realChildren.map((child) => (
            <div key={child.id} className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground">{child.full_name}</span>
              <span className="text-muted-foreground">
                {child.currently_reading.length} reading · {child.completed.length} completed
              </span>
            </div>
          ))
        )}
        <Link
          to={ROUTES.READING_PROGRESS}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <BookOpen className="size-4" />
          {t('readingProgress.pageTitle')}
        </Link>
      </CardContent>
    </Card>
  );
}

export function GuardianDashboardPage() {
  const { t } = useTranslation();
  const { getGuardianChildren } = useAuth();
  const [realChildren, setRealChildren] = useState<GuardianChild[]>([]);

  useEffect(() => {
    getGuardianChildren().then(setRealChildren).catch(() => setRealChildren([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('guardian.pageTitle')} description={t('guardian.pageDescription')} />

      <h2 className="sr-only">{t('common.dashboardSectionsHeading')}</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {guardianStats.map((stat) => (
          <StatisticCard
            key={stat.labelKey}
            icon={stat.icon}
            label={t(stat.labelKey)}
            value={
              stat.labelKey === 'guardian.stats.linkedChildren'
                ? String(realChildren.length)
                : stat.value
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChildrenPresence children={children} />
        <BorrowedBooksByChild books={childBorrowedBooks} children={children} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SubscriptionAndFines children={children} />
        <SeatReservationForChild children={children} />
      </div>

      <ChildrenReadingProgress realChildren={realChildren} />

      <QuickActionsCard
        actions={[
          {
            label: t('guardian.quickActions.payAllFines'),
            icon: HandCoins,
            onClick: () => comingSoonToast(t('guardian.quickActions.toasts.payingAllFines')),
          },
          {
            label: t('guardian.quickActions.renewSubscription'),
            icon: RefreshCw,
            onClick: () => comingSoonToast(t('guardian.quickActions.toasts.renewingSubscription')),
          },
          {
            label: t('guardian.quickActions.contactStaff'),
            icon: MessageSquare,
            onClick: () => comingSoonToast(t('guardian.quickActions.toasts.contactingStaff')),
          },
        ]}
      />
    </div>
  );
}

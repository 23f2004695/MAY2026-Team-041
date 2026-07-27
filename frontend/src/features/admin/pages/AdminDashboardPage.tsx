import {
  BadgeIndianRupee,
  IndianRupee,
  Megaphone,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { formatCurrency } from '@/lib/format';
import { adminReports, auditLog, pendingRequests } from '@/mocks/admin';
import { type AdminDashboard, type AdminTrend, type ExpenseCategory, useAuth } from '@/providers/AuthProvider';

import { AuditLog } from '../components/AuditLog';
import { BudgetExpenses } from '../components/BudgetExpenses';
import { CashFlowBreakdown } from '../components/CashFlowBreakdown';
import { LiveSeatStatus } from '../components/LiveSeatStatus';
import { LogExpenseModal } from '../components/LogExpenseModal';
import { PendingRequests } from '../components/PendingRequests';
import { SeatOccupancySummary } from '../components/SeatOccupancySummary';

// More spending is bad news even when the number itself goes up — invert the
// default up-is-good sentiment for this one stat.
function expenseSentiment(trend: AdminTrend): 'positive' | 'negative' {
  return trend.direction === 'up' ? 'negative' : 'positive';
}

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { getAdminDashboard } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loggingCategory, setLoggingCategory] = useState<ExpenseCategory | null>(null);

  function refresh() {
    getAdminDashboard()
      .then(setDashboard)
      .catch(() => setDashboard(null));
  }

  useEffect(refresh, [getAdminDashboard]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('admin.pageTitle')} description={t('admin.pageDescription')} />

      <h2 className="sr-only">{t('common.dashboardSectionsHeading')}</h2>

      {dashboard && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatisticCard
              icon={IndianRupee}
              label={t('admin.stats.revenueMtd')}
              value={formatCurrency(dashboard.stats.revenue_mtd)}
              trend={dashboard.stats.revenue_trend}
            />
            <StatisticCard
              icon={TrendingDown}
              label={t('admin.stats.expensesMtd')}
              value={formatCurrency(dashboard.stats.expenses_mtd)}
              trend={{
                ...dashboard.stats.expenses_trend,
                sentiment: expenseSentiment(dashboard.stats.expenses_trend),
              }}
            />
            <StatisticCard
              icon={Wallet}
              label={t('admin.stats.netProfitMtd')}
              value={formatCurrency(dashboard.stats.net_profit_mtd)}
              trend={dashboard.stats.net_profit_trend}
            />
            <StatisticCard
              icon={Users}
              label={t('admin.stats.totalMembers')}
              value={String(dashboard.stats.total_members)}
              trend={dashboard.stats.total_members_trend}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CashFlowBreakdown sources={dashboard.cash_flow} />
            <BudgetExpenses categories={dashboard.budget} onLogExpense={setLoggingCategory} />
          </div>

          <LiveSeatStatus status={dashboard.seat_status} />

          <SeatOccupancySummary slots={dashboard.seat_occupancy} />
        </>
      )}

      <PendingRequests requests={pendingRequests} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AuditLog entries={auditLog} />

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.reports.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {adminReports.map((report) => (
              <div key={report.labelKey} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{t(report.labelKey)}</span>
                <Button size="sm" variant="ghost" onClick={() => comingSoonToast(t(report.labelKey))}>
                  {t('common.actions.viewReport')}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <QuickActionsCard
        actions={[
          {
            label: t('admin.quickActions.logExpense'),
            icon: ReceiptText,
            onClick: () => comingSoonToast(t('admin.quickActions.toasts.loggingExpense')),
          },
          {
            label: t('admin.quickActions.adjustPricing'),
            icon: BadgeIndianRupee,
            onClick: () => comingSoonToast(t('admin.quickActions.toasts.adjustingPricing')),
          },
          {
            label: t('admin.quickActions.inviteMember'),
            icon: UserPlus,
            onClick: () => comingSoonToast(t('admin.quickActions.toasts.invitingMember')),
          },
          {
            label: t('admin.quickActions.announcement'),
            icon: Megaphone,
            onClick: () => comingSoonToast(t('admin.quickActions.toasts.sendingAnnouncement')),
          },
          {
            label: t('admin.quickActions.viewGrowthReport'),
            icon: TrendingUp,
            onClick: () => comingSoonToast(t('admin.quickActions.toasts.viewingGrowthReport')),
          },
        ]}
      />

      <LogExpenseModal
        open={loggingCategory !== null}
        onClose={() => setLoggingCategory(null)}
        category={loggingCategory}
        categoryLabel={loggingCategory ? t(`admin.budget.categories.${loggingCategory}`) : ''}
        onLogged={refresh}
      />
    </div>
  );
}

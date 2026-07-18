import { BadgeIndianRupee, Megaphone, ReceiptText, TrendingUp, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { PageHeader, QuickActionsCard, StatisticCard } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import {
  adminReports,
  adminStats,
  auditLog,
  expenseCategories,
  pendingRequests,
  revenueBreakdown,
} from '@/mocks/admin';

import { AuditLog } from '../components/AuditLog';
import { BudgetExpenses } from '../components/BudgetExpenses';
import { CashFlowBreakdown } from '../components/CashFlowBreakdown';
import { PendingRequests } from '../components/PendingRequests';

export function AdminDashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t('admin.pageTitle')} description={t('admin.pageDescription')} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <StatisticCard key={stat.labelKey} icon={stat.icon} label={t(stat.labelKey)} value={stat.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CashFlowBreakdown sources={revenueBreakdown} />
        <BudgetExpenses categories={expenseCategories} />
      </div>

      <PendingRequests requests={pendingRequests} />

      <div className="grid gap-4 lg:grid-cols-2">
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
    </div>
  );
}

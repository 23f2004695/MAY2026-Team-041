import { BookPlus, CalendarPlus, Megaphone, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { StatisticCard } from '@/components/common';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { adminReports, adminStats, pendingRequests } from '@/mocks/admin';

import { PendingRequests } from '../components/PendingRequests';

export function AdminDashboardPage() {
  const { t } = useTranslation('admin');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <StatisticCard
            key={stat.id}
            icon={stat.icon}
            label={t(`stats.${stat.id}.label`)}
            value={stat.value}
          />
        ))}
      </div>

      <PendingRequests requests={pendingRequests} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('reports.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {adminReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{t(`reports.items.${report.id}.label`)}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => comingSoonToast(t(`reports.items.${report.id}.label`))}
                >
                  {t('reports.viewReport')}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              leadingIcon={<BookPlus className="size-4" />}
              onClick={() => comingSoonToast(t('quickActions.toast.addBook'))}
            >
              {t('quickActions.addBook')}
            </Button>
            <Button
              variant="outline"
              leadingIcon={<UserPlus className="size-4" />}
              onClick={() => comingSoonToast(t('quickActions.toast.inviteMember'))}
            >
              {t('quickActions.inviteMember')}
            </Button>
            <Button
              variant="outline"
              leadingIcon={<CalendarPlus className="size-4" />}
              onClick={() => comingSoonToast(t('quickActions.toast.createEvent'))}
            >
              {t('quickActions.createEvent')}
            </Button>
            <Button
              variant="outline"
              leadingIcon={<Megaphone className="size-4" />}
              onClick={() => comingSoonToast(t('quickActions.toast.announcement'))}
            >
              {t('quickActions.announcement')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

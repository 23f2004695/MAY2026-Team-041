import { useTranslation } from 'react-i18next';

import { MultiBarChart } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { formatMonth } from '@/lib/format';
import type { IssueResolutionMonth } from '@/providers/AuthProvider';

export function IssueResolutionChart({ months }: { months: IssueResolutionMonth[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.issueResolutionOverview.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <MultiBarChart
          stacked
          ariaLabel={t('itHead.issueResolutionOverview.title')}
          data={months.map((m) => ({
            label: formatMonth(m.month),
            values: { resolved: m.resolved, open: m.open, other: m.other },
          }))}
          series={[
            { key: 'resolved', label: t('itHead.issueResolutionOverview.resolved'), color: 'var(--color-success)' },
            { key: 'open', label: t('itHead.issueResolutionOverview.open'), color: 'var(--color-warning)' },
            { key: 'other', label: t('itHead.issueResolutionOverview.other'), color: 'var(--color-info)' },
          ]}
        />
      </CardContent>
    </Card>
  );
}

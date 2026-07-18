import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import { fineAmount, type LateReturnEntry } from '@/mocks/itHead';

export function LateReturnFines({ entries }: { entries: LateReturnEntry[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.lateFines.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{entry.bookTitle}</p>
              <p className="text-muted-foreground">
                {t('itHead.lateFines.borrowedBy', { name: entry.borrowerName })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('itHead.lateFines.dueDate', { date: entry.dueDate })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="danger">{t('itHead.lateFines.daysLate', { count: entry.daysLate })}</Badge>
              <span className="font-medium text-foreground">{fineAmount(entry.daysLate)}</span>
              <Badge variant={entry.status === 'paid' ? 'success' : 'warning'}>
                {t(`itHead.lateFines.status.${entry.status}`)}
              </Badge>
              {entry.status === 'unpaid' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    comingSoonToast(t('itHead.lateFines.reminderToast', { name: entry.borrowerName }))
                  }
                >
                  {t('itHead.lateFines.sendReminder')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

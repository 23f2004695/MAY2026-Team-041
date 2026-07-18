import { useTranslation } from 'react-i18next';

import { Badge, type BadgeVariant, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { BookRecordEntry, BookRecordType } from '@/mocks/itHead';

const typeBadgeVariant: Record<BookRecordType, BadgeVariant> = {
  lost: 'danger',
  donated: 'success',
  purchased: 'default',
};

const typeLabelKey: Record<BookRecordType, string> = {
  lost: 'itHead.bookRecords.types.lost',
  donated: 'itHead.bookRecords.types.donated',
  purchased: 'itHead.bookRecords.types.purchased',
};

export function BookRecords({ records }: { records: BookRecordEntry[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.bookRecords.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {records.map((record) => (
            <li key={record.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={typeBadgeVariant[record.type]}>{t(typeLabelKey[record.type])}</Badge>
                <span className="text-xs text-muted-foreground">{record.date}</span>
              </div>
              <p className="mt-1 font-medium text-foreground">{record.title}</p>
              <p className="text-muted-foreground">{record.detail}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

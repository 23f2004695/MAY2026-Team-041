import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { IssueCategory, IssueTicket } from '@/mocks/itHead';

const categoryLabelKey: Record<IssueCategory, string> = {
  technical: 'itHead.issueResolution.categories.technical',
  account: 'itHead.issueResolution.categories.account',
  'book-access': 'itHead.issueResolution.categories.bookAccess',
  other: 'itHead.issueResolution.categories.other',
};

export function IssueResolution({ tickets }: { tickets: IssueTicket[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.issueResolution.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t(categoryLabelKey[ticket.category])}</Badge>
              <Badge variant={ticket.status === 'open' ? 'warning' : 'success'}>
                {t(`itHead.issueResolution.status.${ticket.status}`)}
              </Badge>
              <span className="text-xs text-muted-foreground">{ticket.submittedOn}</span>
            </div>
            <p className="mt-1 text-foreground">{ticket.summary}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {t('itHead.issueResolution.from', { name: ticket.reporter })}
              </p>
              {ticket.status === 'open' && (
                <Button
                  size="sm"
                  onClick={() =>
                    comingSoonToast(t('itHead.issueResolution.resolveToast', { name: ticket.reporter }))
                  }
                >
                  {t('itHead.issueResolution.resolve')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { AuditLogEntry } from '@/mocks/admin';

function useActionText(entry: AuditLogEntry) {
  const { t } = useTranslation();
  const { key, params } = entry.action;

  switch (key) {
    case 'fineWaived':
      return t('admin.auditLog.actions.fineWaived', params);
    case 'finePolicyUpdated':
      return t('admin.auditLog.actions.finePolicyUpdated', params);
    case 'expenseApproved':
      return t('admin.auditLog.actions.expenseApproved', params);
    case 'budgetAdjusted':
      return t('admin.auditLog.actions.budgetAdjusted', params);
    case 'refundIssued':
      return t('admin.auditLog.actions.refundIssued', params);
  }
}

function useActorText(entry: AuditLogEntry) {
  const { t } = useTranslation();
  if (entry.actor.self) return t('common.you');
  return `${entry.actor.name} (${t(`auth.login.roles.${entry.actor.role}`)})`;
}

function useTimeAgoText(entry: AuditLogEntry) {
  const { t } = useTranslation();
  if ('hours' in entry.timeAgo) return t('common.time.hoursAgo', { count: entry.timeAgo.hours });
  return t('common.time.daysAgo', { count: entry.timeAgo.days });
}

function AuditLogItem({ entry }: { entry: AuditLogEntry }) {
  const actionText = useActionText(entry);
  const actorText = useActorText(entry);
  const timeAgoText = useTimeAgoText(entry);

  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <p className="text-foreground">{actionText}</p>
      <p className="text-muted-foreground">
        {actorText} · {timeAgoText}
      </p>
    </li>
  );
}

export function AuditLog({ entries }: { entries: AuditLogEntry[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.auditLog.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <AuditLogItem key={entry.id} entry={entry} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

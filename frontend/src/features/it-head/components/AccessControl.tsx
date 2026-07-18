import { useTranslation } from 'react-i18next';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { AccessEntry } from '@/mocks/itHead';

export function AccessControl({ entries }: { entries: AccessEntry[] }) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.accessControl.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{entry.name}</p>
                <Badge variant="outline">{t(`auth.login.roles.${entry.role}`)}</Badge>
                <Badge variant={entry.status === 'active' ? 'success' : 'danger'}>
                  {t(`itHead.accessControl.status.${entry.status}`)}
                </Badge>
              </div>
              <p className="text-muted-foreground">{entry.email}</p>
              {entry.pendingPermission && (
                <p className="text-xs text-muted-foreground">
                  {t('itHead.accessControl.pendingPermission', { permission: entry.pendingPermission })}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {entry.pendingPermission && (
                <Button
                  size="sm"
                  onClick={() =>
                    comingSoonToast(t('itHead.accessControl.grantToast', { name: entry.name }))
                  }
                >
                  {t('itHead.accessControl.grantAccess')}
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  comingSoonToast(
                    entry.status === 'active'
                      ? t('itHead.accessControl.deactivateToast', { name: entry.name })
                      : t('itHead.accessControl.reactivateToast', { name: entry.name }),
                  )
                }
              >
                {entry.status === 'active'
                  ? t('itHead.accessControl.deactivate')
                  : t('itHead.accessControl.reactivate')}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { useTranslation } from 'react-i18next';

import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { RegistrationRequest } from '@/mocks/manager';

export interface NewRegistrationsProps {
  requests: RegistrationRequest[];
}

// New visitors who want to sign up as members on the spot.
export function NewRegistrations({ requests }: NewRegistrationsProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.registrations.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <EmptyState
            title={t('managerDashboard.registrations.emptyTitle')}
            description={t('managerDashboard.registrations.emptyDescription')}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {requests.map((request) => (
              <li
                key={request.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{request.name}</p>
                  <p className="text-xs text-muted-foreground">{request.email}</p>
                  <p className="text-xs text-muted-foreground">{request.note}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('managerDashboard.registrations.requestedAt', { time: request.requestedAt })}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    comingSoonToast(
                      t('managerDashboard.registrations.registerToast', { name: request.name }),
                    )
                  }
                >
                  {t('managerDashboard.registrations.register')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

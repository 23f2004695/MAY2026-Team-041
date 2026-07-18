import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import type { ReadingSession } from '@/mocks/manager';

export interface ReadingSessionsCardProps {
  sessions: ReadingSession[];
}

export function ReadingSessionsCard({ sessions }: ReadingSessionsCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('managerDashboard.readingSessions.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <EmptyState
            title={t('managerDashboard.readingSessions.emptyTitle')}
            description={t('managerDashboard.readingSessions.emptyDescription')}
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{session.title}</p>
                  <p className="text-muted-foreground">
                    {t('managerDashboard.readingSessions.ledBy', {
                      date: session.date,
                      facilitator: session.facilitator,
                    })}
                  </p>
                </div>
                <span className="text-muted-foreground">
                  {t('managerDashboard.readingSessions.joined', { count: session.participants })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle, EmptyState } from '@/components/ui';
import type { ReadingSession } from '@/mocks/manager';

export interface ReadingSessionsCardProps {
  sessions: ReadingSession[];
}

export function ReadingSessionsCard({ sessions }: ReadingSessionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <EmptyState
            title="No sessions scheduled"
            description="Create one to get started."
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
                    {session.date} · led by {session.facilitator}
                  </p>
                </div>
                <span className="text-muted-foreground">{session.participants} joined</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

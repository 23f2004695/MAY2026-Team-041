import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { AuditLogEntry } from '@/mocks/admin';

export function AuditLog({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-border p-3 text-sm">
              <p className="text-foreground">{entry.action}</p>
              <p className="text-muted-foreground">
                {entry.actor} · {entry.timestamp}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

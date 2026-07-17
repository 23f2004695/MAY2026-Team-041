import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { comingSoonToast } from '@/lib/comingSoonToast';
import type { RoleCount } from '@/mocks/admin';

export function RolesPermissions({ roles }: { roles: RoleCount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & Permissions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {roles.map((entry) => (
          <div
            key={entry.role}
            className="flex flex-col gap-2 rounded-lg border border-border p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{entry.role}</p>
              <p className="text-muted-foreground">{entry.count.toLocaleString()} users</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => comingSoonToast(`Managing ${entry.role} permissions`)}
            >
              Manage
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

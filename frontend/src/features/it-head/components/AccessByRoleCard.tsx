import { useTranslation } from 'react-i18next';

import { MultiSegmentDonut } from '@/components/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { RoleBreakdownEntry } from '@/providers/AuthProvider';

// Fixed, not derived — a role missing from the payload (e.g. no guardians yet) still
// gets a stable color if it shows up later, rather than shifting every other role's
// color around as the set of roles present happens to change.
const ROLE_COLORS: Record<string, string> = {
  member: 'var(--color-primary)',
  guardian: 'var(--color-info)',
  manager: 'var(--color-success)',
  librarian: 'var(--color-warning)',
  'it-head': 'var(--color-ink)',
  admin: 'var(--color-danger)',
};

export function AccessByRoleCard({ roles }: { roles: RoleBreakdownEntry[] }) {
  const { t } = useTranslation();
  const total = roles.reduce((sum, r) => sum + r.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('itHead.accessByRole.title')}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {t('itHead.accessByRole.totalMembers', { count: total })}
        </p>
      </CardHeader>
      <CardContent>
        <MultiSegmentDonut
          centerValue={String(total)}
          centerLabel={t('itHead.accessByRole.total')}
          segments={roles.map((r) => ({
            key: r.role,
            label: t(`itHead.accessByRole.roles.${r.role}`, { defaultValue: r.role }),
            value: r.count,
            color: ROLE_COLORS[r.role] ?? 'var(--color-secondary)',
          }))}
        />
      </CardContent>
    </Card>
  );
}

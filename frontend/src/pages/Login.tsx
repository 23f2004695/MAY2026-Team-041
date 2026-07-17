import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui';
import { useAuth, type Role } from '@/providers/AuthProvider';

const ROLES: Role[] = ['admin', 'librarian', 'member', 'manager'];

// ponytail: no real auth form yet (Milestone 3); this mock role-switcher exists only to
// demonstrate the ProtectedRoute/RoleRoute guards until a real login form lands.
// Redirecting is left entirely to PublicRoute (guards.tsx) reacting to the auth-state
// change — navigating here too would race PublicRoute's own redirect.
export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();

  function signInAs(role: Role) {
    login(role);
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{t('auth.login.title')}</h1>
        <p className="text-muted-foreground">{t('auth.login.subtitle')}</p>
      </div>
      {ROLES.map((role) => (
        <Button
          key={role}
          variant="outline"
          className="justify-start capitalize"
          onClick={() => signInAs(role)}
        >
          {t('auth.login.continueAs', { role: t(`auth.login.roles.${role}`) })}
        </Button>
      ))}
    </div>
  );
}

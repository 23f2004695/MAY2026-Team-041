import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth, type Role } from '@/providers/AuthProvider';

const ROLES: Role[] = ['admin', 'librarian', 'member', 'volunteer'];

// ponytail: no real auth form yet (Milestone 3); this mock role-switcher exists only to
// demonstrate the ProtectedRoute/RoleRoute guards until a real login form lands.
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  function signInAs(role: Role) {
    login(role);
    navigate(role === 'admin' ? ROUTES.ADMIN : ROUTES.DASHBOARD);
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Log in</h1>
        <p className="text-muted-foreground">
          Real authentication ships in Milestone 3. Pick a role to preview the app.
        </p>
      </div>
      {ROLES.map((role) => (
        <Button
          key={role}
          variant="outline"
          className="justify-start capitalize"
          onClick={() => signInAs(role)}
        >
          Continue as {role}
        </Button>
      ))}
    </div>
  );
}

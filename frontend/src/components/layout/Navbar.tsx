import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      <Link to={ROUTES.HOME} className="text-lg font-semibold text-foreground">
        Community Reading Club
      </Link>
      <Button onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Button>
    </header>
  );
}

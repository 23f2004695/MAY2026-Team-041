import { BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui';

import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          Community Reading Club
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Button>
        </div>
      </div>
    </header>
  );
}

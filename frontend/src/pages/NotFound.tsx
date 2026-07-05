import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-semibold text-foreground">404</h1>
      <p className="text-muted-foreground">This page doesn&apos;t exist.</p>
      <Button onClick={() => navigate(ROUTES.HOME)}>Back home</Button>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Badge, Button, Drawer } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/providers/AuthProvider';

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  function goTo(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open account menu"
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Avatar name={role ?? undefined} size="sm" />
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} title="Account">
        <div className="flex flex-col gap-4">
          {role && (
            <Badge variant="outline" className="w-fit capitalize">
              {role}
            </Badge>
          )}
          <Button variant="ghost" className="justify-start" onClick={() => goTo(ROUTES.PROFILE)}>
            Profile
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => goTo(ROUTES.SETTINGS)}>
            Settings
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              logout();
              goTo(ROUTES.HOME);
            }}
          >
            Log out
          </Button>
        </div>
      </Drawer>
    </>
  );
}

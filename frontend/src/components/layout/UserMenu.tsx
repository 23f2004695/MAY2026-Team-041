import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Avatar, Badge, Button, Drawer } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/providers/AuthProvider';

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  function goTo(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('aria.openAccountMenu')}
        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Avatar name={role ?? undefined} size="sm" />
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} title={t('aria.account')}>
        <div className="flex flex-col gap-4">
          {role && (
            <Badge variant="outline" className="w-fit capitalize">
              {role}
            </Badge>
          )}
          <Button variant="ghost" className="justify-start" onClick={() => goTo(ROUTES.PROFILE)}>
            {t('actions.profile')}
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => goTo(ROUTES.SETTINGS)}>
            {t('actions.settings')}
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => {
              logout();
              goTo(ROUTES.HOME);
            }}
          >
            {t('actions.logOut')}
          </Button>
        </div>
      </Drawer>
    </>
  );
}

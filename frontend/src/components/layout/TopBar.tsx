import { useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Drawer, Modal } from '@/components/ui';
import type { NavItem } from '@/constants/navigation';
import { NotificationsPanel } from '@/features/notifications/components/NotificationsPanel';

import { LanguageSwitcher } from './LanguageSwitcher';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

export interface TopBarProps {
  items: NavItem[];
}

export function TopBar({ items }: TopBarProps) {
  const { t } = useTranslation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between gap-1 border-b border-border bg-surface px-4">
      <Button
        variant="ghost"
        size="sm"
        className="size-10 p-0 md:hidden"
        aria-label={t('topBar.openNavigation')}
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        className="size-10 p-0"
        aria-label={t('notifications.pageTitle')}
        onClick={() => setNotificationsOpen(true)}
      >
        <Bell className="size-5" />
      </Button>
      <LanguageSwitcher className="text-muted-foreground" />
      <ThemeToggle />
      <UserMenu />

      <Modal
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title={t('notifications.pageTitle')}
        className="max-w-lg"
      >
        <NotificationsPanel />
      </Modal>

      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title={t('topBar.menu')}
        side="left"
      >
        <Sidebar items={items} />
      </Drawer>
    </header>
  );
}

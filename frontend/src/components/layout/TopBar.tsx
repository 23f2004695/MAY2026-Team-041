import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Drawer } from '@/components/ui';
import type { NavItem } from '@/constants/navigation';

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

      <LanguageSwitcher className="text-muted-foreground" />
      <ThemeToggle />
      <UserMenu />

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

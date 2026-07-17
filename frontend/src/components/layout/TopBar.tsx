import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button, Drawer } from '@/components/ui';
import type { NavItem } from '@/constants/navigation';

import { AppearanceButton } from './AppearanceButton';
import { LanguageSelector } from './LanguageSelector';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

export interface TopBarProps {
  items: NavItem[];
}

export function TopBar({ items }: TopBarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useTranslation('common');

  return (
    <header className="flex h-16 items-center justify-between gap-1 border-b border-border bg-surface px-4">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        aria-label={t('aria.openNavigation')}
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex-1" />

      <LanguageSelector />
      <AppearanceButton />
      <ThemeToggle />
      <UserMenu />

      <Drawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title={t('aria.menu')}
        side="left"
      >
        <Sidebar items={items} onNavigate={() => setMobileNavOpen(false)} />
      </Drawer>
    </header>
  );
}

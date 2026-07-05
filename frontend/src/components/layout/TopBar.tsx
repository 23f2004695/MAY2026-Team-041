import { useState } from 'react';
import { Menu } from 'lucide-react';

import { Button, Drawer } from '@/components/ui';
import type { NavItem } from '@/constants/navigation';

import { Sidebar } from './Sidebar';
import { UserMenu } from './UserMenu';

export interface TopBarProps {
  items: NavItem[];
}

export function TopBar({ items }: TopBarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4">
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex-1" />

      <UserMenu />

      <Drawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} title="Menu" side="left">
        <Sidebar items={items} />
      </Drawer>
    </header>
  );
}

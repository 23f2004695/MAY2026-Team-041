import { Outlet } from 'react-router-dom';

import { Sidebar, TopBar } from '@/components/layout';
import type { NavItem } from '@/constants/navigation';

export interface AppShellLayoutProps {
  items: NavItem[];
}

export function AppShellLayout({ items }: AppShellLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-e border-border bg-surface md:block">
        <Sidebar items={items} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar items={items} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

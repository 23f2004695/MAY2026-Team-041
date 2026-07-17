import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { cn } from '@/lib/cn';
import type { NavItem } from '@/constants/navigation';

export interface SidebarProps {
  items: NavItem[];
  onNavigate?: () => void;
}

export function Sidebar({ items, onNavigate }: SidebarProps) {
  const { t } = useTranslation('common');
  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ labelKey, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground',
              isActive && 'bg-secondary text-foreground',
            )
          }
        >
          <Icon className="size-4" />
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  );
}

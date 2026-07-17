import { adminOverviewNavItem, userNavigation } from '@/constants/navigation';
import { useAuth } from '@/providers/AuthProvider';

import { AppShellLayout } from './AppShellLayout';

export function UserLayout() {
  const { role } = useAuth();
  const items = role === 'admin' ? [...userNavigation, adminOverviewNavItem] : userNavigation;

  return <AppShellLayout items={items} />;
}

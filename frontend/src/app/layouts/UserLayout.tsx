import {
  adminOverviewNavItem,
  guardianOverviewNavItem,
  itHeadOverviewNavItem,
  userNavigation,
  type NavItem,
} from '@/constants/navigation';
import { useAuth, type Role } from '@/providers/AuthProvider';

import { AppShellLayout } from './AppShellLayout';

// Roles with their own dedicated dashboard (Admin/IT Head/Guardian) still get a link back
// to it if they navigate to the shared /dashboard, mirroring adminOverviewNavItem's role.
const overviewNavItemByRole: Partial<Record<Role, NavItem>> = {
  admin: adminOverviewNavItem,
  'it-head': itHeadOverviewNavItem,
  guardian: guardianOverviewNavItem,
};

export function UserLayout() {
  const { role } = useAuth();
  const overviewNavItem = role ? overviewNavItemByRole[role] : undefined;
  const items = overviewNavItem ? [...userNavigation, overviewNavItem] : userNavigation;

  return <AppShellLayout items={items} />;
}

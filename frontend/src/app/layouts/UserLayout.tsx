import { userNavigation } from '@/constants/navigation';

import { AppShellLayout } from './AppShellLayout';

export function UserLayout() {
  return <AppShellLayout items={userNavigation} />;
}

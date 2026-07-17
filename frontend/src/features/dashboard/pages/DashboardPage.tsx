import { useAuth } from '@/providers/AuthProvider';

import { LibrarianDashboard } from './LibrarianDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { MemberDashboard } from './MemberDashboard';

export function DashboardPage() {
  const { role } = useAuth();

  if (role === 'librarian') return <LibrarianDashboard />;
  if (role === 'manager') return <ManagerDashboard />;
  return <MemberDashboard />;
}

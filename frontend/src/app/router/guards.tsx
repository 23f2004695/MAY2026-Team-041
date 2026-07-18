import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useAuth, type Role } from '@/providers/AuthProvider';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

const roleHome: Partial<Record<Role, string>> = {
  admin: ROUTES.ADMIN,
  'it-head': ROUTES.IT_HEAD,
  guardian: ROUTES.GUARDIAN,
};

export function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return children;
  return <Navigate to={(role && roleHome[role]) ?? ROUTES.DASHBOARD} replace />;
}

export function RoleRoute({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (!role || !allow.includes(role)) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
}

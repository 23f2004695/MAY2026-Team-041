import { createContext, useContext, type ReactNode } from 'react';

import { useLocalStorageState } from '@/lib/useLocalStorageState';

export type Role = 'admin' | 'librarian' | 'member' | 'manager' | 'it-head' | 'guardian';

interface MockAuthState {
  isAuthenticated: boolean;
  role: Role | null;
}

interface AuthContextValue extends MockAuthState {
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SIGNED_OUT: MockAuthState = { isAuthenticated: false, role: null };

// ponytail: no backend yet, auth state is a mocked localStorage flag until Milestone 3 wires real JWT auth.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorageState<MockAuthState>('mock-auth', SIGNED_OUT);

  function login(role: Role) {
    setState({ isAuthenticated: true, role });
  }

  function logout() {
    setState(SIGNED_OUT);
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

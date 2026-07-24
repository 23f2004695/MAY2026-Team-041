/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, type ReactNode } from 'react';

import { apiGet, apiPatch, apiPost, apiPut, type TokenResponse } from '@/lib/api';
import { useLocalStorageState } from '@/lib/useLocalStorageState';

export type Role = 'admin' | 'member' | 'manager' | 'it-head' | 'guardian' | 'librarian';

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface CompleteProfilePayload {
  full_name: string;
  phone: string;
  password: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  phone?: string;
  password?: string;
  avatar_url?: string;
}

export interface PaymentPayload {
  amount: number;
  label: string;
  plan_months?: number;
}

export interface Membership {
  plan_label: string;
  purchased_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface ReadingProgressEntry {
  id: string;
  book_id: string;
  book_title: string;
  status: 'reading' | 'completed';
  percent_complete: number;
  updated_at: string;
}

export interface GuardianChild {
  id: string;
  full_name: string;
  email: string;
  currently_reading: ReadingProgressEntry[];
  completed: ReadingProgressEntry[];
}

export interface ReadingGoalPayload {
  yearly_goal: number;
  monthly_goal: number;
}

export interface ReadingGoal {
  yearly_goal: number;
  monthly_goal: number;
  books_completed_this_year: number;
  books_completed_this_month: number;
  updated_at: string;
}

export interface ReadingStreak {
  current_streak_days: number;
  longest_streak_days: number;
}

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  token: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  /** True right after a first-time Google sign-in, until completeProfile() runs. */
  needsProfileCompletion: boolean;
  /**
   * Set right after registerAccount() so PublicRoute's auth-state redirect (see Login.tsx's
   * comment on that race) sends the new user to Payment instead of its usual role home.
   */
  postAuthRedirect: string | null;
}

interface AuthContextValue extends AuthState {
  /** ponytail: dev-only role preview, bypasses real auth — drop the buttons using this before production. */
  login: (role: Role) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  loginWithGoogleToken: (idToken: string) => Promise<void>;
  registerAccount: (payload: RegisterPayload, postAuthRedirect: string) => Promise<void>;
  completeProfile: (payload: CompleteProfilePayload) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  createPayment: (payload: PaymentPayload) => Promise<void>;
  getMembership: () => Promise<Membership | null>;
  getGuardianChildren: () => Promise<GuardianChild[]>;
  getMyReadingProgress: () => Promise<ReadingProgressEntry[]>;
  getReadingGoal: () => Promise<ReadingGoal | null>;
  setReadingGoal: (payload: ReadingGoalPayload) => Promise<ReadingGoal>;
  getReadingStreak: () => Promise<ReadingStreak>;
  clearPostAuthRedirect: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SIGNED_OUT: AuthState = {
  isAuthenticated: false,
  role: null,
  token: null,
  fullName: null,
  email: null,
  phone: null,
  avatarUrl: null,
  needsProfileCompletion: false,
  postAuthRedirect: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorageState<AuthState>('mock-auth', SIGNED_OUT);

  function login(role: Role) {
    setState({ ...SIGNED_OUT, isAuthenticated: true, role });
  }

  function applySession(
    data: TokenResponse,
    needsProfileCompletion = false,
    postAuthRedirect: string | null = null,
  ) {
    setState({
      isAuthenticated: true,
      role: data.user.role.name as Role,
      token: data.access_token,
      fullName: data.user.full_name,
      email: data.user.email,
      phone: data.user.phone,
      avatarUrl: data.user.avatar_url,
      needsProfileCompletion,
      postAuthRedirect,
    });
  }

  function clearPostAuthRedirect() {
    setState({ ...state, postAuthRedirect: null });
  }

  async function loginWithCredentials(email: string, password: string) {
    applySession(await apiPost<TokenResponse>('/auth/login', { email, password }));
  }

  async function loginWithGoogleToken(idToken: string) {
    const data = await apiPost<TokenResponse>('/auth/google', { id_token: idToken });
    applySession(data, data.is_new_user);
  }

  async function registerAccount(payload: RegisterPayload, postAuthRedirect: string) {
    applySession(await apiPost<TokenResponse>('/auth/register', payload), false, postAuthRedirect);
  }

  async function completeProfile(payload: CompleteProfilePayload) {
    if (!state.token) throw new Error('Not authenticated');
    applySession(await apiPatch<TokenResponse>('/auth/me', payload, state.token));
  }

  async function updateProfile(payload: UpdateProfilePayload) {
    if (!state.token) throw new Error('Not authenticated');
    applySession(
      await apiPatch<TokenResponse>('/auth/me', payload, state.token),
      state.needsProfileCompletion,
    );
  }

  async function createPayment(payload: PaymentPayload) {
    if (!state.token) throw new Error('Not authenticated');
    await apiPost('/payments', payload, state.token);
  }

  async function getMembership(): Promise<Membership | null> {
    if (!state.token) return null;
    return apiGet<Membership | null>('/payments/me/membership', state.token);
  }

  async function getGuardianChildren(): Promise<GuardianChild[]> {
    if (!state.token) return [];
    return apiGet<GuardianChild[]>('/guardian/children', state.token);
  }

  async function getMyReadingProgress(): Promise<ReadingProgressEntry[]> {
    if (!state.token) return [];
    return apiGet<ReadingProgressEntry[]>('/members/me/reading-progress', state.token);
  }

  async function getReadingGoal(): Promise<ReadingGoal | null> {
    if (!state.token) return null;
    return apiGet<ReadingGoal | null>('/members/me/reading-goal', state.token);
  }

  async function setReadingGoal(payload: ReadingGoalPayload): Promise<ReadingGoal> {
    if (!state.token) throw new Error('Not authenticated');
    return apiPut<ReadingGoal>('/members/me/reading-goal', payload, state.token);
  }

  async function getReadingStreak(): Promise<ReadingStreak> {
    if (!state.token) return { current_streak_days: 0, longest_streak_days: 0 };
    return apiGet<ReadingStreak>('/members/me/reading-streak', state.token);
  }

  function logout() {
    setState(SIGNED_OUT);
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginWithCredentials,
        loginWithGoogleToken,
        registerAccount,
        completeProfile,
        updateProfile,
        createPayment,
        getMembership,
        getGuardianChildren,
        getMyReadingProgress,
        getReadingGoal,
        setReadingGoal,
        getReadingStreak,
        clearPostAuthRedirect,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

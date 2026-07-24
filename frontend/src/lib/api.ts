const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const API_PREFIX = import.meta.env.VITE_API_PREFIX ?? '/api/v1';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: { id: string; name: string };
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
  is_new_user: boolean;
}

async function apiRequest<T>(
  method: string,
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${API_PREFIX}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new ApiError(response.status, detail?.detail ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, token?: string): Promise<T> {
  return apiRequest<T>('GET', path, undefined, token);
}

export function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  return apiRequest<T>('POST', path, body, token);
}

export function apiPatch<T>(path: string, body: unknown, token: string): Promise<T> {
  return apiRequest<T>('PATCH', path, body, token);
}

export function apiPut<T>(path: string, body: unknown, token: string): Promise<T> {
  return apiRequest<T>('PUT', path, body, token);
}

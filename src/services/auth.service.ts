import { apiFetch } from './api.service';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string | null;
  birthDate: string | null;
  gender: string | null;
  city: string | null;
  document: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

const SESSION_KEY = 'concertix_auth_session';

const persistSession = (session: AuthSession) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const getSession = (): AuthSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

const getUserFullName = (user: AuthUser): string =>
  `${user.firstName} ${user.lastName}`.trim();

const login = async (payload: { email: string; password: string }): Promise<AuthSession> => {
  const res = await apiFetch<{ accessToken: string; refreshToken: string; user: AuthUser }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email: payload.email, password: payload.password }) }
  );
  return { user: res.user, token: res.accessToken, refreshToken: res.refreshToken };
};

const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthSession> => {
  const res = await apiFetch<{ accessToken: string; refreshToken: string; user: AuthUser }>(
    '/auth/register',
    { method: 'POST', body: JSON.stringify(payload) }
  );
  return { user: res.user, token: res.accessToken, refreshToken: res.refreshToken };
};

export const authService = {
  login,
  register,
  persistSession,
  getSession,
  clearSession,
  getUserFullName,
};

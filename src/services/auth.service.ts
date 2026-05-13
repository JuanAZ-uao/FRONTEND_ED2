import { wait } from './api.service';

export interface AuthPayload {
  fullName?: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: {
    fullName: string;
    email: string;
  };
  token: string;
}

const SESSION_STORAGE_KEY = 'concertix_auth_session';

const persistSession = (session: AuthSession) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const getSession = (): AuthSession | null => {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

const login = async (payload: AuthPayload): Promise<AuthSession> => {
  await wait();

  if (!payload.email || !payload.password) {
    throw new Error('Email y password son obligatorios');
  }

  return {
    user: {
      fullName: 'Samuel Rios',
      email: payload.email,
    },
    token: 'mock-token-frontend',
  };
};

const register = async (payload: AuthPayload): Promise<AuthSession> => {
  await wait();

  if (!payload.fullName || !payload.email || !payload.password) {
    throw new Error('Todos los campos son obligatorios para registro');
  }

  return {
    user: {
      fullName: payload.fullName,
      email: payload.email,
    },
    token: 'mock-token-frontend',
  };
};

export const authService = {
  login,
  register,
  persistSession,
  getSession,
  clearSession,
};

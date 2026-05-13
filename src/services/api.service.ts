const SESSION_KEY = 'concertix_auth_session';
const BASE_URL = `http://${window.location.hostname}:3000/api`;

export const wait = (ms = 240) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as { token?: string }).token ?? null;
  } catch { return null; }
};

const getRefreshToken = (): string | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as { refreshToken?: string }).refreshToken ?? null;
  } catch { return null; }
};

const patchSessionToken = (newToken: string): void => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw) as Record<string, unknown>;
    session.token = newToken;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch { /* ignore */ }
};

const buildHeaders = (token: string | null, extra?: HeadersInit): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(extra as Record<string, string> ?? {}),
});

export const apiFetch = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(token, options?.headers),
  });

  // Auth endpoints returning 401 means bad credentials, not expired token — skip refresh
  const isAuthEndpoint = path.startsWith('/auth/');

  if (res.status === 401 && !isAuthEndpoint) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json() as { accessToken: string };
        patchSessionToken(data.accessToken);
        const retry = await fetch(`${BASE_URL}${path}`, {
          ...options,
          headers: buildHeaders(data.accessToken, options?.headers),
        });
        if (retry.ok) return retry.json() as Promise<T>;
        const retryErr = await retry.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error((retryErr as { message?: string }).message ?? 'Error en la solicitud');
      }
    }
    localStorage.removeItem(SESSION_KEY);
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error((error as { message?: string }).message ?? 'Error en la solicitud');
  }
  return res.json() as Promise<T>;
};

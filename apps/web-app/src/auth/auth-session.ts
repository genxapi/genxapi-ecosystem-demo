import {
  AUTH_SESSION_STORAGE_KEY,
  type AuthSession,
} from '@genxapi-labs/ecosystem-auth-client';

export interface AuthSessionState {
  session: AuthSession | null;
  user: AuthSession['user'] | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isCustomer: boolean;
}

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isAuthSession = (value: unknown): value is AuthSession => {
  if (!isObject(value) || !isObject(value.user)) {
    return false;
  }

  return (
    typeof value.accessToken === 'string' &&
    value.tokenType === 'Bearer' &&
    typeof value.expiresIn === 'number' &&
    typeof value.user.id === 'number' &&
    typeof value.user.email === 'string' &&
    typeof value.user.name === 'string' &&
    typeof value.user.role === 'string'
  );
};

export const toAuthSessionState = (session: AuthSession | null): AuthSessionState => ({
  session,
  user: session?.user ?? null,
  accessToken: session?.accessToken ?? null,
  isAuthenticated: session !== null,
  isCustomer: session?.user.role === 'customer',
});

export const loadStoredAuthSession = (): AuthSession | null => {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown;
    return isAuthSession(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

export const loadAuthSessionState = (): AuthSessionState =>
  toAuthSessionState(loadStoredAuthSession());

export const persistAuthSession = (session: AuthSession | null) => {
  if (!canUseStorage()) {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const getCurrentAuthAccessToken = () => loadStoredAuthSession()?.accessToken ?? null;

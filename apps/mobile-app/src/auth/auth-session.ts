import type { AuthSession } from '@genxapi/ecosystem-auth-client';

export interface AuthSessionState {
  session: AuthSession | null;
  user: AuthSession['user'] | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isCustomer: boolean;
}

export const toAuthSessionState = (session: AuthSession | null): AuthSessionState => ({
  session,
  user: session?.user ?? null,
  accessToken: session?.accessToken ?? null,
  isAuthenticated: session !== null,
  isCustomer: session?.user.role === 'customer',
});

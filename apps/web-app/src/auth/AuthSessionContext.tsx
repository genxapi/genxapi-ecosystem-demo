import type { LoginCredentials } from '@genxapi/ecosystem-auth-client';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { queryClient } from '../query-client';
import { getErrorMessage } from '../utils/format';
import { authClient } from './client';
import {
  loadAuthSessionState,
  persistAuthSession,
  toAuthSessionState,
  type AuthSessionState,
} from './auth-session';

interface AuthSessionContextValue extends AuthSessionState {
  isPending: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signOut: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(loadAuthSessionState);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      ...session,
      isPending,
      error,
      login: async (credentials) => {
        setIsPending(true);
        setError(null);

        try {
          const nextSession = await authClient.login(credentials);
          persistAuthSession(nextSession);
          queryClient.clear();
          setSession(toAuthSessionState(nextSession));
          return true;
        } catch (nextError) {
          setError(getErrorMessage(nextError));
          return false;
        } finally {
          setIsPending(false);
        }
      },
      signOut: () => {
        persistAuthSession(null);
        queryClient.clear();
        setError(null);
        setSession(toAuthSessionState(null));
      },
    }),
    [session, isPending, error]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
};

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthSession must be used within AuthSessionProvider.');
  }

  return context;
};

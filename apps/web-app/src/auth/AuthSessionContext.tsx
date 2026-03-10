import type { LoginCredentials } from '@genxapi/ecosystem-auth-client';
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { queryClient } from '../query-client';
import { getErrorMessage } from '../utils/format';
import { authClient } from './client';
import { demoPersonas, type DemoPersona } from './demo-personas';
import {
  loadAuthSessionState,
  persistAuthSession,
  toAuthSessionState,
  type AuthSessionState,
} from './auth-session';

interface AuthSessionContextValue extends AuthSessionState {
  isPending: boolean;
  error: string | null;
  demoPersonas: DemoPersona[];
  signInAsDemoPersona: (personaId: DemoPersona['id']) => Promise<boolean>;
  signOut: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(loadAuthSessionState);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithCredentials = async (credentials: LoginCredentials) => {
    setIsPending(true);
    setError(null);

    try {
      const nextSession = await authClient.login(credentials);

      if (nextSession.user.role !== 'customer') {
        throw new Error('This customer app only supports customer demo personas.');
      }

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
  };

  const value: AuthSessionContextValue = {
    ...session,
    isPending,
    error,
    demoPersonas,
    signInAsDemoPersona: async (personaId) => {
      const persona = demoPersonas.find((entry) => entry.id === personaId);

      if (!persona) {
        setError('Unknown demo persona.');
        return false;
      }

      return loginWithCredentials({
        email: persona.email,
        password: persona.password,
      });
    },
    signOut: () => {
      persistAuthSession(null);
      queryClient.clear();
      setError(null);
      setSession(toAuthSessionState(null));
    },
  };

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
};

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthSession must be used within AuthSessionProvider.');
  }

  return context;
};

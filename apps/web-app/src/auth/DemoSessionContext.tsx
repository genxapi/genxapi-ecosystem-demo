import {
  DEMO_PERSONAS,
  type DemoPersona,
  type DemoPersonaId,
} from '@genxapi/ecosystem-demo-runtime';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  loadDemoSessionState,
  persistDemoPersonaId,
  type DemoSessionState,
} from './demo-session';

interface DemoSessionContextValue extends DemoSessionState {
  personas: readonly DemoPersona[];
  setPersonaId: (personaId: DemoPersonaId | null) => void;
  signOut: () => void;
  isInternalViewer: boolean;
}

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

export const DemoSessionProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(loadDemoSessionState);

  const value = useMemo<DemoSessionContextValue>(
    () => ({
      ...session,
      personas: DEMO_PERSONAS,
      setPersonaId: (personaId) => {
        persistDemoPersonaId(personaId);
        setSession(loadDemoSessionState());
      },
      signOut: () => {
        persistDemoPersonaId(null);
        setSession(loadDemoSessionState());
      },
      isInternalViewer:
        session.persona?.role === 'support' || session.persona?.role === 'admin',
    }),
    [session]
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
};

export const useDemoSession = () => {
  const context = useContext(DemoSessionContext);

  if (!context) {
    throw new Error('useDemoSession must be used within DemoSessionProvider.');
  }

  return context;
};

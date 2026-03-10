import {
  DEFAULT_WEB_DEMO_PERSONA_ID,
  DEMO_SESSION_STORAGE_KEY,
  getDemoPersona,
  type DemoPersona,
  type DemoPersonaId,
} from '@genxapi/ecosystem-demo-runtime';

export interface DemoSessionState {
  personaId: DemoPersonaId | null;
  persona: DemoPersona | null;
  token: string | null;
  isAuthenticated: boolean;
}

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const toSessionState = (personaId: DemoPersonaId | null): DemoSessionState => {
  const persona = personaId ? getDemoPersona(personaId) : null;

  return {
    personaId,
    persona,
    token: persona?.token ?? null,
    isAuthenticated: persona !== null,
  };
};

export const getStoredDemoPersonaId = (): DemoPersonaId | null => {
  if (!canUseStorage()) {
    return DEFAULT_WEB_DEMO_PERSONA_ID;
  }

  const rawValue = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return DEFAULT_WEB_DEMO_PERSONA_ID;
  }

  return (getDemoPersona(rawValue)?.id ?? null) as DemoPersonaId | null;
};

export const loadDemoSessionState = (): DemoSessionState =>
  toSessionState(getStoredDemoPersonaId());

export const persistDemoPersonaId = (personaId: DemoPersonaId | null) => {
  if (!canUseStorage()) {
    return;
  }

  if (!personaId) {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, personaId);
};

export const getCurrentDemoAccessToken = () => loadDemoSessionState().token;

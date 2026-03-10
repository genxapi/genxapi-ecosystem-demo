import {
  DEFAULT_MOBILE_DEMO_PERSONA_ID,
  createDemoSdkRuntimeConfig,
  getDemoPersona,
} from '@genxapi/ecosystem-demo-runtime';

type ProcessEnvShape = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

function readExpoPublicEnv(name: string): string {
  const env = (globalThis as ProcessEnvShape).process?.env;
  return env?.[name] ?? '';
}

const persona = getDemoPersona(DEFAULT_MOBILE_DEMO_PERSONA_ID);

if (!persona) {
  throw new Error(`Missing default mobile persona: ${DEFAULT_MOBILE_DEMO_PERSONA_ID}`);
}

export const mobileDemoPersona = persona;

export const mobileSdkRuntime = createDemoSdkRuntimeConfig({
  usersServiceBaseUrl: readExpoPublicEnv('EXPO_PUBLIC_USERS_SERVICE_BASE_URL'),
  paymentsServiceBaseUrl: readExpoPublicEnv('EXPO_PUBLIC_PAYMENTS_SERVICE_BASE_URL'),
  accessToken: () => mobileDemoPersona.token,
});

export const mobileRuntimeWarnings = [
  !mobileSdkRuntime.users.baseUrl ? 'Set EXPO_PUBLIC_USERS_SERVICE_BASE_URL for the users service.' : '',
  !mobileSdkRuntime.payments.baseUrl
    ? 'Set EXPO_PUBLIC_PAYMENTS_SERVICE_BASE_URL for the payments service.'
    : '',
].filter(Boolean);

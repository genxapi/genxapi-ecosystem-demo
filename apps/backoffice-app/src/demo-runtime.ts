import {
  DEFAULT_BACKOFFICE_DEMO_PERSONA_ID,
  createDemoSdkRuntimeConfig,
  getDemoPersona,
} from '@genxapi/ecosystem-demo-runtime';

const persona = getDemoPersona(DEFAULT_BACKOFFICE_DEMO_PERSONA_ID);

if (!persona) {
  throw new Error(`Missing default backoffice persona: ${DEFAULT_BACKOFFICE_DEMO_PERSONA_ID}`);
}

export const backofficeDemoPersona = persona;

export const backofficeSdkRuntime = createDemoSdkRuntimeConfig({
  usersServiceBaseUrl: import.meta.env.VITE_USERS_SERVICE_BASE_URL ?? '/api/users-service',
  paymentsServiceBaseUrl: import.meta.env.VITE_PAYMENTS_SERVICE_BASE_URL ?? '/api/payments-service',
  accessToken: () => backofficeDemoPersona.token,
});

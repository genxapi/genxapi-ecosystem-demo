import { createAuthClient } from '@genxapi/ecosystem-auth-client';

export const authServiceBaseUrl =
  import.meta.env.VITE_AUTH_SERVICE_BASE_URL ?? '/api/auth-service';

export const authClient = createAuthClient({
  baseUrl: authServiceBaseUrl,
});

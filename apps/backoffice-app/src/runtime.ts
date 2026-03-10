import { createAuthClient } from '@genxapi/ecosystem-auth-client';
import { createUsersSdk } from '@genxapi/ecosystem-users-sdk';
import { createPaymentsSdk } from 'genxapi-ecosystem-payments-sdk';

type AccessTokenProvider =
  | string
  | null
  | undefined
  | (() => string | null | undefined | Promise<string | null | undefined>);

export const backofficeAuthServiceBaseUrl =
  import.meta.env.VITE_AUTH_SERVICE_BASE_URL ?? '/api/auth-service';
export const backofficeUsersServiceBaseUrl =
  import.meta.env.VITE_USERS_SERVICE_BASE_URL ?? '/api/users-service';
export const backofficePaymentsServiceBaseUrl =
  import.meta.env.VITE_PAYMENTS_SERVICE_BASE_URL ?? '/api/payments-service';

export const backofficeAuthClient = createAuthClient({
  baseUrl: backofficeAuthServiceBaseUrl,
});

export const createBackofficeSdks = (accessToken: AccessTokenProvider) => ({
  users: createUsersSdk({
    baseUrl: backofficeUsersServiceBaseUrl,
    accessToken,
  }),
  payments: createPaymentsSdk({
    baseUrl: backofficePaymentsServiceBaseUrl,
    accessToken,
  }),
});

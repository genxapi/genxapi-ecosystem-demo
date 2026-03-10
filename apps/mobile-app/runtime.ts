import { createAuthClient } from '@genxapi/ecosystem-auth-client';
import { createUsersSdk } from '@genxapi/ecosystem-users-sdk';
import { createPaymentsSdk } from 'genxapi-ecosystem-payments-sdk';

type AccessTokenProvider =
  | string
  | null
  | undefined
  | (() => string | null | undefined | Promise<string | null | undefined>);

type ProcessEnvShape = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const readExpoPublicEnv = (name: string) => (globalThis as ProcessEnvShape).process?.env?.[name] ?? '';

export const mobileAuthServiceBaseUrl = readExpoPublicEnv('EXPO_PUBLIC_AUTH_SERVICE_BASE_URL');
export const mobileUsersServiceBaseUrl = readExpoPublicEnv('EXPO_PUBLIC_USERS_SERVICE_BASE_URL');
export const mobilePaymentsServiceBaseUrl = readExpoPublicEnv('EXPO_PUBLIC_PAYMENTS_SERVICE_BASE_URL');

export const mobileAuthClient = createAuthClient({
  baseUrl: mobileAuthServiceBaseUrl,
});

export const createMobileSdks = (accessToken: AccessTokenProvider) => ({
  users: createUsersSdk({
    baseUrl: mobileUsersServiceBaseUrl,
    accessToken,
  }),
  payments: createPaymentsSdk({
    baseUrl: mobilePaymentsServiceBaseUrl,
    accessToken,
  }),
});

export const mobileRuntimeWarnings = [
  !mobileAuthServiceBaseUrl ? 'Set EXPO_PUBLIC_AUTH_SERVICE_BASE_URL for auth-service.' : '',
  !mobileUsersServiceBaseUrl ? 'Set EXPO_PUBLIC_USERS_SERVICE_BASE_URL for users-service.' : '',
  !mobilePaymentsServiceBaseUrl
    ? 'Set EXPO_PUBLIC_PAYMENTS_SERVICE_BASE_URL for payments-service.'
    : '',
].filter(Boolean);

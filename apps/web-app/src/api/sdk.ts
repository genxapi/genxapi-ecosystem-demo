import { createUsersSdk, users } from '@genxapi-labs/ecosystem-users-sdk';
import { createPaymentsSdk, payments } from '@genxapi-labs/ecosystem-payments-sdk';
import { getCurrentAuthAccessToken } from '../auth/auth-session';

type AccessTokenProvider =
  | string
  | null
  | undefined
  | (() => string | null | undefined | Promise<string | null | undefined>);

const withSignal = (signal?: AbortSignal): RequestInit | undefined => (signal ? { signal } : undefined);

export const webAppUsersServiceBaseUrl =
  import.meta.env.VITE_USERS_SERVICE_BASE_URL ?? '/api/users-service';
export const webAppPaymentsServiceBaseUrl =
  import.meta.env.VITE_PAYMENTS_SERVICE_BASE_URL ?? '/api/payments-service';

export const createWebAppSdks = (accessToken: AccessTokenProvider) => ({
  users: createUsersSdk({
    baseUrl: webAppUsersServiceBaseUrl,
    accessToken,
  }),
  payments: createPaymentsSdk({
    baseUrl: webAppPaymentsServiceBaseUrl,
    accessToken,
  }),
});

const webAppSdks = createWebAppSdks(getCurrentAuthAccessToken);

export type CustomerProfile = users.User;
export type CustomerPayment = payments.Payment;

export const getMyProfile = (signal?: AbortSignal) => webAppSdks.users.getMe(withSignal(signal));

export const getMyPayments = (signal?: AbortSignal) =>
  webAppSdks.payments.getMyPayments(withSignal(signal));

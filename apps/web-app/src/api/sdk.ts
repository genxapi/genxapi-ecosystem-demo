import { createDemoSdkRuntimeConfig } from '@genxapi/ecosystem-demo-runtime';
import { createUsersSdk, users } from '@genxapi/ecosystem-users-sdk';
import { createPaymentsSdk, payments } from 'genxapi-ecosystem-payments-sdk';
import { getCurrentDemoAccessToken } from '../auth/demo-session';

const withSignal = (signal?: AbortSignal): RequestInit | undefined => (signal ? { signal } : undefined);

const sdkRuntime = createDemoSdkRuntimeConfig({
  usersServiceBaseUrl: import.meta.env.VITE_USERS_SERVICE_BASE_URL ?? '/api/users-service',
  paymentsServiceBaseUrl: import.meta.env.VITE_PAYMENTS_SERVICE_BASE_URL ?? '/api/payments-service',
  accessToken: getCurrentDemoAccessToken,
});

const usersSdk = createUsersSdk(sdkRuntime.users);
const paymentsSdk = createPaymentsSdk(sdkRuntime.payments);

export type User = users.User;
export type Payment = payments.Payment;
export type UsersHealth = users.HealthCheckResponse;
export type PaymentsHealth = payments.HealthCheckResponse;

export const getUsers = (signal?: AbortSignal) => usersSdk.getUsers(withSignal(signal));

export const getUser = (id: number, signal?: AbortSignal) => usersSdk.getUser(id, withSignal(signal));

export const getUsersHealth = (signal?: AbortSignal) => usersSdk.getHealth(withSignal(signal));

export const getPaymentsHealth = (signal?: AbortSignal) => paymentsSdk.getHealth(withSignal(signal));

export const getPayments = (signal?: AbortSignal) => paymentsSdk.getPayments(withSignal(signal));

export const getUserPayments = (userId: number, signal?: AbortSignal) =>
  paymentsSdk.getUserPayments(userId, withSignal(signal));

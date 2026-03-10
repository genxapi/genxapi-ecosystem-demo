import { createUsersSdk, users } from '@genxapi/ecosystem-users-sdk';
import { createPaymentsSdk, payments } from 'genxapi-ecosystem-payments-sdk';

const withSignal = (signal?: AbortSignal): RequestInit | undefined => (signal ? { signal } : undefined);

const browserTokenProvider = () =>
  window.localStorage.getItem('genxapi.demo.bearerToken') ?? import.meta.env.VITE_DEMO_BEARER_TOKEN ?? null;

const usersSdk = createUsersSdk({
  baseUrl: import.meta.env.VITE_USERS_SERVICE_BASE_URL ?? '/api/users-service',
  accessToken: browserTokenProvider,
});

const paymentsSdk = createPaymentsSdk({
  baseUrl: import.meta.env.VITE_PAYMENTS_SERVICE_BASE_URL ?? '/api/payments-service',
  accessToken: browserTokenProvider,
});

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

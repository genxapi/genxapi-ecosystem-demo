import { users } from '@genxapi/ecosystem-users-sdk';
import { payments } from 'genxapi-ecosystem-payments-sdk';

type ApiResponse<T> = {
  data: T;
  status: number;
  headers: Headers;
};

const extractErrorMessage = (data: unknown): string | null => {
  if (!data) {
    return null;
  }

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data === 'object') {
    const record = data as { message?: string; error?: string };
    return record.message ?? record.error ?? null;
  }

  return null;
};

const unwrap = <T>(res: ApiResponse<T>): T => {
  if (res.status >= 400) {
    const detail = extractErrorMessage(res.data);
    const suffix = detail ? `: ${detail}` : '';
    throw new Error(`Request failed with status ${res.status}${suffix}`);
  }

  return res.data;
};

const withSignal = (signal?: AbortSignal): RequestInit | undefined =>
  signal ? { signal } : undefined;

export type User = users.User;
export type Payment = payments.Payment;
export type UsersHealth = users.HealthCheckResponse;
export type PaymentsHealth = payments.HealthCheckResponse;

export const getUsers = async (signal?: AbortSignal) =>
  unwrap(await users.usersControllerGetUsers(withSignal(signal)));

export const getUser = async (id: number, signal?: AbortSignal) =>
  unwrap(await users.usersControllerGetUser(id, withSignal(signal)));

export const getUsersHealth = async (signal?: AbortSignal) =>
  unwrap(await users.healthControllerGetHealth(withSignal(signal)));

export const getPaymentsHealth = async (signal?: AbortSignal) =>
  unwrap(await payments.healthControllerGetHealth(withSignal(signal)));

export const getPayments = async (signal?: AbortSignal) =>
  unwrap(await payments.paymentsControllerGetPayments(withSignal(signal)));

export const getUserPayments = async (userId: number, signal?: AbortSignal) =>
  unwrap(await payments.paymentsControllerGetUserPayments(userId, withSignal(signal)));

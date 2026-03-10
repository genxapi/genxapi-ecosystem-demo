import { users } from '@genxapi-labs/ecosystem-users-sdk';
import { payments } from '@genxapi-labs/ecosystem-payments-sdk';
import { getCurrentAuthAccessToken } from '../auth/auth-session';
import { createBackofficeSdks } from '../runtime';

const withSignal = (signal?: AbortSignal): RequestInit | undefined => (signal ? { signal } : undefined);

const backofficeSdks = createBackofficeSdks(getCurrentAuthAccessToken);

export type InternalUser = users.User;
export type InternalPayment = payments.Payment;

export const getInternalUsers = (signal?: AbortSignal) =>
  backofficeSdks.users.getUsers(withSignal(signal));

export const getInternalUser = (userId: number, signal?: AbortSignal) =>
  backofficeSdks.users.getUser(userId, withSignal(signal));

export const getInternalPayments = (signal?: AbortSignal) =>
  backofficeSdks.payments.getPayments(withSignal(signal));

export const getInternalUserPayments = (userId: number, signal?: AbortSignal) =>
  backofficeSdks.payments.getUserPayments(userId, withSignal(signal));

export type MaybePromise<T> = Promise<T> | T;
export type UserRole = 'customer' | 'support' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
}

export type HeadersProvider =
  | HeadersInit
  | undefined
  | (() => MaybePromise<HeadersInit | undefined>);

export type RequestInitProvider =
  | RequestInit
  | undefined
  | (() => MaybePromise<RequestInit | undefined>);

export interface CreateAuthClientOptions {
  baseUrl: string;
  fetch?: typeof fetch;
  headers?: HeadersProvider;
  requestInit?: RequestInitProvider;
}

export interface AuthClient {
  login(credentials: LoginCredentials, init?: RequestInit): Promise<AuthSession>;
}

export const USER_ROLES: readonly UserRole[];
export const INTERNAL_ROLES: readonly Extract<UserRole, 'support' | 'admin'>[];
export const AUTH_SESSION_STORAGE_KEY: 'genxapi.auth.session';

export function isInternalRole(role: string | null | undefined): boolean;
export function createAuthClient(options: CreateAuthClientOptions): AuthClient;

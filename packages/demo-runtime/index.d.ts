export type MaybePromise<T> = Promise<T> | T;
export type AccessTokenProvider =
  | string
  | null
  | undefined
  | (() => MaybePromise<string | null | undefined>);
export type HeadersProvider =
  | HeadersInit
  | undefined
  | (() => MaybePromise<HeadersInit | undefined>);
export type RequestInitProvider =
  | RequestInit
  | undefined
  | (() => MaybePromise<RequestInit | undefined>);

export type DemoPersonaId =
  | 'customer-bob'
  | 'customer-ethan'
  | 'support-diana'
  | 'admin-alice';

export type DemoPersonaRole = 'customer' | 'support' | 'admin';
export type DemoPersonaExperience = 'customer' | 'internal';

export interface DemoPersona {
  id: DemoPersonaId;
  label: string;
  name: string;
  email: string;
  role: DemoPersonaRole;
  userId: number;
  experience: DemoPersonaExperience;
  description: string;
  token: string;
}

export interface DemoServiceBaseUrls {
  usersServiceBaseUrl: string;
  paymentsServiceBaseUrl: string;
}

export interface DemoSdkServiceRuntimeConfig {
  baseUrl: string;
  accessToken?: AccessTokenProvider;
  headers?: HeadersProvider;
  requestInit?: RequestInitProvider;
  fetch?: typeof fetch;
}

export interface DemoSdkRuntimeConfig {
  users: DemoSdkServiceRuntimeConfig;
  payments: DemoSdkServiceRuntimeConfig;
}

export interface CreateDemoSdkRuntimeConfigOptions extends DemoServiceBaseUrls {
  accessToken?: AccessTokenProvider;
  headers?: HeadersProvider;
  requestInit?: RequestInitProvider;
  fetch?: typeof fetch;
}

export const DEMO_SESSION_STORAGE_KEY: 'genxapi.demo.persona-id';
export const DEMO_PERSONAS: readonly DemoPersona[];
export const DEFAULT_WEB_DEMO_PERSONA_ID: DemoPersonaId;
export const DEFAULT_BACKOFFICE_DEMO_PERSONA_ID: DemoPersonaId;
export const DEFAULT_MOBILE_DEMO_PERSONA_ID: DemoPersonaId;

export function getDemoPersona(personaId: string | null | undefined): DemoPersona | null;
export function createDemoServiceBaseUrls(baseUrls: DemoServiceBaseUrls): DemoServiceBaseUrls;
export function createDemoSdkRuntimeConfig(
  options: CreateDemoSdkRuntimeConfigOptions
): DemoSdkRuntimeConfig;

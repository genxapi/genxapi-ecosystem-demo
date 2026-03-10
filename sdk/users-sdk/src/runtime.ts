type MaybePromise<T> = Promise<T> | T;
type LazyValue<T> = (() => MaybePromise<T>) | T;

export type ApiResponse<T> = {
  data: T;
  status: number;
  headers: Headers;
};

type AnyApiResponse = {
  data: unknown;
  status: number;
  headers: Headers;
};

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

export type AccessTokenProvider = LazyValue<string | null | undefined>;
export type HeadersProvider = LazyValue<HeadersInit | undefined>;
export type RequestInitProvider = LazyValue<RequestInit | undefined>;
export type FetchImplementation = typeof fetch;

export interface SdkClientConfig {
  baseUrl: string;
  accessToken?: AccessTokenProvider;
  headers?: HeadersProvider;
  requestInit?: RequestInitProvider;
  fetch?: FetchImplementation;
}

export interface SdkRequestOptions extends RequestInit {
  sdkBaseUrl?: string;
  sdkAccessToken?: AccessTokenProvider;
  sdkHeaders?: HeadersProvider;
  sdkRequestInit?: RequestInitProvider;
  sdkFetch?: FetchImplementation;
}

export class SdkResponseError extends Error {
  readonly status: number;
  readonly data: unknown;
  readonly headers: Headers;

  constructor(response: ApiResponse<unknown>) {
    const detail = extractErrorMessage(response.data);
    super(
      detail
        ? `Request failed with status ${response.status}: ${detail}`
        : `Request failed with status ${response.status}`
    );
    this.name = 'SdkResponseError';
    this.status = response.status;
    this.data = response.data;
    this.headers = response.headers;
  }
}

const isAbsoluteUrl = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);

const joinUrl = (baseUrl: string, url: string) => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedUrl = url.replace(/^\/+/, '');

  if (!normalizedBaseUrl) {
    return url;
  }

  if (!normalizedUrl) {
    return normalizedBaseUrl;
  }

  return `${normalizedBaseUrl}/${normalizedUrl}`;
};

const resolveUrl = (baseUrl: string | undefined, url: string) => {
  if (!baseUrl || isAbsoluteUrl(url)) {
    return url;
  }

  return joinUrl(baseUrl, url);
};

const toHeaders = (value?: HeadersInit) => new Headers(value ?? undefined);

const mergeHeaders = (...values: Array<HeadersInit | undefined>) => {
  const headers = new Headers();

  for (const value of values) {
    const normalized = toHeaders(value);

    normalized.forEach((headerValue, key) => {
      headers.set(key, headerValue);
    });
  }

  return headers;
};

const resolveLazyValue = async <T>(value: LazyValue<T> | undefined): Promise<T | undefined> => {
  if (typeof value === 'function') {
    return (value as () => MaybePromise<T>)();
  }

  return value;
};

const extractErrorMessage = (data: unknown): string | null => {
  if (!data) {
    return null;
  }

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data === 'object') {
    const record = data as ApiErrorPayload;
    return record.message ?? record.error ?? null;
  }

  return null;
};

export const unwrapResponse = <TResponse extends AnyApiResponse>(
  response: TResponse
): Exclude<TResponse['data'], void> => {
  if (response.status >= 400) {
    throw new SdkResponseError(response);
  }

  return response.data as Exclude<TResponse['data'], void>;
};

export const createSdkRequestOptions = (config: SdkClientConfig): SdkRequestOptions => ({
  sdkBaseUrl: config.baseUrl,
  sdkAccessToken: config.accessToken,
  sdkHeaders: config.headers,
  sdkRequestInit: config.requestInit,
  sdkFetch: config.fetch,
});

export const mergeSdkRequestOptions = (
  sdkOptions: SdkRequestOptions,
  requestOptions?: RequestInit
): SdkRequestOptions => {
  if (!requestOptions) {
    return sdkOptions;
  }

  return {
    ...sdkOptions,
    ...requestOptions,
    headers: requestOptions.headers,
  };
};

export const sdkFetch = async <T>(url: string, options: SdkRequestOptions = {}): Promise<T> => {
  const {
    sdkBaseUrl,
    sdkAccessToken,
    sdkHeaders,
    sdkRequestInit,
    sdkFetch: providedFetch,
    headers,
    ...requestOptions
  } = options;

  const [defaultRequestInit, defaultHeaders, accessToken] = await Promise.all([
    resolveLazyValue(sdkRequestInit),
    resolveLazyValue(sdkHeaders),
    resolveLazyValue(sdkAccessToken),
  ]);

  const finalHeaders = mergeHeaders(defaultRequestInit?.headers, defaultHeaders, headers);

  if (accessToken && !finalHeaders.has('authorization')) {
    finalHeaders.set('authorization', `Bearer ${accessToken}`);
  }

  const fetchImplementation = providedFetch ?? globalThis.fetch?.bind(globalThis);

  if (!fetchImplementation) {
    throw new Error('Fetch implementation is not available. Provide `fetch` in the SDK config.');
  }

  const response = await fetchImplementation(resolveUrl(sdkBaseUrl, url), {
    ...defaultRequestInit,
    ...requestOptions,
    headers: finalHeaders,
  });

  const body = [204, 205, 304].includes(response.status) ? null : await response.text();
  const data = body ? JSON.parse(body) : {};

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};

export const USER_ROLES = Object.freeze(['customer', 'support', 'admin']);
export const INTERNAL_ROLES = Object.freeze(['support', 'admin']);
export const AUTH_SESSION_STORAGE_KEY = 'genxapi.auth.session';

const resolveMaybe = async (value) => (typeof value === 'function' ? value() : value);

const normalizeBaseUrl = (baseUrl) => baseUrl.replace(/\/+$/, '');

const createHeaders = async (baseHeaders, requestHeaders) => {
  const headers = new Headers();

  const applyHeaders = (value) => {
    if (!value) {
      return;
    }

    new Headers(value).forEach((headerValue, key) => {
      headers.set(key, headerValue);
    });
  };

  applyHeaders(await resolveMaybe(baseHeaders));
  applyHeaders(requestHeaders);

  return headers;
};

const getErrorMessage = (body, status) => {
  if (body && typeof body === 'object') {
    const { message } = body;

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }

    if (Array.isArray(message) && message.length > 0) {
      return message.filter((item) => typeof item === 'string').join(', ');
    }
  }

  return `Request failed with status ${status}.`;
};

const readJson = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const isInternalRole = (role) => INTERNAL_ROLES.includes(role);

export const createAuthClient = ({
  baseUrl,
  fetch: fetchImplementation = globalThis.fetch,
  headers,
  requestInit,
} = {}) => {
  if (typeof fetchImplementation !== 'function') {
    throw new Error('A fetch implementation is required to create the auth client.');
  }

  const serviceBaseUrl = normalizeBaseUrl(baseUrl ?? '');

  return {
    async login(credentials, init) {
      const resolvedRequestInit = await resolveMaybe(requestInit);
      const resolvedHeaders = await createHeaders(headers, init?.headers);

      if (!resolvedHeaders.has('content-type')) {
        resolvedHeaders.set('content-type', 'application/json');
      }

      if (!resolvedHeaders.has('accept')) {
        resolvedHeaders.set('accept', 'application/json');
      }

      const response = await fetchImplementation(`${serviceBaseUrl}/auth/login`, {
        ...resolvedRequestInit,
        ...init,
        method: 'POST',
        headers: resolvedHeaders,
        body: JSON.stringify(credentials),
      });

      const body = await readJson(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(body, response.status));
      }

      return body;
    },
  };
};

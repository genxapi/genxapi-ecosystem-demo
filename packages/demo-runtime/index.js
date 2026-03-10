export const DEMO_SESSION_STORAGE_KEY = 'genxapi.demo.persona-id';

export const DEMO_PERSONAS = Object.freeze([
  Object.freeze({
    id: 'customer-bob',
    label: 'Bob Smith',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    role: 'customer',
    userId: 2,
    experience: 'customer',
    description: 'Customer self-service persona for /me and /me/payments.',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwicm9sZSI6ImN1c3RvbWVyIiwiZW1haWwiOiJib2Iuc21pdGhAZXhhbXBsZS5jb20iLCJuYW1lIjoiQm9iIFNtaXRoIiwiaXNzIjoiZ2VueGFwaS1kZW1vIiwiYXVkIjoiZ2VueGFwaS1lY29zeXN0ZW0tZGVtbyJ9.vsaE1YfkVODsgK2YdKx75uHxLNSfwxE1Fc_af7YFd7E',
  }),
  Object.freeze({
    id: 'customer-ethan',
    label: 'Ethan Williams',
    name: 'Ethan Williams',
    email: 'ethan.williams@example.com',
    role: 'customer',
    userId: 5,
    experience: 'customer',
    description: 'Second customer persona for validating /me/payments ownership.',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Iiwicm9sZSI6ImN1c3RvbWVyIiwiZW1haWwiOiJldGhhbi53aWxsaWFtc0BleGFtcGxlLmNvbSIsIm5hbWUiOiJFdGhhbiBXaWxsaWFtcyIsImlzcyI6ImdlbnhhcGktZGVtbyIsImF1ZCI6ImdlbnhhcGktZWNvc3lzdGVtLWRlbW8ifQ.nwtpMyfwgUAyO6HkIKOX1JeLI3J2SsTu0Iqp6ZQHCjo',
  }),
  Object.freeze({
    id: 'support-diana',
    label: 'Diana Miller',
    name: 'Diana Miller',
    email: 'diana.miller@example.com',
    role: 'support',
    userId: 4,
    experience: 'internal',
    description: 'Internal support persona for /users, /payments, and user payment lookups.',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0Iiwicm9sZSI6InN1cHBvcnQiLCJlbWFpbCI6ImRpYW5hLm1pbGxlckBleGFtcGxlLmNvbSIsIm5hbWUiOiJEaWFuYSBNaWxsZXIiLCJpc3MiOiJnZW54YXBpLWRlbW8iLCJhdWQiOiJnZW54YXBpLWVjb3N5c3RlbS1kZW1vIn0.CuZqp3lFi6LDEyR_Y40eToYpxmc5akm9D8fIeVOIASU',
  }),
  Object.freeze({
    id: 'admin-alice',
    label: 'Alice Johnson',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    role: 'admin',
    userId: 1,
    experience: 'internal',
    description: 'Admin persona with the same internal read access as support.',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhbGljZS5qb2huc29uQGV4YW1wbGUuY29tIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJpc3MiOiJnZW54YXBpLWRlbW8iLCJhdWQiOiJnZW54YXBpLWVjb3N5c3RlbS1kZW1vIn0.-zpMmqxt-ymgekNQ2VYXt-LRSSjMYaREzSCDQhnxq9Q',
  }),
]);

export const DEFAULT_WEB_DEMO_PERSONA_ID = 'support-diana';
export const DEFAULT_BACKOFFICE_DEMO_PERSONA_ID = 'support-diana';
export const DEFAULT_MOBILE_DEMO_PERSONA_ID = 'customer-bob';

export const getDemoPersona = (personaId) =>
  DEMO_PERSONAS.find((persona) => persona.id === personaId) ?? null;

export const createDemoServiceBaseUrls = ({
  usersServiceBaseUrl,
  paymentsServiceBaseUrl,
}) => ({
  usersServiceBaseUrl,
  paymentsServiceBaseUrl,
});

export const createDemoSdkRuntimeConfig = ({
  usersServiceBaseUrl,
  paymentsServiceBaseUrl,
  accessToken,
  headers,
  requestInit,
  fetch,
}) => ({
  users: {
    baseUrl: usersServiceBaseUrl,
    accessToken,
    headers,
    requestInit,
    fetch,
  },
  payments: {
    baseUrl: paymentsServiceBaseUrl,
    accessToken,
    headers,
    requestInit,
    fetch,
  },
});

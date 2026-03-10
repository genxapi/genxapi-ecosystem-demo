import type { LoginCredentials } from '@genxapi/ecosystem-auth-client';

export interface DemoPersona extends LoginCredentials {
  id: 'bob-smith' | 'ethan-williams';
  name: string;
  description: string;
}

export const demoPersonas: DemoPersona[] = [
  {
    id: 'bob-smith',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    password: 'bob-demo-password',
    description: 'Customer account with two payment records, including a refund.',
  },
  {
    id: 'ethan-williams',
    name: 'Ethan Williams',
    email: 'ethan.williams@example.com',
    password: 'ethan-demo-password',
    description: 'Customer account with a single completed payment.',
  },
];

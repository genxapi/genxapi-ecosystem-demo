import type { LoginCredentials } from '@genxapi-labs/ecosystem-auth-client';

export interface DemoPersona extends LoginCredentials {
  id: 'bob-smith' | 'ethan-williams';
  name: string;
  role: 'customer';
  description: string;
}

export const demoPersonas: DemoPersona[] = [
  {
    id: 'bob-smith',
    name: 'Bob Smith',
    role: 'customer',
    email: 'bob.smith@example.com',
    password: 'bob-demo-password',
    description: 'Customer account with two payment records, including a refund.',
  },
  {
    id: 'ethan-williams',
    name: 'Ethan Williams',
    role: 'customer',
    email: 'ethan.williams@example.com',
    password: 'ethan-demo-password',
    description: 'Customer account with a single completed payment.',
  },
];

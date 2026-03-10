import type { LoginCredentials, UserRole } from '@genxapi-labs/ecosystem-auth-client';

type InternalRole = Extract<UserRole, 'support' | 'admin'>;

export interface DemoPersona extends LoginCredentials {
  id: 'diana-miller' | 'alice-johnson';
  name: string;
  role: InternalRole;
  description: string;
}

export const demoPersonas: DemoPersona[] = [
  {
    id: 'diana-miller',
    name: 'Diana Miller',
    role: 'support',
    email: 'diana.miller@example.com',
    password: 'diana-demo-password',
    description: 'Support can browse internal users and inspect user-scoped payment history.',
  },
  {
    id: 'alice-johnson',
    name: 'Alice Johnson',
    role: 'admin',
    email: 'alice.johnson@example.com',
    password: 'alice-demo-password',
    description: 'Admin gets the full internal workflow, including the global payments queue.',
  },
];

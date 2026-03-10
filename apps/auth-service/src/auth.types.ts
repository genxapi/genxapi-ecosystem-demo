export const USER_ROLES = ['customer', 'support', 'admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface JwtClaims {
  sub: string;
  role: UserRole;
  email: string;
  name: string;
  iss: string;
  aud: string;
  exp?: number;
  iat?: number;
}

export interface AuthAccount {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  isActive: boolean;
}

export const DEMO_JWT_SETTINGS = {
  issuer: process.env.JWT_ISSUER ?? 'genxapi-demo',
  audience: process.env.JWT_AUDIENCE ?? 'genxapi-ecosystem-demo',
  secret: process.env.JWT_SECRET ?? 'genxapi-ecosystem-demo-secret',
  expiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60),
} as const;

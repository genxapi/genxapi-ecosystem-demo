export const USER_ROLES = ['customer', 'support', 'admin'] as const;
export const INTERNAL_ROLES = ['support', 'admin'] as const;

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

export interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user: JwtClaims;
}

export const DEMO_JWT_SETTINGS = {
  issuer: process.env.JWT_ISSUER ?? 'genxapi-demo',
  audience: process.env.JWT_AUDIENCE ?? 'genxapi-ecosystem-demo',
  secret: process.env.JWT_SECRET ?? 'genxapi-ecosystem-demo-secret',
} as const;

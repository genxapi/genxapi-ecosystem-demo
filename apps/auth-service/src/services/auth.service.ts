import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import accounts from '../accounts.json';
import {
  DEMO_JWT_SETTINGS,
  type AuthAccount,
  type JwtClaims,
} from '../auth.types';
import { LoginRequest } from '../entities/login-request.entity';

type AuthSession = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: number;
    email: string;
    name: string;
    role: AuthAccount['role'];
  };
};

@Injectable()
export class AuthService {
  private readonly accounts = accounts as AuthAccount[];

  login(credentials: LoginRequest): AuthSession {
    const email = this.normalizeEmail(credentials.email);
    const password = this.normalizePassword(credentials.password);
    const account = this.accounts.find((candidate) => candidate.email === email);

    if (!account || account.password !== password || !account.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresIn = DEMO_JWT_SETTINGS.expiresInSeconds;
    const claims: JwtClaims = {
      sub: String(account.userId),
      role: account.role,
      email: account.email,
      name: account.name,
      iss: DEMO_JWT_SETTINGS.issuer,
      aud: DEMO_JWT_SETTINGS.audience,
      iat: issuedAt,
      exp: issuedAt + expiresIn,
    };

    return {
      accessToken: this.signToken(claims),
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: account.userId,
        email: account.email,
        name: account.name,
        role: account.role,
      },
    };
  }

  private signToken(claims: JwtClaims): string {
    const encodedHeader = this.encodeSegment({ alg: 'HS256', typ: 'JWT' });
    const encodedPayload = this.encodeSegment(claims);
    const signature = createHmac('sha256', DEMO_JWT_SETTINGS.secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private encodeSegment(value: unknown): string {
    return Buffer.from(JSON.stringify(value)).toString('base64url');
  }

  private normalizeEmail(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Email is required.');
    }

    const normalized = value.trim().toLowerCase();

    if (!normalized) {
      throw new BadRequestException('Email is required.');
    }

    return normalized;
  }

  private normalizePassword(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Password is required.');
    }

    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException('Password is required.');
    }

    return normalized;
  }
}

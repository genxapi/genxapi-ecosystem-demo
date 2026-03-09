import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import {
  DEMO_JWT_SETTINGS,
  USER_ROLES,
  type AuthenticatedRequest,
  type JwtClaims,
  type UserRole,
} from './auth.types';

type JwtHeader = {
  alg?: string;
  typ?: string;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request.headers.authorization);

    request.user = this.validateToken(token);

    return true;
  }

  private extractBearerToken(header?: string): string {
    if (!header) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authorization header must use Bearer token format.');
    }

    return token;
  }

  private validateToken(token: string): JwtClaims {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      throw new UnauthorizedException('Malformed JWT.');
    }

    const header = this.decodeSegment<JwtHeader>(encodedHeader);

    if (header.alg !== 'HS256') {
      throw new UnauthorizedException('Unsupported JWT signing algorithm.');
    }

    const expectedSignature = createHmac('sha256', DEMO_JWT_SETTINGS.secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest();
    const actualSignature = Buffer.from(encodedSignature, 'base64url');

    if (
      actualSignature.length !== expectedSignature.length ||
      !timingSafeEqual(actualSignature, expectedSignature)
    ) {
      throw new UnauthorizedException('Invalid JWT signature.');
    }

    return this.validateClaims(this.decodeSegment<unknown>(encodedPayload));
  }

  private decodeSegment<T>(segment: string): T {
    try {
      return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as T;
    } catch {
      throw new UnauthorizedException('Malformed JWT.');
    }
  }

  private validateClaims(value: unknown): JwtClaims {
    if (!value || typeof value !== 'object') {
      throw new UnauthorizedException('JWT payload must be an object.');
    }

    const claims = value as Partial<JwtClaims>;

    if (!this.isNumericSubject(claims.sub)) {
      throw new UnauthorizedException('JWT sub claim must be a numeric user id.');
    }

    if (!this.isUserRole(claims.role)) {
      throw new UnauthorizedException('JWT role claim is invalid.');
    }

    if (!this.isNonEmptyString(claims.email)) {
      throw new UnauthorizedException('JWT email claim is required.');
    }

    if (!this.isNonEmptyString(claims.name)) {
      throw new UnauthorizedException('JWT name claim is required.');
    }

    if (claims.iss !== DEMO_JWT_SETTINGS.issuer) {
      throw new UnauthorizedException('JWT issuer is invalid.');
    }

    if (claims.aud !== DEMO_JWT_SETTINGS.audience) {
      throw new UnauthorizedException('JWT audience is invalid.');
    }

    if (claims.exp !== undefined && !this.isFutureTimestamp(claims.exp)) {
      throw new UnauthorizedException('JWT has expired.');
    }

    if (claims.iat !== undefined && typeof claims.iat !== 'number') {
      throw new UnauthorizedException('JWT iat claim must be numeric.');
    }

    return {
      sub: claims.sub,
      role: claims.role,
      email: claims.email,
      name: claims.name,
      iss: claims.iss,
      aud: claims.aud,
      exp: claims.exp,
      iat: claims.iat,
    };
  }

  private isUserRole(value: unknown): value is UserRole {
    return typeof value === 'string' && USER_ROLES.includes(value as UserRole);
  }

  private isNumericSubject(value: unknown): value is string {
    return typeof value === 'string' && /^\d+$/.test(value);
  }

  private isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private isFutureTimestamp(value: unknown): value is number {
    return typeof value === 'number' && value > Math.floor(Date.now() / 1000);
  }
}

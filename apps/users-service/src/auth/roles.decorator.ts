import { SetMetadata } from '@nestjs/common';
import type { UserRole } from './auth.types';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: readonly UserRole[]) => SetMetadata(ROLES_KEY, roles);

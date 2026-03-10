import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES, type UserRole } from '../auth.types';

export class AuthUser {
  @ApiProperty({
    example: 4,
    description: 'Authenticated user id.',
  })
  id!: number;

  @ApiProperty({
    example: 'diana.miller@example.com',
    description: 'Authenticated user email address.',
  })
  email!: string;

  @ApiProperty({
    example: 'Diana Miller',
    description: 'Authenticated user display name.',
  })
  name!: string;

  @ApiProperty({
    example: 'support',
    enum: USER_ROLES,
    description: 'Authenticated user role.',
  })
  role!: UserRole;
}

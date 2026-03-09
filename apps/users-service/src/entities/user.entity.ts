import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES, type UserRole } from '../auth/auth.types';

export class User {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the user',
  })
  id!: number;

  @ApiProperty({
    example: 'Alice',
    description: 'First name of the user',
  })
  firstName!: string;

  @ApiProperty({
    example: 'Johnson',
    description: 'Last name of the user',
  })
  lastName!: string;

  @ApiProperty({
    example: 'alice.johnson@example.com',
    description: 'Email address',
  })
  email!: string;

  @ApiProperty({
    example: 'customer',
    enum: USER_ROLES,
    description: 'Role of the user for authorization decisions',
  })
  role!: UserRole;

  @ApiProperty({
    example: true,
    description: 'Whether the user is active',
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2025-01-10T09:15:00Z',
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
  })
  createdAt!: string;
}

import { ApiProperty } from '@nestjs/swagger';

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
    example: 'admin',
    enum: ['admin', 'manager', 'user'],
    description: 'Role of the user',
  })
  role!: string;

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
  createdAt!: Date;
}

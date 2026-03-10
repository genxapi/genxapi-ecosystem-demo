import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
  @ApiProperty({
    example: 'diana.miller@example.com',
    description: 'Demo account email.',
  })
  email!: string;

  @ApiProperty({
    example: 'diana-demo-password',
    description: 'Demo account password.',
  })
  password!: string;
}

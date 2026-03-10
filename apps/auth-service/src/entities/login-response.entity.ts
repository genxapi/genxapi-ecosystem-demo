import { ApiProperty } from '@nestjs/swagger';
import { AuthUser } from './auth-user.entity';

export class LoginResponse {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0Iiwicm9sZSI6InN1cHBvcnQiLCJlbWFpbCI6ImRpYW5hLm1pbGxlckBleGFtcGxlLmNvbSIsIm5hbWUiOiJEaWFuYSBNaWx',
    description: 'Signed bearer token.',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'Bearer',
    enum: ['Bearer'],
    description: 'HTTP authorization token type.',
  })
  tokenType: 'Bearer' = 'Bearer';

  @ApiProperty({
    example: 3600,
    description: 'Access token lifetime in seconds.',
  })
  expiresIn!: number;

  @ApiProperty({
    type: AuthUser,
    description: 'Authenticated user metadata.',
  })
  user!: AuthUser;
}

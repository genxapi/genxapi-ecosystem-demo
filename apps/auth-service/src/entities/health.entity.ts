import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponse {
  @ApiProperty({
    example: 'ok',
    description: 'Service status',
    enum: ['ok'],
  })
  status: 'ok' = 'ok';

  @ApiProperty({
    example: 'auth-service',
    description: 'Service name',
    enum: ['auth-service'],
  })
  service: 'auth-service' = 'auth-service';
}

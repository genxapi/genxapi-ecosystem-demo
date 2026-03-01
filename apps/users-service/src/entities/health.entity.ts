import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponse {
  @ApiProperty({
    example: 'ok',
    description: 'Service status',
    enum: ['ok'],
  })
  status: 'ok' = 'ok';

  @ApiProperty({
    example: 'users-service',
    description: 'Service name',
    enum: ['users-service'],
  })
  service: 'users-service' = 'users-service';
}

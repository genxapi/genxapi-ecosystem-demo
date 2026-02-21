import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponse {
  @ApiProperty({
    example: 'ok',
    description: 'Service status',
    type: 'ok',
  })
  status = 'ok' as const;

  @ApiProperty({
    example: 'user-service',
    description: 'service name',
  })
  service = 'user-service' as const;
}

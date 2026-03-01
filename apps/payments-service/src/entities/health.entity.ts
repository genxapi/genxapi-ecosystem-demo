import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponse {
  @ApiProperty({
    example: 'ok',
    description: 'Service status',
    enum: ['ok'],
  })
  status: 'ok' = 'ok';

  @ApiProperty({
    example: 'payments-service',
    description: 'Service name',
    enum: ['payments-service'],
  })
  service: 'payments-service' = 'payments-service';
}

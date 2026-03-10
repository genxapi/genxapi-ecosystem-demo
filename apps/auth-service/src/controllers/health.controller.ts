import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from '../app.service';
import { HealthCheckResponse } from '../entities/health.entity';

@Controller()
export class HealthController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Auth service health check' })
  @ApiResponse({ status: 200, type: HealthCheckResponse })
  getHealth() {
    return this.appService.getHealth();
  }
}

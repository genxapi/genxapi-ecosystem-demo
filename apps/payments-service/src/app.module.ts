import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { HealthController } from './controllers/health.controller';
import { PaymentsController } from './controllers/payments.controller';
import { AppService } from './app.service';
import { PaymentsService } from './services/payments.service';

@Module({
  imports: [],
  controllers: [HealthController, PaymentsController],
  providers: [AppService, PaymentsService, JwtAuthGuard, RolesGuard]
})
export class AppModule {}

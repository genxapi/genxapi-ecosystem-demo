import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { PaymentsController } from './controllers/payments.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [HealthController, PaymentsController],
  providers: [AppService]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { AuthController } from './controllers/auth.controller';
import { AppService } from './app.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [HealthController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}

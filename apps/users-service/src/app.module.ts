import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { HealthController } from './controllers/health.controller';
import { UsersController } from './controllers/users.controller';
import { AppService } from './app.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [],
  controllers: [HealthController, UsersController],
  providers: [AppService, UsersService, JwtAuthGuard, RolesGuard]
})
export class AppModule {}

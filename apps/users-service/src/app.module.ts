import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { UsersController } from './controllers/users.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [HealthController, UsersController],
  providers: [AppService]
})
export class AppModule {}

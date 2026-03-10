import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { buildAuthServiceSwaggerConfig } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, buildAuthServiceSwaggerConfig());
  SwaggerModule.setup('swagger', app, document);

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/swagger-json', (_req: unknown, res: any) => res.json(document));

  app.enableCors();

  const port = Number(process.env.PORT || 3003);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Auth service listening on http://localhost:${port}`);
}

bootstrap();

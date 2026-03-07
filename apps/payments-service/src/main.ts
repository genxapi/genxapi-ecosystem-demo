import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PAYMENTS_SERVICE_CONTRACT } from './contract';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(PAYMENTS_SERVICE_CONTRACT.title)
    .setDescription(PAYMENTS_SERVICE_CONTRACT.description)
    .setVersion(PAYMENTS_SERVICE_CONTRACT.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/swagger-json', (_req: unknown, res: any) => res.json(document));

  app.enableCors();

  const port = Number(process.env.PORT || 3002);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Payments service listening on http://localhost:${port}`);
}

bootstrap();

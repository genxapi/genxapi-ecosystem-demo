import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Payments Service')
    .setDescription('Payments service API for the genxapi ecosystem demo')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/swagger-json', (_req: unknown, res: any) => res.json(document));

  const port = Number(process.env.PORT || 3002);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Payments service listening on http://localhost:${port}`);
}

bootstrap();

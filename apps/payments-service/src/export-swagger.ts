import 'reflect-metadata';
import { promises as fs } from 'fs';
import path from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function exportSwagger(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  try {
    const config = new DocumentBuilder()
      .setTitle('Payments Service')
      .setDescription('Payments service API for the genxapi ecosystem demo')
      .setVersion('0.1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const outputPath = path.resolve(
      process.cwd(),
      'docs',
      'swagger',
      'payments-service.json'
    );

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(document, null, 2), 'utf8');
  } finally {
    await app.close();
  }
}

exportSwagger().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to export Swagger JSON.', error);
  process.exit(1);
});

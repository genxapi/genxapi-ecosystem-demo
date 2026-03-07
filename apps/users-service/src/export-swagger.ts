import 'reflect-metadata';
import { promises as fs } from 'fs';
import path from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { USERS_SERVICE_CONTRACT } from './contract';

async function exportSwagger(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  try {
    const config = new DocumentBuilder()
      .setTitle(USERS_SERVICE_CONTRACT.title)
      .setDescription(USERS_SERVICE_CONTRACT.description)
      .setVersion(process.env.API_VERSION ?? USERS_SERVICE_CONTRACT.version)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const repoRoot = path.resolve(__dirname, '..', '..', '..');
    const outputPath = path.join(repoRoot, 'docs', 'swagger', 'users-service.json');

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

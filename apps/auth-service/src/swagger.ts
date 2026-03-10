import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { DocumentBuilder } from '@nestjs/swagger';

const SERVICE_NAME = 'auth-service';
const SWAGGER_TITLE = 'Auth Service';
const SWAGGER_DESCRIPTION = [
  'Authentication service API for the genxapi ecosystem demo.',
  'Issues demo HS256 bearer JWTs that are accepted by users-service and payments-service.',
  'Consumers log in here and then configure the generated SDKs with the returned token.',
].join(' ');

const resolveServicePackageVersion = (): string => {
  if (process.env.API_VERSION) {
    return process.env.API_VERSION;
  }

  const candidatePaths = [
    path.resolve(process.cwd(), 'package.json'),
    path.resolve(__dirname, '..', 'package.json'),
    path.resolve(__dirname, '..', '..', '..', 'apps', SERVICE_NAME, 'package.json'),
  ];

  for (const candidatePath of candidatePaths) {
    if (!existsSync(candidatePath)) {
      continue;
    }

    const pkg = JSON.parse(readFileSync(candidatePath, 'utf8')) as {
      name?: string;
      version?: string;
    };

    if (pkg.name === SERVICE_NAME && typeof pkg.version === 'string' && pkg.version.length > 0) {
      return pkg.version;
    }
  }

  throw new Error(`Unable to resolve version for ${SERVICE_NAME}.`);
};

export const buildAuthServiceSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(resolveServicePackageVersion())
    .build();

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { DocumentBuilder } from '@nestjs/swagger';

const SERVICE_NAME = 'users-service';
const SWAGGER_TITLE = 'Users Service';
const SWAGGER_DESCRIPTION = 'Users service API for the genxapi ecosystem demo';

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

export const buildUsersServiceSwaggerConfig = () =>
  new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(resolveServicePackageVersion())
    .build();

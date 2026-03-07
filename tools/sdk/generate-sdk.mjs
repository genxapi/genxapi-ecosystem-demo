import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const writeJson = (path, value) =>
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const sdkMap = {
  users: {
    label: 'users',
    config: 'genxapi.users.config.json',
    packageJson: 'sdk/users-sdk/package.json',
    packageLock: 'sdk/users-sdk/package-lock.json',
    swaggerSpec: 'sdk/users-sdk/swagger-spec.json',
  },
  payments: {
    label: 'payments',
    config: 'genxapi.config.json',
    packageJson: 'sdk/payments-sdk/package.json',
    packageLock: 'sdk/payments-sdk/package-lock.json',
    swaggerSpec: 'sdk/payments-sdk/swagger-spec.json',
  },
};

const [service, configArg, logLevelArg] = process.argv.slice(2);
const sdk = sdkMap[service];

if (!sdk) {
  console.error('Usage: node tools/sdk/generate-sdk.mjs <users|payments> [config] [logLevel]');
  process.exit(1);
}

const workspaceRoot = process.cwd();
const configPath = configArg ?? sdk.config;
const logLevel = logLevelArg ?? 'info';

const run = spawnSync(
  'npx',
  ['genxapi', 'generate', '--config', configPath, '--log-level', logLevel],
  {
    cwd: workspaceRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }
);

if (run.status !== 0) {
  process.exit(run.status ?? 1);
}

const swaggerSpecPath = resolve(workspaceRoot, sdk.swaggerSpec);
const packageJsonPath = resolve(workspaceRoot, sdk.packageJson);
const packageLockPath = resolve(workspaceRoot, sdk.packageLock);

const swaggerSpec = JSON.parse(readFileSync(swaggerSpecPath, 'utf8'));
const contractVersion = swaggerSpec.info?.version;

if (typeof contractVersion !== 'string' || contractVersion.length === 0) {
  console.error(`Could not determine contract version from ${sdk.swaggerSpec}.`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const previousVersion = pkg.version;

pkg.version = contractVersion;
writeJson(packageJsonPath, pkg);

const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));
packageLock.version = contractVersion;

if (packageLock.packages?.['']) {
  packageLock.packages[''].version = contractVersion;
}

writeJson(packageLockPath, packageLock);

const status =
  previousVersion === contractVersion ? 'already matched' : `${previousVersion} -> ${contractVersion}`;

console.log(
  `[genxapi-demo] Synced ${pkg.name} package version from contract (${sdk.label}): ${status}`
);

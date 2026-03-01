import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);

const rootPath = resolve(process.cwd(), 'package.json');
const usersSdkPath = resolve(process.cwd(), 'sdk/users-sdk/package.json');
const paymentsSdkPath = resolve(process.cwd(), 'sdk/payments-sdk/package.json');

const updateRootDependencies = () => {
  const pkg = readJson(rootPath);
  pkg.dependencies = pkg.dependencies ?? {};
  pkg.dependencies['@genxapi/ecosystem-users-sdk'] = 'file:sdk/users-sdk';
  pkg.dependencies['genxapi-ecosystem-payments-sdk'] = 'file:sdk/payments-sdk';
  writeJson(rootPath, pkg);
};

const updateSdkExports = (path) => {
  const pkg = readJson(path);
  pkg.exports = pkg.exports ?? {};
  pkg.exports['.'] = {
    import: './src/index.ts',
    types: './src/index.ts',
  };
  pkg.files = ['src'];
  writeJson(path, pkg);
};

updateRootDependencies();
updateSdkExports(usersSdkPath);
updateSdkExports(paymentsSdkPath);

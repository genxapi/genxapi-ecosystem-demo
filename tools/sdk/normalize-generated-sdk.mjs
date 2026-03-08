import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [sdkDirectory] = process.argv.slice(2);

if (!sdkDirectory) {
  console.error('Usage: node tools/sdk/normalize-generated-sdk.mjs <sdk-directory>');
  process.exit(1);
}

const workspaceRoot = process.cwd();
const tsconfigBuildPath = resolve(workspaceRoot, sdkDirectory, 'tsconfig.build.json');
const rollupConfigPath = resolve(workspaceRoot, sdkDirectory, 'rollup.config.mjs');

const writeJson = (path, value) =>
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const tsconfigBuild = JSON.parse(readFileSync(tsconfigBuildPath, 'utf8'));
tsconfigBuild.compilerOptions = {
  ...tsconfigBuild.compilerOptions,
  declaration: true,
  declarationDir: 'dist/types',
  emitDeclarationOnly: false,
  outDir: 'dist',
  module: 'ESNext',
};
writeJson(tsconfigBuildPath, tsconfigBuild);

const rollupConfig = readFileSync(rollupConfigPath, 'utf8').replace(
  'dist/types/src/index.d.ts',
  'dist/types/index.d.ts'
);
writeFileSync(rollupConfigPath, rollupConfig, 'utf8');

// eslint-disable-next-line no-console
console.log(`Normalized generated SDK build config in ${sdkDirectory}`);

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Temporary workaround for a current GenX API template gap.
// The generated Rollup DTS input points at dist/types/src/index.d.ts while the
// generated tsconfig does not emit declarations into that path consistently.
// This script only patches the declaration build wiring needed for dist to
// remain the published SDK artifact. Remove it once the upstream template emits
// a build-ready rollup.config.mjs + tsconfig.build.json pair.

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
const originalDeclarationDir = tsconfigBuild.compilerOptions?.declarationDir;
const originalDeclaration = tsconfigBuild.compilerOptions?.declaration;

tsconfigBuild.compilerOptions = {
  ...tsconfigBuild.compilerOptions,
  declaration: true,
  declarationDir: 'dist/types',
};

if (originalDeclaration !== true || originalDeclarationDir !== 'dist/types') {
  writeJson(tsconfigBuildPath, tsconfigBuild);
}

const originalRollupConfig = readFileSync(rollupConfigPath, 'utf8');
const patchedRollupConfig = originalRollupConfig.replace(
  'dist/types/src/index.d.ts',
  'dist/types/index.d.ts'
);

if (patchedRollupConfig !== originalRollupConfig) {
  writeFileSync(rollupConfigPath, patchedRollupConfig, 'utf8');
}

// eslint-disable-next-line no-console
console.log(
  `Patched generated SDK build config in ${sdkDirectory} (temporary template workaround)`
);

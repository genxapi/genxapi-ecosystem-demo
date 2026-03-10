import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

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
const sdkRoot = resolve(workspaceRoot, sdkDirectory);
const tsconfigBuildPath = resolve(workspaceRoot, sdkDirectory, 'tsconfig.build.json');
const rollupConfigPath = resolve(workspaceRoot, sdkDirectory, 'rollup.config.mjs');
const orvalConfigPath = resolve(workspaceRoot, sdkDirectory, 'orval.config.ts');
const indexPath = resolve(workspaceRoot, sdkDirectory, 'src', 'index.ts');

const writeJson = (path, value) =>
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const toConfigSource = (value) =>
  `import { defineConfig } from "orval";\n\nexport default defineConfig(${JSON.stringify(value, null, 2)});\n`;

const parseOrvalConfig = (source) => {
  const match = source.match(/defineConfig\(([\s\S]*)\);\s*$/);

  if (!match) {
    throw new Error(`Unable to parse generated Orval config: ${orvalConfigPath}`);
  }

  return JSON.parse(match[1]);
};

const getIndexSource = () => {
  if (sdkDirectory.endsWith('users-sdk')) {
    return `export * as users from "./users";
export {
  SdkResponseError,
  createSdkRequestOptions,
  mergeSdkRequestOptions,
  sdkFetch,
  unwrapResponse,
} from "./runtime";
export { createUsersSdk } from "./sdk";
export type {
  AccessTokenProvider,
  FetchImplementation,
  HeadersProvider,
  RequestInitProvider,
  SdkClientConfig,
  SdkRequestOptions,
} from "./runtime";
export type { UsersSdk, UsersSdkConfig } from "./sdk";
`;
  }

  if (sdkDirectory.endsWith('payments-sdk')) {
    return `export * as payments from "./payments";
export {
  SdkResponseError,
  createSdkRequestOptions,
  mergeSdkRequestOptions,
  sdkFetch,
  unwrapResponse,
} from "./runtime";
export { createPaymentsSdk } from "./sdk";
export type {
  AccessTokenProvider,
  FetchImplementation,
  HeadersProvider,
  RequestInitProvider,
  SdkClientConfig,
  SdkRequestOptions,
} from "./runtime";
export type { PaymentsSdk, PaymentsSdkConfig } from "./sdk";
`;
  }

  return null;
};

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

const originalOrvalConfig = readFileSync(orvalConfigPath, 'utf8');
const orvalConfig = parseOrvalConfig(originalOrvalConfig);

for (const clientConfig of Object.values(orvalConfig)) {
  const output = clientConfig?.output;

  if (!output || typeof output !== 'object') {
    continue;
  }

  output.baseUrl = '';
  output.override = {
    ...(typeof output.override === 'object' && output.override ? output.override : {}),
    mutator: {
      path: '../runtime.ts',
      name: 'sdkFetch',
    },
  };
}

const patchedOrvalConfig = toConfigSource(orvalConfig);

if (patchedOrvalConfig !== originalOrvalConfig) {
  writeFileSync(orvalConfigPath, patchedOrvalConfig, 'utf8');
}

const generateClients = spawnSync('npm', ['run', 'generate-clients'], {
  stdio: 'inherit',
  cwd: sdkRoot,
  env: process.env,
});

if (generateClients.status !== 0) {
  process.exit(generateClients.status ?? 1);
}

const indexSource = getIndexSource();

if (indexSource) {
  writeFileSync(indexPath, indexSource, 'utf8');
}

// eslint-disable-next-line no-console
console.log(
  `Patched generated SDK build config in ${sdkDirectory} (temporary template workaround)`
);

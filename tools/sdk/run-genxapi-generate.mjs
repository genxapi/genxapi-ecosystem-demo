import { readFileSync, unlinkSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) {
    return '';
  }

  const value = args[index + 1] ?? '';

  if (value.startsWith('--')) {
    return '';
  }

  return value;
};

const configPathArg = getArgValue('--config');
const contractPathArg = getArgValue('--contract');
const logLevel = getArgValue('--log-level') || 'info';

if (!configPathArg) {
  console.error(
    'Usage: node tools/sdk/run-genxapi-generate.mjs --config <path> [--contract <path>] [--log-level <level>]'
  );
  process.exit(1);
}

const workspaceRoot = process.cwd();
const configPath = path.resolve(workspaceRoot, configPathArg);

if (!existsSync(configPath)) {
  console.error(`Missing GenX API config: ${configPath}`);
  process.exit(1);
}

const runGenerate = (resolvedConfigPath) =>
  spawnSync(
    'npx',
    ['genxapi', 'generate', '--config', resolvedConfigPath, '--log-level', logLevel],
    {
      stdio: 'inherit',
      cwd: workspaceRoot,
      env: process.env,
    }
  );

let temporaryConfigPath = '';

try {
  let effectiveConfigPath = configPath;

  if (contractPathArg) {
    const contractPath = path.resolve(workspaceRoot, contractPathArg);

    if (!existsSync(contractPath)) {
      throw new Error(`Missing published contract snapshot: ${contractPath}`);
    }

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const contractPathForConfig = `./${path
      .relative(path.dirname(configPath), contractPath)
      .split(path.sep)
      .join('/')}`;

    if (!Array.isArray(config.clients) || config.clients.length === 0) {
      throw new Error(`Config ${configPathArg} does not define any clients to patch.`);
    }

    config.clients = config.clients.map((client) => ({
      ...client,
      swagger: contractPathForConfig,
    }));

    temporaryConfigPath = path.resolve(
      workspaceRoot,
      `${path.basename(configPathArg, '.json')}.resolved.json`
    );
    writeFileSync(temporaryConfigPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
    effectiveConfigPath = temporaryConfigPath;
  }

  const result = runGenerate(effectiveConfigPath);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  if (temporaryConfigPath && existsSync(temporaryConfigPath)) {
    unlinkSync(temporaryConfigPath);
  }
}

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const [service, requestedVersion = ''] = process.argv.slice(2);

if (!service) {
  console.error(
    'Usage: node tools/contracts/resolve-contract-path.mjs <service-name> [contract-version]'
  );
  process.exit(1);
}

const workspaceRoot = process.cwd();
const contractRoot = path.resolve(workspaceRoot, 'docs', 'contracts', service);
const latestContractPath = path.join(contractRoot, 'latest.json');

const readJson = (filePath) => JSON.parse(readFileSync(filePath, 'utf8'));

const resolveContractVersion = () => {
  if (requestedVersion) {
    return requestedVersion;
  }

  if (!existsSync(latestContractPath)) {
    throw new Error(`Missing latest contract alias for ${service}: ${latestContractPath}`);
  }

  const latestContract = readJson(latestContractPath);
  const latestVersion = latestContract.info?.version;

  if (typeof latestVersion !== 'string' || latestVersion.length === 0) {
    throw new Error(`Missing info.version in ${latestContractPath}`);
  }

  return latestVersion;
};

try {
  const contractVersion = resolveContractVersion();
  const versionedContractPath = path.join(contractRoot, `${contractVersion}.json`);

  if (!existsSync(versionedContractPath)) {
    throw new Error(`Missing versioned contract snapshot: ${versionedContractPath}`);
  }

  const repoRelativePath = path
    .relative(workspaceRoot, versionedContractPath)
    .split(path.sep)
    .join('/');

  process.stdout.write(`contract_path=${repoRelativePath}\n`);
  process.stdout.write(`contract_version=${contractVersion}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

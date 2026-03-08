import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [service] = process.argv.slice(2);

if (!service) {
  console.error('Usage: node tools/contracts/publish-contract.mjs <service-name>');
  process.exit(1);
}

const workspaceRoot = process.cwd();
const sourcePath = path.resolve(workspaceRoot, 'docs', 'swagger', `${service}.json`);
const contractDir = path.resolve(workspaceRoot, 'docs', 'contracts', service);

const publishContract = async () => {
  const source = JSON.parse(await readFile(sourcePath, 'utf8'));
  const version = source.info?.version;

  if (typeof version !== 'string' || version.length === 0) {
    throw new Error(`Missing info.version in ${sourcePath}`);
  }

  await mkdir(contractDir, { recursive: true });

  const serialized = `${JSON.stringify(source, null, 2)}\n`;
  await writeFile(path.join(contractDir, `${version}.json`), serialized, 'utf8');
  await writeFile(path.join(contractDir, 'latest.json'), serialized, 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Published ${service} contract version ${version} to ${contractDir}`);
};

publishContract().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});

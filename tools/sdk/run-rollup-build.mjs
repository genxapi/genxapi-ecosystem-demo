import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { rollup } from 'rollup';

const sdkDirectory = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : process.cwd();
const configPath = path.join(sdkDirectory, 'rollup.config.mjs');

if (!existsSync(configPath)) {
  console.error(`Missing Rollup config: ${configPath}`);
  process.exit(1);
}

const runBuild = async () => {
  const loadedConfig = await import(pathToFileURL(configPath).href);
  const configEntries = Array.isArray(loadedConfig.default) ? loadedConfig.default : [loadedConfig.default];

  for (const entry of configEntries) {
    if (!entry) {
      continue;
    }

    const { output, ...inputOptions } = entry;
    const bundle = await rollup(inputOptions);

    try {
      const outputs = Array.isArray(output) ? output : [output];

      for (const outputOptions of outputs) {
        await bundle.write(outputOptions);
      }
    } finally {
      await bundle.close();
    }
  }
};

runBuild()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });

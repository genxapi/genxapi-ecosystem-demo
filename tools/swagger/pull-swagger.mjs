import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const endpoints = [
  {
    name: 'users-service',
    url: 'http://localhost:3001/swagger-json',
    outFile: 'docs/swagger/users-service.json'
  },
  {
    name: 'payments-service',
    url: 'http://localhost:3002/swagger-json',
    outFile: 'docs/swagger/payments-service.json'
  }
];

async function pullSwagger() {
  for (const endpoint of endpoints) {
    const response = await fetch(endpoint.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint.name} swagger from ${endpoint.url}`);
    }
    const json = await response.json();
    await mkdir(dirname(endpoint.outFile), { recursive: true });
    await writeFile(endpoint.outFile, JSON.stringify(json, null, 2));
    // eslint-disable-next-line no-console
    console.log(`Saved ${endpoint.name} swagger to ${endpoint.outFile}`);
  }
}

pullSwagger().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});

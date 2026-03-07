import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const workspaceRoot = resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@genxapi/ecosystem-users-sdk': resolve(workspaceRoot, 'sdk/users-sdk/src/index.ts'),
      'genxapi-ecosystem-payments-sdk': resolve(
        workspaceRoot,
        'sdk/payments-sdk/src/index.ts'
      )
    }
  },
  server: {
    port: 4200,
    fs: {
      allow: [workspaceRoot]
    }
  }
});

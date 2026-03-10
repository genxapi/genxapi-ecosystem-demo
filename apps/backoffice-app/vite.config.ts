import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 4300,
      proxy: {
        '/api/users-service': {
          target: env.VITE_USERS_SERVICE_PROXY_TARGET ?? 'http://127.0.0.1:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/users-service/, ''),
        },
        '/api/payments-service': {
          target: env.VITE_PAYMENTS_SERVICE_PROXY_TARGET ?? 'http://127.0.0.1:3002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/payments-service/, ''),
        },
      },
    },
  };
});

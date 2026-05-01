import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const sharedEnvironment = loadEnv(mode, resolve(__dirname, '../../_common'), '');
  const backendUrl = sharedEnvironment.BACKEND_URL ?? process.env.BACKEND_URL ?? 'http://localhost:4000';

  return {
    plugins: [react()],
    define: {
      'process.env.BACKEND_URL': JSON.stringify(backendUrl),
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@common/hooks': resolve(__dirname, '../_common/hooks'),
        '@common/services': resolve(__dirname, '../_common/services'),
        '@common/stores': resolve(__dirname, '../_common/stores'),
        '@common/ui-kit': resolve(__dirname, '../_common/ui-kit'),
      },
    },
  };
});

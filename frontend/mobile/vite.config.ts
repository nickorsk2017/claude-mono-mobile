import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@common/hooks': resolve(__dirname, '../_common/hooks'),
      '@common/services': resolve(__dirname, '../_common/services'),
      '@common/stores': resolve(__dirname, '../_common/stores'),
      '@common/ui-kit': resolve(__dirname, '../_common/ui-kit'),
    },
  },
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const environmentVariables = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(
        environmentVariables['VITE_SUPABASE_URL'] ?? '',
      ),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
        environmentVariables['VITE_SUPABASE_ANON_KEY'] ?? '',
      ),
    },
    resolve: {
      alias: {
        '@common/stores': path.resolve(__dirname, '../_common/stores/index.ts'),
        '@common/hooks': path.resolve(__dirname, '../_common/hooks/index.ts'),
        '@common/services': path.resolve(__dirname, '../_common/services/index.ts'),
        '@common/ui-kit': path.resolve(__dirname, '../_common/ui-kit/src/index.ts'),
        '@common/utils': path.resolve(__dirname, '../_common/utils'),
      },
    },
    server: {
      port: 8100,
    },
  };
});

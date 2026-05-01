import type { NextConfig } from 'next';

const nextConfiguration: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@common/shared'],
};

export default nextConfiguration;

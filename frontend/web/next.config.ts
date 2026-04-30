import type { NextConfig } from 'next';

const nextConfiguration: NextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@common/stores',
    '@common/hooks',
    '@common/services',
    '@common/utils',
  ],
};

export default nextConfiguration;

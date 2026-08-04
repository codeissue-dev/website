import type { NextConfig } from 'next';

const isVercel = process.env.VERCEL === '1';

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { output: 'standalone' as const }),
  poweredByHeader: false,
  serverExternalPackages: ['pg'],
};

export default nextConfig;

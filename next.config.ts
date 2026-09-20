import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    agentFeedback: true,
    inlineCss: true,
    useOffline: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bms-backend-9k8n.onrender.com',
  },
  
  images: {
    domains: ['static.readdy.ai', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.readdy.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bms-backend-9k8n.onrender.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Note: headers are not compatible with static export
  // Security headers should be configured at the hosting level

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Note: redirects are not compatible with static export
  // API calls will be made directly to the backend URL

  // Note: rewrites are not compatible with static export
  // API calls will be made directly to the backend URL

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  output: 'standalone',

  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://bms-backend-9k8n.onrender.com',
  },
};

export default nextConfig;

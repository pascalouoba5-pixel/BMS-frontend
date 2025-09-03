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

  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  redirects: async () => {
    return [
      {
        source: '/api',
        destination: '/api/health',
        permanent: false,
      },
    ];
  },

  rewrites: async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bms-backend-9k8n.onrender.com';
    
    // Vérifier que l'URL est valide
    if (!apiUrl || apiUrl === 'undefined') {
      console.warn('⚠️ NEXT_PUBLIC_API_URL non définie, utilisation de l\'URL par défaut');
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

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

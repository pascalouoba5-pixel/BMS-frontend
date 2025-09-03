import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration de l'environnement
  env: {
    // URL de l'API selon l'environnement
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://bms-backend-9k8n.onrender.com',
  },

  // Configuration des images
  images: {
    domains: [
      'static.readdy.ai',
      'localhost',
      'bms-backend-9k8n.onrender.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Configuration des headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
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

  // Configuration de la compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuration du build
  experimental: {
    optimizeCss: true,
  },

  // Configuration des redirections
  async redirects() {
    return [
      {
        source: '/api',
        destination: '/api/health',
        permanent: false,
      },
    ];
  },

  // Configuration des rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },

  // Configuration du webpack
  webpack: (config, { dev, isServer }) => {
    // Optimisations pour la production
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

  // Configuration des types
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuration ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configuration de la sortie
  output: 'standalone',

  // Configuration des variables d'environnement
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://bms-backend-9k8n.onrender.com',
  },
};

export default nextConfig;

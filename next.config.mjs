/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apisistema.blob.core.windows.net'
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      }
    ]
  },
  presets: [
    'next/babel',
    '@babel/preset-typescript',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Ignora erros de tipo no build
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/coins/images/**',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '**/*',
      },
      {
        protocol: 'https',
        hostname: 'warpcast.com',
        pathname: '**/*',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '**/*',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "punycode": false,
    };
    return config;
  },
};

module.exports = nextConfig;
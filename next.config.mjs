/** @type {import('next').NextConfig} */
const isWindows = process.platform === 'win32';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  ...(isWindows ? { outputFileTracing: false } : {}),
};

export default nextConfig;

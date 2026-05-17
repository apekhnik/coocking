import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: require('path').join(__dirname),
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'source.unsplash.com' },
      { hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default nextConfig

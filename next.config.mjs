/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  // Ensure API routes are properly handled
  experimental: {
    serverActions: {
      allowedOrigins: ['session-share-prod-frontend.vercel.app', 'localhost:3000', 'sessionshare.app'],
    },
  },
}

export default nextConfig

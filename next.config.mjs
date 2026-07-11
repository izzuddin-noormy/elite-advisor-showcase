/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The project uses loose types and generated Supabase types with `as any` casts.
  // Match the previous Vite behaviour (no build-time type/lint gate).
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;

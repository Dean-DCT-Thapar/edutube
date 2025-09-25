/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output to test if that's causing the issue
  // output: 'standalone',
  
  // Add some debugging and optimization settings
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Ensure proper handling of client-side navigation
  trailingSlash: false,
  
  // Add explicit hostname binding
  env: {
    HOSTNAME: '0.0.0.0',
    PORT: '4000',
  },
};

export default nextConfig;

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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), usb=(), serial=(), bluetooth=(), magnetometer=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; child-src 'self' https://www.youtube.com https://www.youtube-nocookie.com"
          }
        ]
      }
    ];
  },
};

export default nextConfig;

/** Delegates media-related features to YouTube iframes (Permissions-Policy on all routes). */
const PERMISSIONS_POLICY =
  'accelerometer=(self "https://www.youtube.com" "https://www.youtube-nocookie.com"), ' +
  'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com"), ' +
  'camera=(), display-capture=(), geolocation=(), ' +
  'gyroscope=(self "https://www.youtube.com" "https://www.youtube-nocookie.com"), ' +
  'microphone=(), midi=(), payment=(), publickey-credentials-get=(), usb=(), serial=(), bluetooth=(), magnetometer=(), ' +
  'encrypted-media=(self "https://www.youtube.com" "https://www.youtube-nocookie.com"), ' +
  'picture-in-picture=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output to test if that's causing the issue
  // output: 'standalone',
  
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
            value: PERMISSIONS_POLICY
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

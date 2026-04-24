import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  const contentSecurityPolicy = [
    "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
    "child-src 'self' https://www.youtube.com https://www.youtube-nocookie.com"
  ].join('; ');

  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), usb=(), serial=(), bluetooth=(), magnetometer=()'
  );
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);

  return response;
}

export const config = {
  matcher: '/:path*'
};


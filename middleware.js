import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  response.headers.set(
    'Permissions-Policy',
    'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), microphone=(), midi=(), payment=(), publickey-credentials-get=(), usb=(), serial=(), bluetooth=(), magnetometer=()'
  );

  return response;
}

export const config = {
  matcher: '/:path*'
};


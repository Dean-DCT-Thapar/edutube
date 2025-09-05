import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  
  // Add headers to help with RSC and navigation
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('X-Robots-Tag', 'noindex');
  
  // Handle prefetch requests properly
  if (request.headers.get('Next-Router-Prefetch')) {
    response.headers.set('Next-Router-Prefetch', 'true');
  }
  
  // Ensure proper content type for RSC requests
  if (request.headers.get('RSC')) {
    response.headers.set('Content-Type', 'text/x-component');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

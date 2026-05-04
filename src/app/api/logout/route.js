import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';;

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function POST(request) {
    try {
        // Get tokens from cookies
        const accessToken = request.cookies.get('accessToken');
        const adminToken = request.cookies.get('adminToken');
        
        // Use whichever token exists
        const token = adminToken || accessToken;

        if (token) {
            // Call backend logout endpoint
            await apiClient.post(`/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            });
        }

        // Create response
        const response = NextResponse.json(
            { success: true },
            { status: 200 }
        );

        // Clear both cookies with proper settings
        const isHttps = request.headers.get('x-forwarded-proto') === 'https' || 
                       request.url.startsWith('https://') ||
                       process.env.NODE_ENV === 'production';

        const cookieOptions = {
            httpOnly: true,
            secure: isHttps,
            sameSite: 'lax',
            path: '/',
            maxAge: 0 // Delete cookie
        };

        response.cookies.set('accessToken', '', cookieOptions);
        response.cookies.set('adminToken', '', cookieOptions);
        response.cookies.set('refreshToken', '', cookieOptions);

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, message: 'Logout failed' },
            { status: 500 }
        );
    }
} 
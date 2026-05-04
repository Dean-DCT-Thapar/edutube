import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

const extractCookie = (setCookieHeader, name) => {
    if (!setCookieHeader) return null;
    const values = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    const prefix = `${name}=`;
    for (const raw of values) {
        if (!raw || !raw.startsWith(prefix)) continue;
        const firstPart = raw.split(';')[0] || '';
        return firstPart.slice(prefix.length);
    }
    return null;
};

export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Login request received:', { email: body.email });

        // Call backend service using apiClient (handles Docker networking automatically)
        const response = await apiClient.post('/login', {
            email: body.email,
            password: body.password,
        });

        const { accessToken, user } = response.data;
        const refreshToken = extractCookie(response.headers?.['set-cookie'], 'refreshToken');

        // Response object for frontend usage
        const responseData = { 
            success: true,
            role: user.role,
            accessToken, // still return accessToken for JS usage if needed
        };

        const res = NextResponse.json(responseData, { status: 200 });

        // Set httpOnly cookie for production
        const isHttps = request.headers.get('x-forwarded-proto') === 'https' || 
                   request.url.startsWith('https://');
                       
        const cookieOptions = {
            httpOnly: true,
            secure: isHttps,
            sameSite: 'lax', // Use 'lax' for same-site requests
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        };

        if (user.role === 'admin') {
            res.cookies.set('adminToken', accessToken, cookieOptions);
        } else {
            res.cookies.set('accessToken', accessToken, cookieOptions);
        }
        if (refreshToken) {
            res.cookies.set('refreshToken', refreshToken, {
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 30
            });
        }

        return res;

    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);

        return NextResponse.json(
            { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            },
            { status: error.response?.status || 500 }
        );
    }
}

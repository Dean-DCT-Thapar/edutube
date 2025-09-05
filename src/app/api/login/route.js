import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

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

        // Response object for frontend usage
        const responseData = { 
            success: true,
            role: user.role,
            accessToken, // still return accessToken for JS usage if needed
        };

        const res = NextResponse.json(responseData, { status: 200 });

        // Set httpOnly cookie for production
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        };

        if (user.role === 'admin') {
            res.cookies.set('adminToken', accessToken, cookieOptions);
        } else {
            res.cookies.set('accessToken', accessToken, cookieOptions);
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

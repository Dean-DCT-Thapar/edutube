import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const WINDOWS_HOST = '192.168.29.209';

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Forward the request to your backend
        const response = await axios.post(`http://${WINDOWS_HOST}:5000/login`, {
            email: body.email,
            password: body.password,
        });

        // Create the response
        const res = NextResponse.json(
            { success: true },
            { status: 200 }
        );

        // Set HTTP-only cookie with the token from your backend
        cookies().set('accessToken', response.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return res;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || 'Login failed' },
            { status: error.response?.status || 500 }
        );
    }
}
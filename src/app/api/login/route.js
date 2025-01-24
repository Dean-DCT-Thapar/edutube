import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';



export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Request body:', body);
        
        const response = await axios.post(`https://still-citadel-95346-111a1dcad6bd.herokuapp.com/login`, {
            email: body.email,
            password: body.password,
        });

        // Create the response
        const res = NextResponse.json(
            { 
                success: true,
                role: response.data.role
            },
            { status: 200 }
        );

        // Await the cookies() call
        const cookieStore = await cookies();
        cookieStore.set('accessToken', response.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
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
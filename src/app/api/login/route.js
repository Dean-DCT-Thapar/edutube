import { NextResponse } from 'next/server';
import axios from 'axios';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function POST(request) {
    try {
        const body = await request.json();
        console.log('Request body:', body);

        const response = await axios.post(`http://localhost:5001/login`, {
            email: body.email,
            password: body.password,
        });

        // Create the response with data for all users
        const responseData = { 
            success: true,
            role: response.data.user.role,
            accessToken: response.data.accessToken  // Include accessToken for all users
        };

        const res = NextResponse.json(responseData, { status: 200 });
        
        // Set different cookies based on user role
        if (response.data.user.role === 'admin') {
            res.cookies.set('adminToken', response.data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24
            });
        } else {
            res.cookies.set('accessToken', response.data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24
            });
        }

        return res;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || 'Login failed' },
            { status: error.response?.status || 500 }
        );
    }
}
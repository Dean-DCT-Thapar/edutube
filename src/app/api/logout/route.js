import { NextResponse } from 'next/server';
import axios from 'axios';

const WINDOWS_HOST = '192.168.29.209';

export async function POST(request) {
    try {
        // Get the token from cookies
        const token = request.cookies.get('accessToken');

        if (token) {
            // Call backend logout endpoint
            await axios.post(`http://${WINDOWS_HOST}:5000/logout`, {}, {
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

        // Clear the cookie
        response.cookies.delete('accessToken');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, message: 'Logout failed' },
            { status: 500 }
        );
    }
} 
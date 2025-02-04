import { NextResponse } from 'next/server';
import axios from 'axios';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function POST(request) {
    try {
        // Get the token from cookies
        const token = request.cookies.get('accessToken');

        if (token) {
            // Call backend logout endpoint
            await axios.post(MODE === 'production' 
                ? `https://still-citadel-95346-111a1dcad6bd.herokuapp.com/logout` 
                : `http://${WINDOWS_HOST}:5000/logout`, {}, {
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
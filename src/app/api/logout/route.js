import { NextResponse } from 'next/server';
import axios from 'axios';

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

        // Clear both cookies
        response.cookies.delete('accessToken');
        response.cookies.delete('adminToken');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, message: 'Logout failed' },
            { status: 500 }
        );
    }
} 
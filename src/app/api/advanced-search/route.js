import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function POST(request) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken');

        if (!accessToken) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }

        const backendUrl = MODE === 'production' 
            ? 'https://still-citadel-95346-111a1dcad6bd.herokuapp.com'
            : `http://${WINDOWS_HOST}:5000`;

        const response = await axios.post(
            `${backendUrl}/advanced-search`,
            body,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken.value}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Advanced search error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Search failed',
                error: error.message 
            },
            { status: error.response?.status || 500 }
        );
    }
}

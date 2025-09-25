import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';;
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/utils/apiConfig';

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

    const backendUrl = getBackendUrl();

        const response = await apiClient.post(
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

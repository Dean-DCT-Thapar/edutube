/**
 * Frontend API Route Template
 * 
 * Use this template for all new frontend API routes to ensure consistency
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/utils/apiConfig';

const BACKEND_URL = getBackendUrl();

/**
 * Template for GET requests
 */
export async function GET(request, { params } = {}) {
    try {
        // Get authentication token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        // Check authentication if required
        if (!token) {
            return NextResponse.json(
                { message: 'Authentication required' }, 
                { status: 401 }
            );
        }

        // Extract any URL parameters if needed
        const searchParams = request.nextUrl.searchParams;
        // const queryParam = searchParams.get('param');

        // Make request to backend
        const response = await fetch(`${BACKEND_URL}/backend/endpoint/here`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
        
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Template for POST requests
 */
export async function POST(request) {
    try {
        // Parse request body
        const body = await request.json();
        
        // Get authentication token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json(
                { message: 'Authentication required' }, 
                { status: 401 }
            );
        }

        // Validate request body if needed
        // if (!body.requiredField) {
        //     return NextResponse.json(
        //         { message: 'Required field missing' }, 
        //         { status: 400 }
        //     );
        // }

        // Make request to backend
        const response = await fetch(`${BACKEND_URL}/backend/endpoint/here`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });
        
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

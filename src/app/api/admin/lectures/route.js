import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
        }

        const url = new URL(request.url);
        const searchParams = url.searchParams.toString();

        const response = await axios.get(`${BACKEND_URL}/api/admin/lectures${searchParams ? `?${searchParams}` : ''}`, {
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Admin Lectures API error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Failed to fetch lectures',
                error: error.response?.data?.error || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
        }

        const body = await request.json();
        
        console.log('Next.js API - Create lecture request body:', body);

        const response = await axios.post(`${BACKEND_URL}/api/admin/lectures`, body, {
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Admin Create Lecture API error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Failed to create lecture',
                error: error.response?.data?.error || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}

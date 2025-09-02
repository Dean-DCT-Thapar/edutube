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

        const response = await axios.get(`${BACKEND_URL}/api/admin/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Admin Dashboard Stats API error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Failed to fetch dashboard stats',
                error: error.response?.data?.error || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}

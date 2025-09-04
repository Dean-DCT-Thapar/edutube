import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function PUT(request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
        }

        const lectureId = params.id;
        const body = await request.json();

        console.log('Next.js API - Update lecture with tags request body:', body);

        const response = await axios.put(`${BACKEND_URL}/api/admin/lectures/${lectureId}/with-tags`, body, {
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Admin Update Lecture with Tags API error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Failed to update lecture with tags',
                error: error.response?.data?.error || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}

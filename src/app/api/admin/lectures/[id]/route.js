import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
        }

        const lectureId = params.id;

        const response = await axios.get(`${BACKEND_URL}/api/admin/lectures/${lectureId}`, {
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Admin Get Lecture API error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Failed to fetch lecture',
                error: error.response?.data?.error || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
        }

        const lectureId = params.id;
        const body = await request.json();

        console.log('Next.js API - Update lecture request body:', body);

        const response = await axios.put(`${BACKEND_URL}/api/admin/lectures/${lectureId}`, body, {
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Admin Update Lecture API error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Failed to update lecture',
                error: error.response?.data?.error || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
        }

        const lectureId = params.id;

        console.log('Next.js API - Delete lecture:', lectureId);

        const response = await axios.delete(`${BACKEND_URL}/api/admin/lectures/${lectureId}`, {
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);

    } catch (error) {
        console.error('Admin Delete Lecture API error:', error);
        return NextResponse.json(
            { 
                message: error.response?.data?.message || 'Failed to delete lecture',
                error: error.response?.data?.error || error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}

import { cookies } from 'next/headers';
import apiClient from '@/utils/apiClient';;
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

async function updateProgress(request) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('adminToken') || cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await apiClient.post(`/watch-history`, {
                lecture_id: body.lecture_id,
                progress: body.progress
            }, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Update watch progress error:', error);
        return NextResponse.json(
            { status: 500, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// Update watch progress
export async function PUT(request) {
    return updateProgress(request);
}

export async function POST(request) {
    return updateProgress(request);
}

import { cookies } from 'next/headers';
import apiClient from '@/utils/apiClient';;
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { lectureId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('adminToken') || cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await apiClient.get(`/getVideoProgress/${lectureId}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Get video progress error:', error);
        return NextResponse.json(
            { status: 500, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

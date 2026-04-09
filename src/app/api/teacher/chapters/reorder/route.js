import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import apiClient from '@/utils/apiClient';

export async function PUT(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        const body = await request.json();

        const response = await apiClient.put('/api/teacher/chapters/reorder', body, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            }
        });

        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        console.error('Teacher reorder chapters proxy error:', error.response?.data || error.message);
        return NextResponse.json(
            { message: error.response?.data?.message || error.message || 'Request failed' },
            { status: error.response?.status || 500 }
        );
    }
}

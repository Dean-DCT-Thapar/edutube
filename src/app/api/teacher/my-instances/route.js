import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import apiClient from '@/utils/apiClient';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        const response = await apiClient.get('/api/teacher/my-instances', {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Teacher my-instances proxy error:', error.response?.data || error.message);
        return NextResponse.json(
            { message: error.response?.data?.message || error.message || 'Request failed' },
            { status: error.response?.status || 500 }
        );
    }
}

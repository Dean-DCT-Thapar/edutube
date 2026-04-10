import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';
import { cookies } from 'next/headers';

const getSessionToken = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('adminToken') || cookieStore.get('accessToken');
};

export async function POST() {
    try {
        const token = await getSessionToken();
        if (!token) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        const response = await apiClient.post('/api/auth/student-view/start', {}, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to enable student view mode' },
            { status: error.response?.status || 500 }
        );
    }
}

export async function DELETE() {
    try {
        const token = await getSessionToken();
        if (!token) {
            return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
        }

        const response = await apiClient.post('/api/auth/student-view/stop', {}, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { message: error.response?.data?.message || 'Failed to disable student view mode' },
            { status: error.response?.status || 500 }
        );
    }
}
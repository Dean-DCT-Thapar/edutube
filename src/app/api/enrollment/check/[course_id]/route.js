import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request, { params }) {
    try {
        const { course_id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/api/enrollment/check/${course_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Check enrollment API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

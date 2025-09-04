import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('course_id');

        // Build query parameters
        const params = new URLSearchParams();
        if (courseId) {
            params.set('course_id', courseId);
        }

        // Get unique tags
        const response = await fetch(`http://localhost:5001/api/admin/tags/unique?${params.toString()}`, {
            headers: {
                'Cookie': request.headers.get('cookie') || ''
            }
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data);
        } else {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        console.error('Error fetching unique tags:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

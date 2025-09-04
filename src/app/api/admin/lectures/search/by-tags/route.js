import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tags = searchParams.get('tags');
        const courseId = searchParams.get('course_id');

        if (!tags) {
            return NextResponse.json(
                { message: 'Tags parameter is required' },
                { status: 400 }
            );
        }

        // Build query parameters
        const params = new URLSearchParams();
        params.set('tags', tags);
        if (courseId) {
            params.set('course_id', courseId);
        }

        // Search lectures by tags
        const response = await fetch(`http://localhost:5001/api/admin/lectures/search/by-tags?${params.toString()}`, {
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
        console.error('Error searching lectures by tags:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

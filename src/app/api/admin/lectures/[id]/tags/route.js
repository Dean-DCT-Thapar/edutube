import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    try {
        const { id } = params;
        const { tags } = await request.json();

        if (!tags || !Array.isArray(tags)) {
            return NextResponse.json(
                { message: 'Tags array is required' },
                { status: 400 }
            );
        }

        // Mock response - replace with actual database call
        const mockLectureWithTags = {
            id: parseInt(id),
            title: "Sample Lecture",
            tags: tags.map((tag, index) => ({
                id: Date.now() + index,
                tag: tag.toLowerCase(),
                created_at: new Date().toISOString()
            }))
        };

        return NextResponse.json({
            message: 'Tags added successfully',
            lecture: mockLectureWithTags
        });

    } catch (error) {
        console.error('Error adding tags to lecture:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        const { id } = params;

        // Mock response - replace with actual database call
        const mockTags = [
            { id: 1, tag: "javascript", created_at: "2024-01-20T10:00:00Z" },
            { id: 2, tag: "beginner", created_at: "2024-01-20T10:00:00Z" },
            { id: 3, tag: "variables", created_at: "2024-01-20T10:00:00Z" }
        ];

        return NextResponse.json({
            lecture_id: parseInt(id),
            title: "Sample Lecture",
            tags: mockTags
        });

    } catch (error) {
        console.error('Error fetching lecture tags:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

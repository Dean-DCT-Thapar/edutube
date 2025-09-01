import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Mock lecture data - replace with actual database calls
        const lectures = [
            {
                id: 1,
                title: "Introduction to Variables",
                description: "Learn about variables and data types",
                chapter_name: "Getting Started",
                chapter_number: 1,
                lecture_number: 1,
                youtube_url: "https://youtube.com/watch?v=example1",
                duration: "25:30",
                course_id: 1,
                created_at: "2024-01-20T10:00:00Z",
                tags: []
            },
            {
                id: 2,
                title: "Functions and Scope",
                description: "Understanding functions in programming",
                chapter_name: "Getting Started", 
                chapter_number: 1,
                lecture_number: 2,
                youtube_url: "https://youtube.com/watch?v=example2",
                duration: "30:45",
                course_id: 1,
                created_at: "2024-01-22T10:00:00Z",
                tags: []
            }
        ];

        return NextResponse.json({
            success: true,
            lectures: lectures,
            total: lectures.length
        });

    } catch (error) {
        console.error('Error fetching lectures:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to fetch lectures',
                error: error.message 
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Mock lecture creation - replace with actual database call
        const newLecture = {
            id: Date.now(), // Mock ID generation
            title: body.title,
            description: body.description,
            chapter_name: body.chapter_name,
            chapter_number: body.chapter_number,
            lecture_number: body.lecture_number,
            youtube_url: body.youtube_url,
            course_id: body.course_id,
            created_at: new Date().toISOString(),
            tags: []
        };

        return NextResponse.json({
            success: true,
            message: 'Lecture created successfully',
            lecture: newLecture
        });

    } catch (error) {
        console.error('Error creating lecture:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to create lecture',
                error: error.message 
            },
            { status: 500 }
        );
    }
}

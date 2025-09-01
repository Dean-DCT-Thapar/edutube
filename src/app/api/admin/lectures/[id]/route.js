import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const lectureId = parseInt(params.id);
        
        // Mock lecture data - replace with actual database call
        const lecture = {
            id: lectureId,
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
        };

        return NextResponse.json({
            success: true,
            lecture: lecture
        });

    } catch (error) {
        console.error('Error fetching lecture:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to fetch lecture',
                error: error.message 
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        const lectureId = parseInt(params.id);
        const body = await request.json();
        
        // Mock lecture update - replace with actual database call
        const updatedLecture = {
            id: lectureId,
            title: body.title,
            description: body.description,
            chapter_name: body.chapter_name,
            chapter_number: body.chapter_number,
            lecture_number: body.lecture_number,
            youtube_url: body.youtube_url,
            course_id: body.course_id,
            created_at: "2024-01-20T10:00:00Z",
            updated_at: new Date().toISOString(),
            tags: []
        };

        return NextResponse.json({
            success: true,
            message: 'Lecture updated successfully',
            lecture: updatedLecture
        });

    } catch (error) {
        console.error('Error updating lecture:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to update lecture',
                error: error.message 
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const lectureId = parseInt(params.id);
        
        // Mock lecture deletion - replace with actual database call
        console.log(`Deleting lecture with ID: ${lectureId}`);

        return NextResponse.json({
            success: true,
            message: 'Lecture deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting lecture:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to delete lecture',
                error: error.message 
            },
            { status: 500 }
        );
    }
}

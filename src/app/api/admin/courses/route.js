import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Mock data for now - replace with actual database calls
        const courses = [
            {
                id: 1,
                name: "Introduction to Programming",
                description: "Learn the basics of programming",
                instructor: "Dr. Smith",
                created_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 2,
                name: "Web Development Fundamentals", 
                description: "HTML, CSS, and JavaScript basics",
                instructor: "Prof. Johnson",
                created_at: "2024-02-01T10:00:00Z"
            },
            {
                id: 3,
                name: "Advanced JavaScript",
                description: "ES6+ features and advanced concepts",
                instructor: "Dr. Wilson",
                created_at: "2024-02-15T10:00:00Z"
            }
        ];

        return NextResponse.json({
            success: true,
            courses: courses,
            total: courses.length
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to fetch courses',
                error: error.message 
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Mock course creation - replace with actual database call
        const newCourse = {
            id: Date.now(), // Mock ID generation
            name: body.name,
            description: body.description,
            instructor: body.instructor,
            created_at: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            message: 'Course created successfully',
            course: newCourse
        });

    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to create course',
                error: error.message 
            },
            { status: 500 }
        );
    }
}

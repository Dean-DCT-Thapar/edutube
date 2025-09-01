import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const courseId = parseInt(params.courseId);
        
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
                tags: [
                    { id: 1, tag: "javascript" },
                    { id: 2, tag: "beginner" },
                    { id: 3, tag: "variables" }
                ]
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
                tags: [
                    { id: 4, tag: "functions" },
                    { id: 5, tag: "scope" },
                    { id: 6, tag: "javascript" }
                ]
            },
            {
                id: 3,
                title: "Control Flow",
                description: "Loops and conditionals",
                chapter_name: "Control Structures",
                chapter_number: 2,
                lecture_number: 1,
                youtube_url: "https://youtube.com/watch?v=example3", 
                duration: "28:15",
                course_id: 1,
                created_at: "2024-01-25T10:00:00Z",
                tags: [
                    { id: 7, tag: "loops" },
                    { id: 8, tag: "conditionals" },
                    { id: 9, tag: "control-flow" }
                ]
            },
            {
                id: 4,
                title: "HTML Fundamentals",
                description: "Basic HTML structure and elements",
                chapter_name: "Web Basics",
                chapter_number: 1,
                lecture_number: 1,
                youtube_url: "https://youtube.com/watch?v=example4",
                duration: "35:20",
                course_id: 2,
                created_at: "2024-02-05T10:00:00Z",
                tags: [
                    { id: 10, tag: "html" },
                    { id: 11, tag: "web-development" },
                    { id: 12, tag: "beginner" }
                ]
            },
            {
                id: 5,
                title: "ES6 Features",
                description: "Modern JavaScript features",
                chapter_name: "Modern JavaScript",
                chapter_number: 1,
                lecture_number: 1,
                youtube_url: "https://youtube.com/watch?v=example5",
                duration: "40:10",
                course_id: 3,
                created_at: "2024-02-20T10:00:00Z",
                tags: [
                    { id: 13, tag: "es6" },
                    { id: 14, tag: "arrow-functions" },
                    { id: 15, tag: "destructuring" }
                ]
            }
        ];

        // Filter lectures by course ID
        const courseLectures = lectures.filter(lecture => lecture.course_id === courseId);

        return NextResponse.json({
            success: true,
            lectures: courseLectures,
            total: courseLectures.length,
            course_id: courseId
        });

    } catch (error) {
        console.error('Error fetching course lectures:', error);
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

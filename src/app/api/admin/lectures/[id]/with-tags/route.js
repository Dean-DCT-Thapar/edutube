import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const lectureData = await request.json();

        // Update lecture with tags using the backend API
        const response = await fetch(`http://localhost:5000/api/admin/lectures/${id}/with-tags`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || ''
            },
            body: JSON.stringify(lectureData)
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json(data);
        } else {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        console.error('Error updating lecture with tags:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

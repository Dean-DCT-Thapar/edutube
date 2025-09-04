import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    try {
        const { id, tagId } = await params;

        // Remove specific tag from lecture
        const response = await fetch(`http://localhost:5001/api/admin/lectures/${id}/tags/${tagId}`, {
            method: 'DELETE',
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
        console.error('Error removing tag from lecture:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

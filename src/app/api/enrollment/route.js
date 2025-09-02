import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/api/enrollment/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Enrollment API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/api/enrollment/unenroll`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Unenrollment API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');
        
        if (!adminToken) {
            console.log('No admin token found in cookies');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        
        console.log('Fetching course template:', id);
        
        const response = await fetch(`http://localhost:5000/api/admin/course-templates/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Backend response not ok:', response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to fetch course template' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('Error in course-template API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');
        
        if (!adminToken) {
            console.log('No admin token found in cookies');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        
        console.log('Updating course template:', id, body);
        
        const response = await fetch(`http://localhost:5000/api/admin/course-templates/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error('Backend response not ok:', response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to update course template' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('Error in course-template API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');
        
        if (!adminToken) {
            console.log('No admin token found in cookies');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        
        console.log('Deleting course template:', id);
        
        const response = await fetch(`http://localhost:5000/api/admin/course-templates/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Backend response not ok:', response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to delete course template' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('Error in course-template API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

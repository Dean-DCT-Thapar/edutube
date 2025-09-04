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
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        
        console.log('Fetching chapters for course instance:', id, 'with params:', queryString);
        
        const response = await fetch(`http://localhost:5001/api/admin/course-instances/${id}/chapters${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Backend response not ok:', response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('Error in course-instance chapters API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

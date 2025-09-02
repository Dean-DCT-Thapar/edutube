import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');
        
        if (!adminToken) {
            console.log('No admin token found in cookies');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        
        console.log('Fetching users with params:', queryString);
        
        const response = await fetch(`http://localhost:5000/api/admin/users${queryString ? `?${queryString}` : ''}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Backend response not ok:', response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('Error in users API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');
        
        if (!adminToken) {
            console.log('No admin token found in cookies');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        
        console.log('Creating user:', body);
        
        const response = await fetch('http://localhost:5000/api/admin/users', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error('Backend response not ok:', response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to create user' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('Error in users API route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

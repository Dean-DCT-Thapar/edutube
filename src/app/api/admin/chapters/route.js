import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const instanceId = searchParams.get('instanceId');
    
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401 }
      );
    }
    
    const queryParams = new URLSearchParams();
    if (courseId) queryParams.set('courseId', courseId);
    if (instanceId) queryParams.set('instanceId', instanceId);
    
    const response = await axios.get(`${BACKEND_URL}/api/admin/chapters/dropdown?${queryParams}`, {
      headers: {
        'Authorization': authHeader
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Admin Chapters API error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to fetch chapters' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header missing' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    const response = await axios.post(`${BACKEND_URL}/api/admin/chapters`, body, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Admin Create Chapter API error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to create chapter' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

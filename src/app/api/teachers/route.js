import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const search = searchParams.get('search') || '';
    
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });
    
    const response = await axios.get(`${BACKEND_URL}/api/teachers?${queryParams}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Teachers API error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to fetch teachers' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

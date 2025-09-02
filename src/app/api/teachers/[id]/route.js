import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const response = await axios.get(`${BACKEND_URL}/api/teachers/${id}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Teacher API error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to fetch teacher' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

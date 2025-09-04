import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

export async function GET(request, { params }) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');
    
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const response = await axios.get(`${BACKEND_URL}/api/admin/chapters/${id}`, {
      headers: {
        'Authorization': `Bearer ${adminToken.value}`
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Admin Get Chapter API error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to fetch chapter' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');
    
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const body = await request.json();
    
    const response = await axios.put(`${BACKEND_URL}/api/admin/chapters/${id}`, body, {
      headers: {
        'Authorization': `Bearer ${adminToken.value}`,
        'Content-Type': 'application/json'
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Admin Update Chapter API error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to update chapter' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');
    
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const response = await axios.delete(`${BACKEND_URL}/api/admin/chapters/${id}`, {
      headers: {
        'Authorization': `Bearer ${adminToken.value}`
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Admin Delete Chapter API error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to delete chapter' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

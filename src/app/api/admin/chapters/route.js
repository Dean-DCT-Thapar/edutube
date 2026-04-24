import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import apiClient from '@/utils/apiClient';;

import { getBackendUrl } from "@/utils/apiConfig";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const instanceId = searchParams.get('instanceId');
    
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');
    
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const queryParams = new URLSearchParams();
    if (courseId) queryParams.set('courseId', courseId);
    if (instanceId) queryParams.set('instanceId', instanceId);
    
    const response = await apiClient.get(`/api/admin/chapters/dropdown?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${adminToken.value}`
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
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');
    
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    const response = await apiClient.post(`/api/admin/chapters`, body, {
      headers: {
        'Authorization': `Bearer ${adminToken.value}`,
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

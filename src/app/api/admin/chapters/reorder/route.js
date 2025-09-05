import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';;
import { cookies } from 'next/headers';

import { getBackendUrl } from "@/utils/apiConfig";

export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');
    
    if (!adminToken) {
      return NextResponse.json(
        { message: 'Admin authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    console.log('Next.js API - Reorder chapters request body:', body);
    
    const response = await apiClient.put(`/api/admin/chapters/reorder`, body, {
      headers: {
        'Authorization': `Bearer ${adminToken.value}`,
        'Content-Type': 'application/json'
      }
    });
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Admin Reorder Chapters API error:', error);
    console.error('Error response data:', error.response?.data);
    
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message || 'Failed to reorder chapters' },
        { status: error.response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

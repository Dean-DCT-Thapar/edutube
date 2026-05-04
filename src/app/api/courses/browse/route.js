import apiClient from '@/utils/apiClient';;
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const response = await apiClient.get(`/api/courses/browse`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching courses for browsing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' }, 
      { status: error.response?.status || 500 }
    );
  }
}

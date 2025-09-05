import apiClient from '@/utils/apiClient';;
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const response = await apiClient.get(`/api/courses/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching course instance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course instance' }, 
      { status: error.response?.status || 500 }
    );
  }
}

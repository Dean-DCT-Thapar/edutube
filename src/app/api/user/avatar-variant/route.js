import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get('adminToken') || cookieStore.get('accessToken');
};

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: 'No token found' }, { status: 401 });
    }

    const response = await apiClient.get('/avatar-variant', {
      headers: { Authorization: `Bearer ${token.value}` }
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || error.message || 'Internal server error';
    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(request) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ message: 'No token found' }, { status: 401 });
    }

    const body = await request.json();
    const response = await apiClient.put('/avatar-variant', body, {
      headers: { Authorization: `Bearer ${token.value}` }
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const status = error?.response?.status || 500;
    const message = error?.response?.data?.message || error.message || 'Internal server error';
    return NextResponse.json({ message }, { status });
  }
}


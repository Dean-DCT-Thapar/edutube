import { NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/apiConfig';
import { cookies } from 'next/headers';

const forward = async (request, method, suffix = '') => {
  const backendUrl = getBackendUrl();
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');

  if (!token) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const url = new URL(request.url);
  const body = method === 'GET' || method === 'DELETE' ? null : await request.text();

  const response = await fetch(`${backendUrl}/api/teacher/course-requests/${suffix || url.pathname.split('/').pop()}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
};

export async function GET(request, { params }) {
  try {
    return await forward(request, 'GET', params.id);
  } catch (error) {
    console.error('[teacher course-requests GET]', error);
    return NextResponse.json({ message: 'Failed to fetch request' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.text();

    const response = await fetch(`${backendUrl}/api/teacher/course-requests/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[teacher course-requests PUT]', error);
    return NextResponse.json({ message: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const backendUrl = getBackendUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const response = await fetch(`${backendUrl}/api/teacher/course-requests/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[teacher course-requests DELETE]', error);
    return NextResponse.json({ message: 'Failed to delete request' }, { status: 500 });
  }
}

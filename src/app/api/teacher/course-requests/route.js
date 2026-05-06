import { getBackendUrl } from '@/utils/apiConfig';
import { cookies } from 'next/headers';

// GET /api/teacher/course-requests - List the current teacher's requests
export async function GET(request) {
  try {
    const backendUrl = getBackendUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

    if (!token) {
      return Response.json({ message: 'Authentication required' }, { status: 401 });
    }

    const response = await fetch(`${backendUrl}/api/teacher/course-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('[course-requests GET]', error);
    return Response.json(
      { message: 'Failed to fetch course requests' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/course-requests - Create a new course request
export async function POST(request) {
  try {
    const backendUrl = getBackendUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

    if (!token) {
      return Response.json({ message: 'Authentication required' }, { status: 401 });
    }
    
    const body = await request.json();
    
    const response = await fetch(
      `${backendUrl}/api/teacher/course-requests`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('[course-requests POST]', error);
    return Response.json(
      { message: 'Failed to create course request' },
      { status: 500 }
    );
  }
}

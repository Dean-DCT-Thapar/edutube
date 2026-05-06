import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/utils/apiConfig';

export async function GET(request, { params }) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');

    if (!adminToken) {
      return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
    }

    const response = await fetch(`${getBackendUrl()}/api/admin/course-requests/${params.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[admin course-requests detail GET]', error);
    return NextResponse.json({ message: 'Failed to fetch request' }, { status: 500 });
  }
}

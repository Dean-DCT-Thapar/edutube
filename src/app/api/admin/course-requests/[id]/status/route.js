import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/utils/apiConfig';

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken');

    if (!adminToken) {
      return NextResponse.json({ message: 'Admin authentication required' }, { status: 401 });
    }

    const response = await fetch(`${getBackendUrl()}/api/admin/course-requests/${params.id}/status`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[admin course-requests status PUT]', error);
    return NextResponse.json({ message: 'Failed to update request status' }, { status: 500 });
  }
}

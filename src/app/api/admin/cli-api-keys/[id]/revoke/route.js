import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/utils/apiConfig';

export async function POST(_request, { params }) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const response = await fetch(`${getBackendUrl()}/api/admin/cli-api-keys/${id}/revoke`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const msg = data.message || data.error || 'Failed to revoke key';
            return NextResponse.json({ error: msg, message: msg }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('CLI API key revoke error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

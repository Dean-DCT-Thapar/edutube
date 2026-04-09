import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/utils/apiConfig';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${getBackendUrl()}/api/admin/cli-api-keys`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const msg = data.message || data.error || 'Failed to list CLI API keys';
            return NextResponse.json({ error: msg, message: msg }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('CLI API keys GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('adminToken');

        if (!adminToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const response = await fetch(`${getBackendUrl()}/api/admin/cli-api-keys`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${adminToken.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const msg = data.message || data.error || 'Failed to create CLI API key';
            return NextResponse.json({ error: msg, message: msg }, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('CLI API keys POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

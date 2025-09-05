import { NextResponse } from 'next/server';

import { getBackendUrl } from "@/utils/apiConfig";

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
        }

        const response = await fetch(`${getBackendUrl()}/api/user/data`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('User data API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';;
import { getBackendUrl } from '@/utils/apiConfig';


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const limit = searchParams.get('limit') || '5';

        const backendUrl = `${getBackendUrl()}`;

        const response = await apiClient.get(
            `${backendUrl}/quick-search`,
            {
                params: { query, limit }
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Quick search error:', error);
        return NextResponse.json(
            { suggestions: [] },
            { status: 200 } // Return empty suggestions instead of error
        );
    }
}

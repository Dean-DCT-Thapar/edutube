import { NextResponse } from 'next/server';
import axios from 'axios';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const limit = searchParams.get('limit') || '5';

        const backendUrl = `http://localhost:5001`;

        const response = await axios.get(
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

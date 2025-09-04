import { cookies } from 'next/headers';
import axios from 'axios';
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit') || 5;
        
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await axios.get(`http://localhost:5001/watch-history/recent?limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json(
            { status: 500, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

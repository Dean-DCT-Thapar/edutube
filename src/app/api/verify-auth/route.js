import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const WINDOWS_HOST = '172.16.133.80';

export async function GET(request) {
    try {
        const cookieStore = await await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json(
                { status: 401, message: 'Please login to continue', meaning: 'No token found' },
                { status: 401 }
            );
        }

        const response = await axios.get(`http://${WINDOWS_HOST}:5000/verify-auth`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json({
            status: response.status,
            message: response.data.message,
            role: response.data.role
        });
    } catch (error) {
        return NextResponse.json(
            { status: 401, message: 'Please login to continue' },
            { status: 401 }
        );
    }
}
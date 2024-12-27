import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const WINDOWS_HOST = '192.168.29.209';

export async function GET(request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json(
                { status: 401, message: 'No token found' },
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
            message: response.data.message
        });
    } catch (error) {
        return NextResponse.json(
            { status: 401, message: 'Please login to continue' },
            { status: 401 }
        );
    }
}
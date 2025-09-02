import { cookies } from 'next/headers';
import axios from 'axios';
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function GET(request, { params }) {
    try {
        const { lectureId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await axios.get(MODE === 'production' 
            ? `https://still-citadel-95346-111a1dcad6bd.herokuapp.com/getVideoProgress/${lectureId}` 
            : `http://${WINDOWS_HOST}:5000/getVideoProgress/${lectureId}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Get video progress error:', error);
        return NextResponse.json(
            { status: 500, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

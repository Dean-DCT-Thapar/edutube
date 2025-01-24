import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';


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

        const response = await axios.get(`https://still-citadel-95346-111a1dcad6bd.herokuapp.com/verify-auth`, {
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
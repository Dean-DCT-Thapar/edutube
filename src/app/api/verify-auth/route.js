import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';


const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json(
                { status: 401, message: 'Please login to continue', meaning: 'No token found' },
                { status: 401 }
            );
        }

        const response = await axios.get(MODE === 'production' 
            ? `https://still-citadel-95346-111a1dcad6bd.herokuapp.com/verify-auth` 
            : `http://${WINDOWS_HOST}:5000/verify-auth`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json({
            status: response.status,
            message: response.data.message,
            role: response.data.role,
            name: response.data.name,
            email: response.data.email,
            id: response.data.id
        });
    } catch (error) {
        return NextResponse.json(
            { status: 401, message: 'Please login to continue' },
            { status: 401 }
        );
    }
}
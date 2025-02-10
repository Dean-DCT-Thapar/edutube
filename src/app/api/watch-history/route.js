import { cookies } from 'next/headers';
import axios from 'axios';
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;


export async function POST(request) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if(!token){
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await axios.post(MODE === 'production' 
            ? `https://still-citadel-95346-111a1dcad6bd.herokuapp.com/watch-history` 
            : `http://${WINDOWS_HOST}:5000/watch-history`,{
                videoId: body.videoId,
                currentTime: body.currentTime,
                progress: body.progress,
            } , {
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

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await axios.get(MODE === 'production' 
            ? `https://still-citadel-95346-111a1dcad6bd.herokuapp.com/watch-history` 
            : `http://${WINDOWS_HOST}:5000/watch-history`, {
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
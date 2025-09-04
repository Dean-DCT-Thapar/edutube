import { cookies } from 'next/headers';
import axios from 'axios';
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;


export async function POST(request) {
    try {
        const body = await request.json();
        console.log('API route received body:', body);
        
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if(!token){
            console.log('No token found in cookies');
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        console.log('Sending to backend:', {
            lecture_id: body.lecture_id,
            progress: body.progress
        });

        const backendUrl = `http://localhost:5001/watch-history`;
        
        console.log('Backend URL:', backendUrl);

        const response = await axios.post(backendUrl, {
            lecture_id: body.lecture_id,
            progress: body.progress
        }, {
            headers: {
                Authorization: `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Backend response:', response.status, response.data);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Watch history API error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        return NextResponse.json(
            { 
                status: 500, 
                message: error.response?.data?.message || error.message || 'Internal server error',
                details: error.response?.data 
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            console.log('GET watch-history: No token found in cookies');
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const backendUrl = `http://localhost:5001/watch-history`;
        
        console.log('GET watch-history: Backend URL:', backendUrl);

        const response = await axios.get(backendUrl, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        console.log('GET watch-history: Backend response:', response.status);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('GET watch-history API error:', error);
        console.error('GET Error response:', error.response?.data);
        console.error('GET Error status:', error.response?.status);
        return NextResponse.json(
            { 
                status: 500, 
                message: error.response?.data?.message || error.message || 'Internal server error',
                details: error.response?.data 
            },
            { status: 500 }
        );
    }
}
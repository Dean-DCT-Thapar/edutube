import { cookies } from 'next/headers';
import axios from 'axios';
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;


export async function GET(request, { params }) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        const { id } = await params;

        if(!token){
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await axios.get(`http://localhost:5001/getVideoProgress/${id}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        return NextResponse.json(response.data, { status: response.status });

        
    } catch (error) {
        return NextResponse.json(
            { status: 500, message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
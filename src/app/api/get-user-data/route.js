import { cookies } from 'next/headers';
import axios from 'axios';
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if(!token){
            return NextResponse.json({ status: 401, message: 'No token found' }, { status: 401 });
        }

        const response = await axios.get(`https://still-citadel-95346-111a1dcad6bd.herokuapp.com/get-user-data`, {
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
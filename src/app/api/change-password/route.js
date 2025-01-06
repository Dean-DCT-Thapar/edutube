import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const WINDOWS_HOST = '192.168.29.209';

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'Please login to continue', meaning: 'No token found' }, { status: 401 });
        }

        const body = await request.json();

        const response = await axios.post(`http://${WINDOWS_HOST}:5000/change-password`, 
            {
                oldPassword: body.oldPassword,
                newPassword: body.newPassword,
            },
            {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            }
        );

        return NextResponse.json({ status: 200, message: "Password changed successfully" }, { status: 200 });

    } catch (error) {
        if(error.response.status === 401){
            return NextResponse.json({ status: 401, message: "Invalid current password" }, { status: 401 });
        }else{
            return NextResponse.json({ status: 500, message: "There was an error changing your password" }, { status: 500 });
        }
    }
}
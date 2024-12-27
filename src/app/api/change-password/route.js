import { NextResponse } from 'next/server';
import axios from 'axios';

const WINDOWS_HOST = '192.168.29.209';

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await axios.post(`http://${WINDOWS_HOST}:5000/change-password`, {
            oldPassword: body.currentPassword,
            newPassword: body.newPassword,
        });

        if(response.data.status == 401){
            return NextResponse.json({ status: 401, message: "Invalid current password" }, { status: 401 });
        }else{
            return NextResponse.json({ status: 200, message: "Password changed successfully" }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
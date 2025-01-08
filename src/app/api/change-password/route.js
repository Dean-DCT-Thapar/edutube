import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { cookies } from 'next/headers';

const WINDOWS_HOST = '172.16.133.80';

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'Please login to continue', meaning: 'No token found' }, { status: 401 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken');

        if (!token) {
            return NextResponse.json(
                { status: 401, message: 'No token found' },
                { status: 401 }
            );
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
        const response = await axios.post(`http://${WINDOWS_HOST}:5000/change-password`, 
            {
                oldPassword: body.currentPassword,
                newPassword: body.newPassword,
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            }
        );

        return NextResponse.json({
            status: response.status,
            message: response.data.message
        });

    } catch (error) {
        if (error.response) {
            return NextResponse.json(
                { status: error.response.status, message: error.response.data.message },
                { status: error.response.status }
            );
        }
        return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
    }
}
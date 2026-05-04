import { NextResponse } from 'next/server';
import apiClient from '@/utils/apiClient';

export async function POST(request) {
    try {
        const refreshCookie = request.cookies.get('refreshToken');
        const hadAdminToken = Boolean(request.cookies.get('adminToken'));

        if (!refreshCookie?.value) {
            return NextResponse.json(
                { status: 401, message: 'Refresh token not found' },
                { status: 401 }
            );
        }

        const backendResponse = await apiClient.post(
            '/api/auth/refresh-token',
            {},
            {
                headers: {
                    Cookie: `refreshToken=${refreshCookie.value}`
                }
            }
        );

        const accessToken = backendResponse.data?.accessToken;
        if (!accessToken) {
            return NextResponse.json(
                { status: 500, message: 'Refresh endpoint returned no access token' },
                { status: 500 }
            );
        }

        const isHttps = request.headers.get('x-forwarded-proto') === 'https' ||
            request.url.startsWith('https://');
        const cookieOptions = {
            httpOnly: true,
            secure: isHttps,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24
        };

        const response = NextResponse.json({ success: true }, { status: 200 });
        if (hadAdminToken) {
            response.cookies.set('adminToken', accessToken, cookieOptions);
        } else {
            response.cookies.set('accessToken', accessToken, cookieOptions);
        }

        return response;
    } catch (error) {
        return NextResponse.json(
            {
                status: error.response?.status || 401,
                message: error.response?.data?.message || 'Unable to refresh access token'
            },
            { status: error.response?.status || 401 }
        );
    }
}


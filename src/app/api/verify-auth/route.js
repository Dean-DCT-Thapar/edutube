import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import apiClient from '@/utils/apiClient';;


const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken');
        const adminToken = cookieStore.get('adminToken');
        
        // Use whichever token exists
        const token = adminToken || accessToken;

        if (!token) {
            return NextResponse.json(
                { status: 401, message: 'Please login to continue', meaning: 'No token found' },
                { status: 401 }
            );
        }

        const response = await apiClient.get(`/verify-auth`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        const result = NextResponse.json({
            status: response.status,
            message: response.data.message,
            role: response.data.role,
            actualRole: response.data.actualRole,
            activeRole: response.data.activeRole,
            name: response.data.name,
            actualName: response.data.actualName,
            email: response.data.email,
            id: response.data.id,
            actorId: response.data.actorId,
            actor: response.data.actor,
            effectiveUser: response.data.effectiveUser,
            viewMode: response.data.viewMode
        });

        result.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        return result;
    } catch (error) {
        return NextResponse.json(
            { status: 401, message: 'Please login to continue' },
            { status: 401 }
        );
    }
}
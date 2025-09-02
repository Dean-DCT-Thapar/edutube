import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken');
        const adminToken = cookieStore.get('adminToken');
        
        return NextResponse.json({
            accessToken: accessToken ? 'Present' : 'Missing',
            adminToken: adminToken ? 'Present' : 'Missing',
            accessTokenValue: accessToken?.value ? accessToken.value.substring(0, 20) + '...' : 'N/A',
            adminTokenValue: adminToken?.value ? adminToken.value.substring(0, 20) + '...' : 'N/A',
            allCookies: Object.fromEntries(
                Array.from(cookieStore.getAll()).map(cookie => [cookie.name, cookie.value.substring(0, 20) + '...'])
            )
        });
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}

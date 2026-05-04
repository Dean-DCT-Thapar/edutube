import apiClient from '@/utils/apiClient';;
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;

  try{
    const response = await apiClient.get(`/api/courses/${id}`);
    return NextResponse.json(response.data);
  }catch(error){
    console.error('API Error:', error);
    return NextResponse.json({error : error.message}, { status: 500 });
  }
}

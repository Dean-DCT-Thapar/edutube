import axios from 'axios';
import { NextResponse } from 'next/server';

const WINDOWS_HOST = process.env.WINDOWS_HOST;
const MODE = process.env.MODE;

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const response = await axios.get(MODE === 'production' 
        ? `https://still-citadel-95346-111a1dcad6bd.herokuapp.com/api/courses/${id}` 
        : `http://${WINDOWS_HOST}:5000/api/courses/${id}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching course instance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course instance' }, 
      { status: error.response?.status || 500 }
    );
  }
}

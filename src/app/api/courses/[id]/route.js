import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;

  try{
    const response = await axios.get(`https://still-citadel-95346-111a1dcad6bd.herokuapp.com/courses/${id}`);
    return NextResponse.json(response.data);
  }catch(error){
    return NextResponse.json({error : error.stack})
  }
}

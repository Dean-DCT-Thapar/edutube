// app/api/search/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("type") || "";

  const response = await axios.get(`https://still-citadel-95346-111a1dcad6bd.herokuapp.com/search`, {
    params: { keyword: query, type: category },
  });

  if (category === "") {
    const results = response.data.map(item => ({
      course_id: item.course_id,
      course_name: item.course_name,
      teacher_id: item.teacher_id,
      teacher_name: item.teacher_name,
      lecture_id: item.lecture_id,
      lecture_title: item.lecture_title,
      chapter_number: item.chapter_number,
      lecture_number: item.lecture_number,
      type: item.type
    }));

    console.log(results);
    return NextResponse.json(results);

  } else if (category === "lectures") {
    const results = response.data.map(item => ({
      id: item.id,
      lecture_title: item.lecture_title,
      chapter_number: item.chapter_number,
      lecture_number: item.lecture_number,
      course_name: item.course_name,
      teacher_name: item.teacher_name,
      teacher_id: item.teacher_id,
      type : item.type
    }));

    console.log(results);
    return NextResponse.json(results);

  } else if (category === "courses") {
    const results = response.data.map(item => ({
      id: item.course_id,
      course_name: item.course_name,
      teacher_id: item.teacher_id,
      teacher_name: item.teacher_name,
      type : item.type
    }));

    console.log(results);
    return NextResponse.json(results);

  } else if (category === "teachers") {
    const results = response.data.map(item => ({
      id: item.teacher_id,
      teacher_name: item.teacher_name,
      type : item.type
    }));

    console.log(results);
    return NextResponse.json(results);
  }
}
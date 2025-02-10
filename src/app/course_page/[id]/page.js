'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import TopBar from '../../component/TopBar'
import SideBar from '../../component/SideBar'
import VidSideBar from '../../component/VidSideBar'
import VideoDisplay from '@/app/component/VideoDisplay'
import L_Header from "@/app/component/L_Header"
import axios from 'axios'
import { LinearProgress } from '@mui/material';

const CoursePage = ({ params }) => {
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(false);
  const courseId = React.use(params).id
  const chapterNumber = new URLSearchParams(window.location.search).get('chapter');
  const lectureNumber = new URLSearchParams(window.location.search).get('lecture');

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/courses/${courseId}`)
        console.log(response.data);
        setCourseData(response.data)
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setLoading(false);
      }
    }

    fetchCourseData()
  }, [courseId])

  const videoDetails = useMemo(() => {
    if (courseData) {
      const chapter = courseData.find(ch => ch.chapter_number === parseInt(chapterNumber));
      if (chapter) {
        const lecture = chapter.lectures.find(lec => lec.lecture_number === parseInt(lectureNumber));
        return lecture ? {id:lecture.lecture_id, title: lecture.lecture_title, code: lecture.lecture_path.split('v=')[1] } : null;
      }
    }
    return null;
  }, [courseData, chapterNumber, lectureNumber]);

  return (
    <div className="min-h-screen bg-white">
      <L_Header />
      {loading && <LinearProgress />}
      <div className="flex">
        {courseData && (
          <>
            <VidSideBar course_data={courseData} course_id={courseId} />
            
            {!chapterNumber && !lectureNumber && (
              <div className="course-overview">
                <h1 style={{color:"black"}}>Course Overview</h1>
                <p>{courseData.overview}</p>
              </div>
            )}
          </>
        )}
        <main className="flex-1 p-8 text-black">
          {videoDetails && (
            <VideoDisplay lec_id={videoDetails.id} heading={videoDetails.title} video_code={videoDetails.code} />
          )}
        </main>
      </div>
    </div>
  )
}

export default CoursePage

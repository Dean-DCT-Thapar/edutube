'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import TopBar from '../../component/TopBar'
import SideBar from '../../component/SideBar'
import Footer from '../../component/Footer'
import VideoDisplay from '@/app/component/VideoDisplay'
import { 
  PlayArrowRounded,
  MenuBookRounded,
  AccessTimeRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  VideoLibraryRounded,
  ArrowBackRounded,
  CheckCircleRounded
} from '@mui/icons-material'
import Link from 'next/link'

const CoursePage = ({ params }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedChapters, setExpandedChapters] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [checkingEnrollment, setCheckingEnrollment] = useState(true)
  
  // Get URL parameters
  const courseId = React.use(params).id
  const chapterNumber = searchParams.get('chapter')
  const lectureNumber = searchParams.get('lecture')

  // Fetch course data
  const fetchCourseData = useCallback(async () => {
    if (!courseId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`/api/courses/${courseId}`)
      setCourseData(response.data)
      
      // Auto-expand current chapter
      if (chapterNumber) {
        setExpandedChapters(prev => ({
          ...prev,
          [parseInt(chapterNumber)]: true
        }))
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
      setError('Failed to load course data')
      toast.error('Failed to load course data')
    } finally {
      setLoading(false)
    }
  }, [courseId, chapterNumber])

  // Check enrollment status
  const checkEnrollmentStatus = useCallback(async () => {
    if (!courseId) return
    
    setCheckingEnrollment(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await axios.get(`/api/enrollment/check/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setIsEnrolled(response.data.isEnrolled)
      } else {
        setIsEnrolled(false)
      }
    } catch (error) {
      console.error('Error checking enrollment:', error)
      setIsEnrolled(false)
    } finally {
      setCheckingEnrollment(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchCourseData()
    checkEnrollmentStatus()
  }, [fetchCourseData, checkEnrollmentStatus])

  // Get current video details
  const videoDetails = useMemo(() => {
    if (!courseData || !chapterNumber || !lectureNumber) return null
    
    const chapter = courseData.find(ch => ch.chapter_number === parseInt(chapterNumber))
    if (!chapter) return null
    
    const lecture = chapter.lectures.find(lec => lec.lecture_number === parseInt(lectureNumber))
    if (!lecture) return null
    
    return {
      id: lecture.lecture_id,
      title: lecture.lecture_title,
      code: lecture.lecture_path.split('v=')[1],
      chapter: chapter.chapter_name,
      duration: lecture.duration || '0:00'
    }
  }, [courseData, chapterNumber, lectureNumber])

  // Toggle chapter expansion
  const toggleChapter = useCallback((chapterNum) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterNum]: !prev[chapterNum]
    }))
  }, [])

  // Get course overview
  const courseOverview = useMemo(() => {
    if (!courseData || courseData.length === 0) return null
    
    const totalLectures = courseData.reduce((acc, chapter) => acc + chapter.lectures.length, 0)
    const totalDuration = courseData.reduce((acc, chapter) => {
      return acc + chapter.lectures.reduce((chAcc, lecture) => {
        // Parse duration if available
        return chAcc + (lecture.duration ? 0 : 5) // Default 5 min per lecture
      }, 0)
    }, 0)
    
    return {
      title: courseData[0]?.course_name || 'Course',
      instructor: courseData[0]?.instructor_name || 'Instructor',
      totalChapters: courseData.length,
      totalLectures,
      totalDuration: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
      description: courseData[0]?.description || 'Course description not available.'
    }
  }, [courseData])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Loading skeleton */}
              <div className="animate-pulse space-y-6">
                <div className="bg-gray-200 h-8 w-2/3 rounded"></div>
                <div className="bg-gray-200 h-64 rounded-lg"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-gray-200 h-96 rounded-lg"></div>
                  <div className="bg-gray-200 h-96 rounded-lg"></div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center py-12">
                <div className="text-red-400 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h3>
                <p className="text-gray-600 mb-6">
                  {error || 'The course you are looking for could not be found.'}
                </p>
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                >
                  <ArrowBackRounded className="mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar />
      
      <div className="flex flex-1 min-h-0">
        <SideBar />
        
        <main className="flex-1 transition-all duration-300 ease-in-out relative">
          {/* Course Header */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-primary-700 transition-colors"
                >
                  <ArrowBackRounded className="mr-1" />
                  Back to Dashboard
                </Link>
                <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                    {courseOverview?.title}
                  </h1>
                  {!checkingEnrollment && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isEnrolled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isEnrolled ? 'Enrolled' : 'Preview Mode'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <MenuBookRounded />
              </button>
            </div>
          </div>

          <div className="flex flex-1 min-h-0 relative">
            {/* Course Content Sidebar - scrollable */}
            <div className={`
              absolute lg:relative top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-30
              transform transition-transform duration-300 ease-in-out flex flex-col
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1 rounded text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
                {courseOverview && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <VideoLibraryRounded className="text-xs" />
                      <span>{courseOverview.totalChapters} Chapters • {courseOverview.totalLectures} Lectures</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AccessTimeRounded className="text-xs" />
                      <span>{courseOverview.totalDuration}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {courseData.map((chapter) => (
                  <div key={`chapter-${chapter.chapter_number}`} className="border-b border-gray-100">
                    <button
                      onClick={() => toggleChapter(chapter.chapter_number)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          Chapter {chapter.chapter_number}: {chapter.chapter_name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {chapter.lectures.length} lectures
                        </p>
                      </div>
                      {expandedChapters[chapter.chapter_number] ? 
                        <ExpandLessRounded className="text-gray-400" /> : 
                        <ExpandMoreRounded className="text-gray-400" />
                      }
                    </button>
                    {expandedChapters[chapter.chapter_number] && (
                      <div className="bg-gray-50">
                        {chapter.lectures.map((lecture) => {
                          const isActive = parseInt(chapterNumber) === chapter.chapter_number && 
                                          parseInt(lectureNumber) === lecture.lecture_number
                          return (
                            <Link
                              key={`lecture-${chapter.chapter_number}-${lecture.lecture_number}`}
                              href={`/course_page/${courseId}?chapter=${chapter.chapter_number}&lecture=${lecture.lecture_number}`}
                              onClick={() => setSidebarOpen(false)}
                              className={`
                                block px-6 py-3 text-sm border-l-2 transition-all duration-200
                                ${isActive 
                                  ? 'border-primary-600 bg-primary-50 text-primary-700' 
                                  : 'border-transparent hover:border-gray-300 hover:bg-gray-100 text-gray-700'
                                }
                              `}
                            >
                              <div className="flex items-center space-x-3">
                                {isActive ? (
                                  <CheckCircleRounded className="text-primary-600 text-sm" />
                                ) : (
                                  <PlayArrowRounded className="text-gray-400 text-sm" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {lecture.lecture_title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {lecture.duration || '5:00'}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
              />
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 min-h-0 overflow-auto">
              {/* Video Loading Skeleton */}
              {videoDetails === undefined ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-full max-w-3xl mx-auto">
                    <div className="aspect-video bg-gray-200 animate-pulse rounded-lg mb-8"></div>
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : videoDetails ? (
                <div className="h-full">
                  <VideoDisplay 
                    lec_id={videoDetails.id} 
                    heading={videoDetails.title} 
                    video_code={videoDetails.code}
                  />
                </div>
              ) : (
                /* Course Overview */
                <div className="p-6 lg:p-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <VideoLibraryRounded className="text-3xl text-primary-600" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                          {courseOverview.title}
                        </h1>
                        <p className="text-lg text-gray-600">
                          by {courseOverview.instructor}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <MenuBookRounded className="text-2xl text-primary-600 mb-2 mx-auto" />
                          <p className="text-sm font-medium text-gray-900">{courseOverview.totalChapters}</p>
                          <p className="text-xs text-gray-600">Chapters</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <VideoLibraryRounded className="text-2xl text-primary-600 mb-2 mx-auto" />
                          <p className="text-sm font-medium text-gray-900">{courseOverview.totalLectures}</p>
                          <p className="text-xs text-gray-600">Lectures</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <AccessTimeRounded className="text-2xl text-primary-600 mb-2 mx-auto" />
                          <p className="text-sm font-medium text-gray-900">{courseOverview.totalDuration}</p>
                          <p className="text-xs text-gray-600">Duration</p>
                        </div>
                      </div>

                      <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Course</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {courseOverview.description}
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-4">Ready to start learning?</p>
                        <button
                          onClick={() => {
                            if (courseData[0]?.lectures[0]) {
                              router.push(`/course_page/${courseId}?chapter=1&lecture=1`)
                            }
                          }}
                          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                        >
                          <PlayArrowRounded className="mr-2" />
                          Start Course
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CoursePage

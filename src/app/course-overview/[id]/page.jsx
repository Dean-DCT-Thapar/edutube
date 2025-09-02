'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import SideBar from '../../component/SideBar';
import TopBar from '../../component/TopBar';
import { API_ENDPOINTS } from '@/utils/apiConfig';
import { isAuthenticated } from '@/utils/auth';
import {
    PlayCircleOutlineRounded,
    SchoolRounded,
    PersonRounded,
    AccessTimeRounded,
    BookmarkRounded,
    CheckCircleRounded,
    ArrowBackRounded,
    PlayArrowRounded,
    RemoveCircleOutlineRounded
} from '@mui/icons-material';

export default function CourseOverview() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id;

    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseDataLoaded, setCourseDataLoaded] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [unenrolling, setUnenrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails();
            checkEnrollmentStatus();
        }
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/courses/${courseId}`);
            const courseData = response.data;
            
            if (courseData && courseData.length > 0) {
                // Extract course info from first chapter
                const firstChapter = courseData[0];
                const courseInfo = {
                    id: courseId,
                    course_name: firstChapter.course_name,
                    instructor_name: firstChapter.instructor_name,
                    course_code: firstChapter.course_code
                };
                
                setCourse(courseInfo);
                setChapters(courseData);
                setCourseDataLoaded(true);
            } else {
                throw new Error('No course data received');
            }
        } catch (error) {
            console.error('Error fetching course details:', error);
            toast.error('Failed to load course details');
            setCourseDataLoaded(false);
        } finally {
            setLoading(false);
        }
    };

    // Check enrollment status using standardized API
    const checkEnrollmentStatus = async () => {
        try {
            // Only check if user is authenticated
            if (!isAuthenticated()) {
                setIsEnrolled(false);
                return;
            }

            const response = await axios.get(API_ENDPOINTS.CHECK_ENROLLMENT(courseId));
            setIsEnrolled(response.data.isEnrolled);
        } catch (error) {
            console.error('Error checking enrollment status:', error);
            // If 401, user needs to login
            if (error.response?.status === 401) {
                setIsEnrolled(false);
            } else {
                console.error('Unexpected error checking enrollment:', error);
            }
        }
    };

    // Handle enrollment with proper error handling and auth flow
    const handleEnroll = async () => {
        try {
            // Check authentication first
            if (!isAuthenticated()) {
                sessionStorage.setItem('returnUrl', window.location.pathname);
                toast.error('Please login to enroll in courses');
                router.push('/login');
                return;
            }

            // Ensure course data is fully loaded
            if (!courseDataLoaded) {
                toast.error('Course data is still loading. Please wait a moment and try again.');
                return;
            }

            setEnrolling(true);
            
            // Only need course_instance_id - backend will handle teacher_id lookup
            await axios.post(API_ENDPOINTS.ENROLL, {
                course_instance_id: parseInt(courseId)
            });

            setIsEnrolled(true);
            await checkEnrollmentStatus(); // Refresh status
            toast.success('Successfully enrolled in course!');
            
        } catch (error) {
            console.error('Error enrolling in course:', error);
            
            // Handle specific error cases
            if (error.response?.status === 401) {
                sessionStorage.setItem('returnUrl', window.location.pathname);
                toast.error('Please login to enroll in courses');
                router.push('/login');
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Already enrolled in this course');
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Failed to enroll in course. Please try again.');
            }
        } finally {
            setEnrolling(false);
        }
    };

    // Handle unenrollment
    const handleUnenroll = async () => {
        try {
            // Ensure course data is fully loaded
            if (!courseDataLoaded) {
                toast.error('Course data is still loading. Please wait a moment and try again.');
                return;
            }

            setUnenrolling(true);
            
            await axios.delete(API_ENDPOINTS.UNENROLL, {
                data: {
                    course_instance_id: parseInt(courseId)
                }
            });

            setIsEnrolled(false);
            await checkEnrollmentStatus(); // Refresh status
            toast.success('Successfully unenrolled from course');
            
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            
            if (error.response?.status === 401) {
                toast.error('Authentication required');
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Failed to unenroll from course. Please try again.');
            }
        } finally {
            setUnenrolling(false);
        }
    };

    const handleStartLearning = () => {
        if (chapters.length > 0 && chapters[0].lectures.length > 0) {
            // Allow access to course content regardless of enrollment status
            router.push(`/course_page/${courseId}?chapter=1&lecture=1`);
        }
    };

    const getTotalLectures = () => {
        return chapters.reduce((total, chapter) => total + chapter.lectures.length, 0);
    };

    const getTotalDuration = () => {
        const totalSeconds = chapters.reduce((total, chapter) => 
            total + chapter.lectures.reduce((chapterTotal, lecture) => 
                chapterTotal + (lecture.duration || 0), 0
            ), 0
        );
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopBar />
                <div className="flex">
                    <SideBar />
                    <main className="flex-1 transition-all duration-300 ease-in-out">
                        <div className="flex justify-center items-center h-96">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            <span className="ml-2 text-gray-600">Loading course details...</span>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopBar />
                <div className="flex">
                    <SideBar />
                    <main className="flex-1 transition-all duration-300 ease-in-out">
                        <div className="max-w-4xl mx-auto px-4 py-8">
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
                                <button
                                    onClick={() => router.back()}
                                    className="text-primary-600 hover:text-primary-700"
                                >
                                    ← Go back
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <div className="flex">
                <SideBar />
                <main className="flex-1 transition-all duration-300 ease-in-out">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        {/* Back button */}
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                        >
                            <ArrowBackRounded className="mr-2" />
                            Back to Browse
                        </button>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main content */}
                            <div className="lg:col-span-2">
                                {/* Course header */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                                    <div className="flex items-start space-x-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                                                <SchoolRounded className="w-10 h-10 text-primary-600" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                {course.course_name}
                                            </h1>
                                            
                                            {course.course_code && (
                                                <p className="text-lg text-gray-600 mb-3">
                                                    Course Code: {course.course_code}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <PersonRounded className="w-5 h-5 mr-2" />
                                                <span>Instructor: {course.instructor_name}</span>
                                            </div>

                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <BookmarkRounded className="w-4 h-4 mr-1" />
                                                    {chapters.length} chapters
                                                </div>
                                                <div className="flex items-center">
                                                    <PlayCircleOutlineRounded className="w-4 h-4 mr-1" />
                                                    {getTotalLectures()} lectures
                                                </div>
                                                <div className="flex items-center">
                                                    <AccessTimeRounded className="w-4 h-4 mr-1" />
                                                    {getTotalDuration()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Course content */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                                    
                                    <div className="space-y-4">
                                        {chapters.map((chapter, chapterIndex) => (
                                            <div key={chapter.chapter_number} className="border border-gray-200 rounded-lg">
                                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                                    <h3 className="font-semibold text-gray-900">
                                                        Chapter {chapter.chapter_number}: {chapter.chapter_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {chapter.lectures.length} lectures
                                                    </p>
                                                </div>
                                                
                                                <div className="p-4">
                                                    <div className="space-y-2">
                                                        {chapter.lectures.map((lecture, lectureIndex) => (
                                                            <div key={lecture.lecture_number} className="flex items-center justify-between py-2">
                                                                <div className="flex items-center">
                                                                    <PlayCircleOutlineRounded className="w-5 h-5 text-gray-400 mr-3" />
                                                                    <span className="text-gray-700">{lecture.lecture_title}</span>
                                                                </div>
                                                                {lecture.duration && (
                                                                    <span className="text-sm text-gray-500">
                                                                        {Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-8">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        {/* Always show Start Learning button */}
                                        <div className="mb-6">
                                            <button
                                                onClick={handleStartLearning}
                                                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center font-medium"
                                            >
                                                <PlayArrowRounded className="mr-2" />
                                                {isEnrolled ? 'Continue Learning' : 'Start Preview'}
                                            </button>
                                        </div>

                                        {/* Enrollment section */}
                                        {isEnrolled ? (
                                            <div className="border-t border-gray-200 pt-6">
                                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                                                    <CheckCircleRounded className="w-6 h-6 text-green-600" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                                                    Enrolled!
                                                </h3>
                                                <p className="text-center text-sm text-gray-600 mb-4">
                                                    This course is saved to your dashboard
                                                </p>
                                                
                                                {/* Unenroll button */}
                                                <button
                                                    onClick={handleUnenroll}
                                                    disabled={unenrolling || !courseDataLoaded}
                                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                                >
                                                    {unenrolling ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Unenrolling...
                                                        </>
                                                    ) : !courseDataLoaded ? (
                                                        <>
                                                            <div className="animate-pulse h-4 w-4 bg-white/20 rounded mr-2"></div>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RemoveCircleOutlineRounded className="mr-2 w-4 h-4" />
                                                            Remove from Dashboard
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="border-t border-gray-200 pt-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    Add to Dashboard
                                                </h3>
                                                <p className="text-gray-600 mb-4 text-sm">
                                                    Enroll to save this course to your dashboard and track your progress.
                                                </p>
                                                <button
                                                    onClick={handleEnroll}
                                                    disabled={enrolling || !courseDataLoaded}
                                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {enrolling ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Enrolling...
                                                        </>
                                                    ) : !courseDataLoaded ? (
                                                        <>
                                                            <div className="animate-pulse h-4 w-4 bg-white/20 rounded mr-2"></div>
                                                            Loading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <BookmarkRounded className="mr-2" />
                                                            Enroll & Save
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Course stats */}
                                        <div className="border-t border-gray-200 mt-6 pt-6">
                                            <h4 className="font-medium text-gray-900 mb-3">Course Information</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Chapters:</span>
                                                    <span className="text-gray-900">{chapters.length}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Lectures:</span>
                                                    <span className="text-gray-900">{getTotalLectures()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Duration:</span>
                                                    <span className="text-gray-900">{getTotalDuration()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

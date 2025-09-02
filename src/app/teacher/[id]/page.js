"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import TopBar from '../../component/TopBar';
import SideBar from '../../component/SideBar';
import {
  PersonRounded,
  EmailRounded,
  SchoolRounded,
  GroupRounded,
  PlayLessonRounded,
  DateRangeRounded,
  TimerRounded,
  BookmarkBorderRounded,
  ArrowBackRounded,
  VerifiedRounded
} from "@mui/icons-material";

export default function TeacherPage() {
  const params = useParams();
  const teacherId = params.id;
  
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeacherDetails();
  }, [teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/teachers/${teacherId}`);
      setTeacher(response.data);
    } catch (error) {
      console.error('Error fetching teacher details:', error);
      setError(error.response?.data?.message || 'Failed to load teacher details');
      toast.error('Failed to load teacher details');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <TopBar />
        <div className="flex flex-1">
          <SideBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <PersonRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Not Found</h2>
                <p className="text-gray-600 mb-6">{error || 'The teacher you are looking for does not exist.'}</p>
                <Link 
                  href="/browse"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <ArrowBackRounded className="mr-2" />
                  Back to Browse
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/browse"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowBackRounded className="mr-2" />
          Back to Browse
        </Link>
      </div>

      {/* Teacher Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {teacher.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{teacher.name}</h1>
                <VerifiedRounded className="text-primary-600" />
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <EmailRounded className="mr-2 text-sm" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <DateRangeRounded className="mr-2 text-sm" />
                <span>Joined {formatDate(teacher.joinedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <SchoolRounded className="text-primary-600 text-3xl mb-2 mx-auto" />
          <div className="text-2xl font-bold text-gray-900">{teacher.stats.totalCourses}</div>
          <div className="text-sm text-gray-600">Courses</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <GroupRounded className="text-green-600 text-3xl mb-2 mx-auto" />
          <div className="text-2xl font-bold text-gray-900">{teacher.stats.totalStudents}</div>
          <div className="text-sm text-gray-600">Students</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <BookmarkBorderRounded className="text-blue-600 text-3xl mb-2 mx-auto" />
          <div className="text-2xl font-bold text-gray-900">{teacher.stats.totalChapters}</div>
          <div className="text-sm text-gray-600">Chapters</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <PlayLessonRounded className="text-purple-600 text-3xl mb-2 mx-auto" />
          <div className="text-2xl font-bold text-gray-900">{teacher.stats.totalLectures}</div>
          <div className="text-sm text-gray-600">Lectures</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <TimerRounded className="text-orange-600 text-3xl mb-2 mx-auto" />
          <div className="text-2xl font-bold text-gray-900">{formatDuration(teacher.stats.totalDuration)}</div>
          <div className="text-sm text-gray-600">Content</div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Courses by {teacher.name}</h2>
          <div className="text-sm text-gray-600">
            {teacher.courses.length} {teacher.courses.length === 1 ? 'course' : 'courses'}
          </div>
        </div>

        {teacher.courses.length === 0 ? (
          <div className="text-center py-12">
            <SchoolRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
            <p className="text-gray-500 text-lg">No courses available</p>
            <p className="text-gray-400">This teacher hasn't created any courses yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {teacher.courses.map((course) => (
              <Link 
                key={course.id} 
                href={`/course-overview/${course.id}`}
                className="block group"
              >
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all duration-200 group-hover:bg-primary-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {course.courseName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="bg-gray-200 px-2 py-1 rounded-md font-medium">
                          {course.courseCode}
                        </span>
                        {course.instanceName && (
                          <span className="text-gray-500">• {course.instanceName}</span>
                        )}
                      </div>
                      {course.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <BookmarkBorderRounded className="mr-2 text-lg" />
                      <span>{course.chaptersCount} chapters</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <PlayLessonRounded className="mr-2 text-lg" />
                      <span>{course.lecturesCount} lectures</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GroupRounded className="mr-2 text-lg" />
                      <span>{course.enrollmentsCount} students</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <TimerRounded className="mr-2 text-lg" />
                      <span>{formatDuration(course.totalDuration)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Created {formatDate(course.createdAt)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}

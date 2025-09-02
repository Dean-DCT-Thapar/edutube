'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import React from 'react';
import TopBar from '../component/TopBar';
import SideBar from '../component/SideBar';
import SkeletonCourseCard from '../component/SkeletonCourseCard';
import SkeletonVidCard from '../component/SkeletonVidCard';
import CurrentDate from '../component/CurrentDate';
import Footer from '../component/Footer';
import Card from '../component/Card';
import { 
  TrendingUpRounded, 
  SchoolRounded, 
  PlayCircleOutlineRounded,
  AccessTimeRounded 
} from '@mui/icons-material';

export default function Dashboard() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const loadingToast = toast.loading('Loading dashboard...', { id: 'dashboard-loading' });

            try {
                const [authResponse, userDataResponse] = await Promise.all([
                    axios.get('/api/verify-auth'),
                    axios.get('/api/get-user-data')
                ]);

                if (authResponse.data.status === 200) {
                    if (authResponse.data.role !== 'student') {
                        throw new Error('Access denied. Students only.');
                    }
                    
                    setUserData(userDataResponse.data);
                    toast.success('Welcome back!', { id: 'dashboard-loading' });
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage, { id: 'dashboard-loading' });
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <TopBar />
                <div className="flex flex-1">
                    <SideBar />
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto space-y-6">
                            <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div>
                            <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <SkeletonCourseCard key={i} />
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const getQuickStats = () => {
        return [
            {
                icon: SchoolRounded,
                label: 'Enrolled Courses',
                value: userData?.enrolled_courses?.length || 0,
                color: 'text-primary-600',
                bgColor: 'bg-primary-100'
            },
            {
                icon: PlayCircleOutlineRounded,
                label: 'Videos Watched',
                value: userData?.videos_watched || 0,
                color: 'text-accent-600',
                bgColor: 'bg-accent-100'
            },
            {
                icon: AccessTimeRounded,
                label: 'Learning Hours',
                value: userData?.learning_hours || 0,
                color: 'text-success-600',
                bgColor: 'bg-success-100'
            },
            {
                icon: TrendingUpRounded,
                label: 'Progress',
                value: `${userData?.overall_progress || 0}%`,
                color: 'text-warning-600',
                bgColor: 'bg-warning-100'
            }
        ];
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <TopBar name={userData?.name} />
            <div className="flex flex-1">
                <SideBar />
                <main className="flex-1 transition-all duration-300 ease-in-out">
                    {/* Hero Section - logo and dashboard text removed */}
                    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500 rounded-full translate-y-32 -translate-x-32"></div>
                        </div>
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                {/* Welcome content - logo and dashboard text removed */}
                                <div className="text-white space-y-4">
                                    <CurrentDate className="text-white" />
                                    <h1 className="text-3xl lg:text-4xl font-bold">
                                        {getGreeting()}, {userData?.name?.split(' ')[0]}! 👋
                                    </h1>
                                    <p className="text-lg text-primary-100 leading-relaxed">
                                        Ready to continue your learning journey? 
                                        You have {userData?.enrolled_courses?.length || 0} courses waiting for you.
                                    </p>
                                    {/* Quick actions */}
                                    <div className="flex flex-wrap gap-3 pt-4">
                                        <button 
                                            onClick={() => router.push('/search')}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-accent-600 text-white hover:bg-accent-500 focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all duration-200"
                                        >
                                            Explore Courses
                                        </button>
                                        <button 
                                            onClick={() => router.push('/watchHistory')}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-white text-primary-800 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all duration-200"
                                        >
                                            Continue Watching
                                        </button>
                                    </div>
                                </div>
                                {/* Stats cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    {getQuickStats().map((stat, index) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20">
                                                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                                                    <Icon className={`text-lg ${stat.color}`} />
                                                </div>
                                                <p className="text-sm text-primary-100 mb-1">{stat.label}</p>
                                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                        {/* Recent Activity */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Recent Activity</h2>
                                <button 
                                    onClick={() => router.push('/watchHistory')}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
                                >
                                    View All
                                </button>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200">
                                <div className="px-6 py-4">
                                    <SkeletonVidCard />
                                </div>
                            </div>
                        </section>

                        {/* Your Courses */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Your Courses</h2>
                                <button 
                                    onClick={() => router.push('/search')}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
                                >
                                    Browse More
                                </button>
                            </div>

                            {userData?.enrolled_courses?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {userData.enrolled_courses.map((course, index) => (
                                        <Card 
                                            key={course.course_instance_id || index}
                                            title={course.course_name}
                                            author={course.teacher_name}
                                            course_id={course.course_instance_id}
                                            thumbnail={course.thumbnail}
                                            duration={course.duration}
                                            progress={course.progress}
                                            enrolledCount={course.enrolled_count}
                                            difficulty={course.difficulty}
                                            lastAccessed={course.last_accessed}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200">
                                    <div className="px-6 py-12 text-center">
                                        <SchoolRounded className="text-4xl text-gray-400 mb-4 mx-auto" />
                                        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                                        <p className="text-gray-600 mb-6">
                                            Start your learning journey by enrolling in your first course!
                                        </p>
                                        <button 
                                            onClick={() => router.push('/search')}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                                        >
                                            Explore Courses
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
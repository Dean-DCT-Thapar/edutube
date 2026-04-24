'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import React from 'react';
import TopBar from '../component/TopBar';
import SideBar from '../component/SideBar';
import SkeletonCourseCard from '../component/SkeletonCourseCard';
import SkeletonVidCard from '../component/SkeletonVidCard';
import CurrentDate from '../component/CurrentDate';
import Footer from '../component/Footer';
import Card from '../component/Card';
import RecentActivityCard from '../component/RecentActivityCard';
import { 
  TrendingUpRounded, 
  SchoolRounded, 
  PlayCircleOutlineRounded,
  AccessTimeRounded,
  VideoLibraryRounded
} from '@mui/icons-material';

export default function Dashboard() {
    const router = useRouter();
    const yourCoursesRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [showAllCourses, setShowAllCourses] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Use cookie-based authentication - no need to pass token
                const [authResponse, userDataResponse] = await Promise.all([
                    frontendApi.verifyAuth(),
                    frontendApi.getUserData()
                ]);

                if (authResponse.status === 200) {
                    if (authResponse.role !== 'student') {
                        throw new Error('Access denied. Students only.');
                    }
                    
                    setUserData(userDataResponse);
                    
                    // Load recent activity
                    loadRecentActivity();
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage);
                
                // Avoid infinite redirect loop
                if (window.location.pathname !== '/login') {
                    router.push('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        const loadRecentActivity = async () => {
            try {
                const response = await frontendApi.get('/api/watch-history/recent?limit=3');
                setRecentActivity(response);
            } catch (error) {
                console.error('Error loading recent activity:', error);
                // Don't show error toast for this as it's not critical
            } finally {
                setActivityLoading(false);
            }
        };

        loadData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
                <TopBar />
                <div className="flex flex-1 min-w-0">
                    <SideBar />
                    <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
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

    const handleStatClick = (label) => {
        if (label === 'Enrolled Courses') {
            const target = yourCoursesRef.current;
            if (target) {
                const topOffset = 96;
                const targetY = target.getBoundingClientRect().top + window.scrollY - topOffset;
                window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
            }
            return;
        }

        if (label === 'Videos Watched') {
            router.push('/watchHistory');
        }
    };

    const enrolledCourses = userData?.enrolled_courses || [];
    const visibleCourses = showAllCourses ? enrolledCourses : enrolledCourses.slice(0, 8);
    const hasMoreCourses = enrolledCourses.length > 8;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
            <TopBar name={userData?.name} />
            <div className="flex flex-1 min-w-0">
                <SideBar />
                <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out">
                    {/* Hero Section - Mobile Responsive */}
                    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900">
                        {/* Background decoration - Responsive sizes */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-white rounded-full -translate-y-24 sm:-translate-y-36 lg:-translate-y-48 translate-x-24 sm:translate-x-36 lg:translate-x-48"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-accent-500 rounded-full translate-y-16 sm:translate-y-24 lg:translate-y-32 -translate-x-16 sm:-translate-x-24 lg:-translate-x-32"></div>
                        </div>
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
                                {/* Welcome content - Mobile optimized */}
                                <div className="lg:col-span-2 text-white space-y-3 sm:space-y-4">
                                    <CurrentDate className="text-white text-sm sm:text-base" />
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                                        {getGreeting()}, {userData?.name?.split(' ')[0]}! 👋
                                    </h1>
                                    <p className="text-sm sm:text-base text-primary-100 leading-relaxed max-w-2xl">
                                        Ready to continue your learning journey? 
                                        You have {userData?.enrolled_courses?.length || 0} courses waiting for you.
                                    </p>
                                    {/* Quick actions - Mobile responsive */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                                        <button 
                                            onClick={() => router.push('/browse')}
                                            className="inline-flex items-center justify-center px-4 sm:px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-accent-600 text-white hover:bg-accent-500 focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all duration-200 shadow-lg"
                                        >
                                            Explore Courses
                                        </button>
                                        <button 
                                            onClick={() => router.push('/watchHistory')}
                                            className="inline-flex items-center justify-center px-4 sm:px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-white text-primary-800 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all duration-200 shadow-lg"
                                        >
                                            Continue Watching
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Quick Stats - Mobile responsive */}
                                <div className="lg:col-span-1">
                                    {/* Mobile: 2x2 grid, Desktop: 2x2 grid */}
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        {getQuickStats().map((stat, index) => {
                                            const Icon = stat.icon;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleStatClick(stat.label)}
                                                    className="w-full text-left bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200"
                                                >
                                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-2 sm:mb-3`}>
                                                        <Icon className={`text-base sm:text-lg ${stat.color}`} />
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-primary-100 mb-1">{stat.label}</p>
                                                    <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
                        {/* Recent Activity */}
                        <section>
                            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Recent Activity</h2>
                                <button 
                                    onClick={() => router.push('/watchHistory')}
                                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200 whitespace-nowrap"
                                >
                                    View All
                                </button>
                            </div>
                            
                            {activityLoading ? (
                                /* Loading State */
                                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200">
                                    <div className="px-6 py-4">
                                        <SkeletonVidCard />
                                    </div>
                                </div>
                            ) : recentActivity.length > 0 ? (
                                /* Recent Activity Cards */
                                <div className="space-y-3">
                                    {recentActivity.map((activity, index) => (
                                        <RecentActivityCard key={activity.id || index} activity={activity} />
                                    ))}
                                </div>
                            ) : (
                                /* Empty State */
                                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                                    <div className="px-6 py-12 text-center">
                                        <VideoLibraryRounded className="text-4xl text-gray-400 mb-4 mx-auto" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
                                        <p className="text-gray-600 mb-6">
                                            Start watching lectures to see your recent activity here.
                                        </p>
                                        <button 
                                            onClick={() => router.push('/browse')}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                                        >
                                            Browse Courses
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Your Courses */}
                        <section ref={yourCoursesRef}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Your Courses</h2>
                                <button 
                                    onClick={() => router.push('/browse')}
                                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200 whitespace-nowrap"
                                >
                                    Browse More
                                </button>
                            </div>

                            {enrolledCourses.length > 0 ? (
                                <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
                                    {visibleCourses.map((course, index) => (
                                        <Card 
                                            key={course.course_instance_id || index}
                                            title={course.course_name}
                                            author={course.teacher_name}
                                            course_id={course.course_instance_id}
                                            duration={course.duration}
                                            progress={course.progress}
                                            enrolledCount={course.enrolled_count}
                                            difficulty={course.difficulty}
                                            lastAccessed={course.last_accessed}
                                        />
                                    ))}
                                </div>
                                {hasMoreCourses && (
                                    <div className="mt-4 sm:mt-6 flex justify-center">
                                        <button
                                            onClick={() => setShowAllCourses((prev) => !prev)}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
                                        >
                                            {showAllCourses ? 'Show Less' : `Show All (${enrolledCourses.length})`}
                                        </button>
                                    </div>
                                )}
                                </>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200">
                                    <div className="px-6 py-12 text-center">
                                        <SchoolRounded className="text-4xl text-gray-400 mb-4 mx-auto" />
                                        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                                        <p className="text-gray-600 mb-6">
                                            Start your learning journey by enrolling in your first course!
                                        </p>
                                        <button 
                                            onClick={() => router.push('/browse')}
                                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                                        >
                                            Explore Courses
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                    
                    {/* Footer - Inside main content area */}
                    <Footer />
                </main>
            </div>
        </div>
    );
}
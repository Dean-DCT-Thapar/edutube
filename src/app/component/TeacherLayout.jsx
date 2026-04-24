'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import {
    DashboardRounded,
    SchoolRounded,
    SecurityRounded,
    LogoutRounded,
    MenuRounded,
    CloseRounded,
    PersonRounded,
    MenuBookRounded
} from '@mui/icons-material';

const TeacherLayout = ({ children, title, userName }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [switchingMode, setSwitchingMode] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        frontendApi.verifyAuth()
            .then((auth) => {
                if (auth?.viewMode?.active) {
                    toast('You are in student view mode');
                    router.replace('/dashboard');
                }
            })
            .catch(() => {
                // Best-effort at layout level.
            });
    }, [router]);

    const navigation = [
        { name: 'Dashboard', href: '/teacher-dashboard', icon: DashboardRounded },
        { name: 'My courses', href: '/teacher-dashboard/instances', icon: SchoolRounded },
        { name: 'Change Password', href: '/teacher-dashboard/settings', icon: SecurityRounded, section: 'settings' }
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            localStorage.removeItem('adminToken');
            localStorage.removeItem('token');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('token');
            router.push('/login');
        }
    };

    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const handleSwitchToStudentView = async () => {
        try {
            setSwitchingMode(true);
            await frontendApi.startStudentViewMode();
            toast.success('Now viewing as student@thapar.edu');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error?.data?.message || error.message || 'Failed to enter student view mode');
        } finally {
            setSwitchingMode(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div
                className={`
                fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <MenuBookRounded className="text-white text-sm" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Teacher</h1>
                                <p className="text-xs text-gray-600">EduTube</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 rounded-lg text-gray-500 hover:text-gray-700"
                        >
                            <CloseRounded />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Main
                        </p>
                        {navigation.map((item) => {
                            const isActive =
                                item.href === '/teacher-dashboard'
                                    ? pathname === '/teacher-dashboard'
                                    : item.href === '/teacher-dashboard/instances'
                                        ? pathname.startsWith('/teacher-dashboard/instances')
                                        : pathname === item.href;
                            return (
                                <React.Fragment key={item.name}>
                                    {item.section === 'settings' && (
                                        <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                            Settings
                                        </p>
                                    )}
                                <Link
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                                        ${
                                            isActive
                                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`mr-3 text-lg ${isActive ? 'text-primary-600' : 'text-gray-400'}`}
                                    />
                                    {item.name}
                                </Link>
                                </React.Fragment>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <PersonRounded className="text-gray-600 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {userName || 'Teacher'}
                                </p>
                                <p className="text-xs text-gray-600">Instructor</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSwitchToStudentView}
                            disabled={switchingMode}
                            className="w-full flex items-center px-3 py-2 mb-2 text-sm font-medium text-blue-700 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 disabled:opacity-60"
                        >
                            <PersonRounded className="mr-3 text-lg" />
                            {switchingMode ? 'Switching...' : 'View as Student'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                        >
                            <LogoutRounded className="mr-3 text-lg" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                <MenuRounded />
                            </button>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h1>
                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {getWelcomeMessage()}, {userName?.split(' ')[0] || 'Teacher'}!
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {new Date().toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
};

export default TeacherLayout;

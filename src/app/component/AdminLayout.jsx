'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    DashboardRounded,
    PeopleRounded,
    SchoolRounded,
    MenuBookRounded,
    VideoLibraryRounded,
    SettingsRounded,
    LogoutRounded,
    MenuRounded,
    CloseRounded,
    PersonRounded,
    AdminPanelSettingsRounded,
    TuneRounded,
    AutoStoriesRounded,
    AccountTreeRounded,
    GroupRounded
} from '@mui/icons-material';


const AdminLayout = ({ children, title, userName }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/admin-dashboard', icon: DashboardRounded },
        { name: 'Users', href: '/admin-dashboard/users', icon: PeopleRounded },
        { name: 'Teachers', href: '/admin-dashboard/teachers', icon: SchoolRounded },
        { name: 'Course Templates', href: '/admin-dashboard/course-templates', icon: AccountTreeRounded },
        { name: 'Course Instances', href: '/admin-dashboard/course-instances', icon: GroupRounded },
        { name: 'Enhanced Lectures', href: '/admin-dashboard/enhanced-lectures', icon: TuneRounded },
        { name: 'Settings', href: '/admin-dashboard/settings', icon: SettingsRounded },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            localStorage.removeItem('adminToken');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <AdminPanelSettingsRounded className="text-white text-sm" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                                <p className="text-xs text-gray-600">EduTube Management</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 rounded-lg text-gray-500 hover:text-gray-700"
                        >
                            <CloseRounded />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                                        ${isActive 
                                            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <item.icon className={`mr-3 text-lg ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User profile and logout */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <PersonRounded className="text-gray-600 text-sm" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {userName || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-600">Administrator</p>
                            </div>
                        </div>
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

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                <MenuRounded />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                                <p className="text-sm text-gray-600">
                                    {getWelcomeMessage()}, {userName?.split(' ')[0] || 'Admin'}!
                                </p>
                            </div>
                        </div>
                        
                        <div className="hidden md:block">
                            <div className="text-right">
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
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

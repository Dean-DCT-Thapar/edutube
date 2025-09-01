'use client';
import React from 'react';
import Link from 'next/link';
import {
    PersonRounded,
    MenuBookRounded,
    VisibilityRounded,
    ArrowForwardRounded
} from '@mui/icons-material';

const RecentActivity = ({ recentUsers, recentCourseInstances }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'teacher':
                return 'bg-blue-100 text-blue-800';
            case 'student':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <PersonRounded className="text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                        </div>
                        <Link 
                            href="/admin-dashboard/users"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                        >
                            View all
                            <ArrowForwardRounded className="ml-1 text-sm" />
                        </Link>
                    </div>
                </div>
                <div className="p-6">
                    {recentUsers && recentUsers.length > 0 ? (
                        <div className="space-y-4">
                            {recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <PersonRounded className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{formatDate(user.created_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <PersonRounded className="text-gray-300 text-4xl mb-2" />
                            <p className="text-gray-500">No recent users</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Course Instances */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <MenuBookRounded className="text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Recent Course Instances</h3>
                        </div>
                        <Link 
                            href="/admin-dashboard/course-instances"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center"
                        >
                            View all
                            <ArrowForwardRounded className="ml-1 text-sm" />
                        </Link>
                    </div>
                </div>
                <div className="p-6">
                    {recentCourseInstances && recentCourseInstances.length > 0 ? (
                        <div className="space-y-4">
                            {recentCourseInstances.map((instance) => (
                                <div key={instance.id} className="border-l-4 border-primary-500 pl-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                                                {instance.course_template?.name} ({instance.course_template?.course_code})
                                            </h4>
                                            <p className="text-xs text-gray-600 mb-2">
                                                by {instance.teacher?.user?.name || 'Unknown'}
                                            </p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <MenuBookRounded className="text-xs mr-1" />
                                                    {instance._count?.chapters || 0} chapters
                                                </span>
                                                <span>{formatDate(instance.created_at)}</span>
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/admin-dashboard/course-instances/${instance.id}`}
                                            className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            <VisibilityRounded className="text-sm" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <MenuBookRounded className="text-gray-300 text-4xl mb-2" />
                            <p className="text-gray-500">No recent course instances</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;

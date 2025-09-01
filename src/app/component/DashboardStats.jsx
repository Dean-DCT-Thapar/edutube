'use client';
import React from 'react';
import {
    PeopleRounded,
    SchoolRounded,
    MenuBookRounded,
    VideoLibraryRounded,
    TrendingUpRounded
} from '@mui/icons-material';

const DashboardStats = ({ stats }) => {
    const statCards = [
        {
            title: 'Total Users',
            value: stats?.users || 0,
            icon: PeopleRounded,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            title: 'Teachers',
            value: stats?.teachers || 0,
            icon: SchoolRounded,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        },
        {
            title: 'Courses',
            value: stats?.courses || 0,
            icon: MenuBookRounded,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
        },
        {
            title: 'Lectures',
            value: stats?.lectures || 0,
            icon: VideoLibraryRounded,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700'
        },
        {
            title: 'Enrollments',
            value: stats?.enrollments || 0,
            icon: TrendingUpRounded,
            color: 'bg-red-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {statCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${card.bgColor}`}>
                            <card.icon className={`text-2xl ${card.textColor}`} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import TeacherLayout from '../component/TeacherLayout';
import {
    SchoolRounded,
    PeopleRounded,
    TrendingUpRounded,
    VideoLibraryRounded,
    ChevronRightRounded
} from '@mui/icons-material';

const STAT_CARDS = [
    {
        key: 'instances',
        title: 'My Courses',
        icon: SchoolRounded,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700'
    },
    {
        key: 'enrollments',
        title: 'Total Enrollments',
        icon: PeopleRounded,
        bgColor: 'bg-green-50',
        textColor: 'text-green-700'
    },
    {
        key: 'active',
        title: 'Active Learners',
        icon: TrendingUpRounded,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700'
    }
];

export default function TeacherDashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState(null);
    const [stats, setStats] = useState({ instances: 0, enrollments: 0, active: 0 });
    const [topInstances, setTopInstances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = toast.loading('Loading…', { id: 'teacher-dash' });

        frontendApi
            .verifyAuth()
            .then((auth) => {
                if (auth.status !== 200) throw new Error('auth');
                if (auth.role !== 'teacher') throw new Error('role');
                setUserName(auth.name);
                return Promise.all([
                    frontendApi.get('/api/teacher/my-instances'),
                    frontendApi.get('/api/teacher/analytics/summary')
                ]);
            })
            .then(([myInstances, summaryRes]) => {
                const instances = myInstances?.instances ?? [];
                const rows = summaryRes?.data?.instances ?? [];
                const enroll = rows.reduce((a, r) => a + (r.enrollment_count ?? 0), 0);
                const active = rows.reduce((a, r) => a + (r.active_students ?? 0), 0);
                setStats({ instances: instances.length, enrollments: enroll, active });
                setTopInstances(instances.slice(0, 5));
                toast.dismiss(t);
                setLoading(false);
            })
            .catch((err) => {
                toast.dismiss(t);
                if (err.message === 'role') {
                    router.push('/dashboard');
                    return;
                }
                if (err.message !== 'auth') {
                    toast.error(err.message || 'Please sign in');
                }
                router.push('/login');
            });
    }, [router]);

    if (loading) {
        return (
            <TeacherLayout title="Dashboard" userName={userName}>
                <div className="space-y-6 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-200 h-24 rounded-lg" />
                        ))}
                    </div>
                    <div className="bg-gray-200 h-64 rounded-lg" />
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout title="Dashboard" userName={userName}>
            <div className="space-y-6">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Overview</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Monitor your courses and student engagement at a glance.
                        </p>
                    </div>
                    <Link
                        href="/teacher-dashboard/instances"
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <SchoolRounded className="mr-2 text-base" />
                        My Courses
                    </Link>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {STAT_CARDS.map((card) => (
                        <div key={card.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                    <card.icon className={`text-2xl ${card.textColor}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats[card.key].toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent courses */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900">Recent Courses</h2>
                        <Link
                            href="/teacher-dashboard/instances"
                            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                            View all
                        </Link>
                    </div>

                    {topInstances.length === 0 ? (
                        <div className="text-center py-12">
                            <SchoolRounded className="mx-auto text-gray-400 mb-4" style={{ fontSize: 48 }} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                            <p className="text-gray-600">An administrator must assign course instances to your teacher account.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {topInstances.map((inst) => (
                                <li key={inst.id}>
                                    <Link
                                        href={`/teacher-dashboard/instances/${inst.id}`}
                                        className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center min-w-0">
                                            <div className="p-2 rounded-lg bg-primary-50 mr-4 shrink-0">
                                                <VideoLibraryRounded className="text-primary-600 text-lg" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {inst.course_template?.name ?? 'Course'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {inst.course_template?.course_code}
                                                    {inst.instance_name ? ` · ${inst.instance_name}` : ''}
                                                    {' · '}
                                                    {inst._count?.enrollments ?? 0} enrolled
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRightRounded className="text-gray-400 shrink-0 ml-4" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}

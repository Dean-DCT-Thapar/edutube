'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import TeacherLayout from '../component/TeacherLayout';
import { SchoolRounded, MenuBookRounded } from '@mui/icons-material';

export default function TeacherDashboardPage() {
    const router = useRouter();
    const [userName, setUserName] = useState(null);
    const [instanceCount, setInstanceCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadingToast = toast.loading('Loading...', { id: 'teacher-dash' });

        frontendApi
            .verifyAuth()
            .then((auth) => {
                if (auth.status !== 200) {
                    throw new Error('Authentication failed');
                }
                if (auth.role !== 'teacher') {
                    throw new Error('Access denied. Teachers only.');
                }
                setUserName(auth.name);
                return frontendApi.get('/api/teacher/my-instances');
            })
            .then((data) => {
                const n = data?.instances?.length ?? 0;
                setInstanceCount(n);
                toast.dismiss(loadingToast);
                setLoading(false);
            })
            .catch((error) => {
                toast.dismiss(loadingToast);
                const msg = error.response?.data?.message || error.message || 'Please sign in';
                toast.error(msg, { id: 'teacher-dash' });
                if (error.message?.includes('Teachers only') || error.message?.includes('Access denied')) {
                    router.push('/dashboard');
                } else {
                    router.push('/login');
                }
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return (
            <TeacherLayout title="Dashboard" userName={userName}>
                <div className="animate-pulse space-y-4 max-w-3xl">
                    <div className="h-10 bg-gray-200 rounded w-1/2" />
                    <div className="h-32 bg-gray-200 rounded-xl" />
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout title="Dashboard" userName={userName}>
            <div className="max-w-3xl space-y-6">
                <p className="text-gray-600">
                    Manage the course instances you teach: chapters, lecture titles, descriptions, and tags.
                    You cannot add or remove course instances or videos—contact an administrator for that.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary-50 text-primary-700">
                                <SchoolRounded />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">My courses</h2>
                        </div>
                        <p className="text-3xl font-bold text-primary-700">{instanceCount ?? '—'}</p>
                        <p className="text-sm text-gray-500 mt-1">Active instances you teach</p>
                        <Link
                            href="/teacher-dashboard/instances"
                            className="mt-4 inline-flex text-sm font-medium text-primary-600 hover:text-primary-800"
                        >
                            View all →
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
                                <MenuBookRounded />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Quick link</h2>
                        </div>
                        <p className="text-sm text-gray-600">
                            Open a course to view chapters and lectures, then edit titles, descriptions, tags, and
                            ordering from the course page.
                        </p>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}

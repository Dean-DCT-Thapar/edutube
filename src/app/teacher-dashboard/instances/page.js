'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import TeacherLayout from '../../component/TeacherLayout';
import {
    SchoolRounded,
    ChevronRightRounded,
    PeopleRounded,
    MenuBookRounded,
    SearchRounded
} from '@mui/icons-material';

export default function TeacherInstancesPage() {
    const router = useRouter();
    const [userName, setUserName] = useState(null);
    const [instances, setInstances] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = toast.loading('Loading courses…', { id: 'teacher-inst' });

        frontendApi
            .verifyAuth()
            .then((auth) => {
                if (auth.status !== 200) throw new Error('auth');
                if (auth.role !== 'teacher') throw new Error('role');
                setUserName(auth.name);
                return frontendApi.get('/api/teacher/my-instances');
            })
            .then((data) => {
                setInstances(data?.instances ?? []);
                toast.dismiss(t);
                setLoading(false);
            })
            .catch((err) => {
                toast.dismiss(t);
                if (err.message === 'role') {
                    router.push('/dashboard');
                    return;
                }
                toast.error('Please sign in as a teacher', { id: 'teacher-inst' });
                router.push('/login');
            });
    }, [router]);

    const filtered = instances.filter((inst) => {
        const q = search.toLowerCase();
        return (
            (inst.course_template?.name ?? '').toLowerCase().includes(q) ||
            (inst.course_template?.course_code ?? '').toLowerCase().includes(q) ||
            (inst.instance_name ?? '').toLowerCase().includes(q)
        );
    });

    if (loading) {
        return (
            <TeacherLayout title="My Courses" userName={userName}>
                <div className="space-y-6 animate-pulse">
                    <div className="bg-gray-200 h-10 rounded-lg w-1/3" />
                    <div className="bg-gray-200 h-14 rounded-lg" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-200 h-20 rounded-lg" />
                    ))}
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout title="My Courses" userName={userName}>
            <div className="space-y-6">
                {/* Page header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Course instances assigned to you. Select one to manage chapters and lectures.
                    </p>
                </div>

                {/* Search bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="relative max-w-md">
                        <SearchRounded className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by course name or code…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                    </div>
                </div>

                {/* Courses list */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <SchoolRounded className="mx-auto text-gray-400 mb-4" style={{ fontSize: 48 }} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {search ? 'No results found' : 'No course instances yet'}
                            </h3>
                            <p className="text-gray-600">
                                {search
                                    ? 'Try a different search term.'
                                    : 'An administrator must assign course instances to your teacher account.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
                                </p>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {filtered.map((inst) => (
                                    <li key={inst.id}>
                                        <Link
                                            href={`/teacher-dashboard/instances/${inst.id}`}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center min-w-0">
                                                <div className="p-2 rounded-lg bg-primary-50 mr-4 shrink-0">
                                                    <SchoolRounded className="text-primary-600 text-lg" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {inst.course_template?.name ?? 'Course'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {inst.course_template?.course_code}
                                                        {inst.instance_name ? ` · ${inst.instance_name}` : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 ml-4 shrink-0">
                                                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
                                                    <PeopleRounded className="text-gray-400" style={{ fontSize: 16 }} />
                                                    <span>{inst._count?.enrollments ?? 0}</span>
                                                </div>
                                                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
                                                    <MenuBookRounded className="text-gray-400" style={{ fontSize: 16 }} />
                                                    <span>{inst._count?.chapters ?? 0}</span>
                                                </div>
                                                <ChevronRightRounded className="text-gray-400" />
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}

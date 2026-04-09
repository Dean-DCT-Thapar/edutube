'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import TeacherLayout from '../../../component/TeacherLayout';
import Link from 'next/link';
import { ArrowBackRounded } from '@mui/icons-material';

export default function TeacherInstanceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const [userName, setUserName] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const t = toast.loading('Loading course...', { id: 'teacher-course' });

        frontendApi
            .verifyAuth()
            .then((auth) => {
                if (auth.status !== 200) {
                    throw new Error('auth');
                }
                if (auth.role !== 'teacher') {
                    router.push('/dashboard');
                    throw new Error('role');
                }
                setUserName(auth.name);
                return frontendApi.get(`/api/teacher/instances/${id}/chapters`);
            })
            .then((res) => {
                setData(res);
                toast.dismiss(t);
                setLoading(false);
            })
            .catch((err) => {
                toast.dismiss(t);
                if (err.message === 'role') {
                    setLoading(false);
                    return;
                }
                toast.error(err.message || 'Failed to load course', { id: 'teacher-course' });
                router.push('/teacher-dashboard/instances');
                setLoading(false);
            });
    }, [id, router]);

    if (loading || !data) {
        return (
            <TeacherLayout title="Course" userName={userName}>
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-40 bg-gray-200 rounded-lg" />
                </div>
            </TeacherLayout>
        );
    }

    const { instance, chapters } = data;
    const title = instance?.course_template?.name ?? 'Course';

    return (
        <TeacherLayout title={title} userName={userName}>
            <div className="space-y-6 max-w-4xl">
                <Link
                    href="/teacher-dashboard/instances"
                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                    <ArrowBackRounded className="mr-1 text-lg" />
                    Back to my courses
                </Link>

                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{instance?.course_template?.course_code}</h2>
                    {instance?.instance_name && (
                        <p className="text-sm text-gray-600">{instance.instance_name}</p>
                    )}
                </div>

                <p className="text-sm text-gray-600">
                    Video URLs are fixed. You can edit titles, descriptions, and tags, and reorder or move lectures
                    between chapters using the teacher API—full editing UI can be layered on next.
                </p>

                <div className="space-y-6">
                    {chapters?.map((ch) => (
                        <section
                            key={ch.id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                        >
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h3 className="font-medium text-gray-900">
                                    Chapter {ch.number}: {ch.name}
                                </h3>
                                {ch.description && (
                                    <p className="text-sm text-gray-600 mt-1">{ch.description}</p>
                                )}
                            </div>
                            <ul className="divide-y divide-gray-100">
                                {ch.lectures?.map((lec) => (
                                    <li key={lec.id} className="px-4 py-3 text-sm">
                                        <span className="font-medium text-gray-800">
                                            {lec.lecture_number}. {lec.title}
                                        </span>
                                        {lec.description && (
                                            <p className="text-gray-600 mt-1">{lec.description}</p>
                                        )}
                                        {lec.tags?.length > 0 && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Tags: {lec.tags.map((t) => t.tag).join(', ')}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            </div>
        </TeacherLayout>
    );
}

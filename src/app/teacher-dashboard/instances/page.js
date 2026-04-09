'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import TeacherLayout from '../../component/TeacherLayout';
import { ChevronRightRounded } from '@mui/icons-material';

export default function TeacherInstancesPage() {
    const router = useRouter();
    const [userName, setUserName] = useState(null);
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = toast.loading('Loading courses...', { id: 'teacher-inst' });

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
                    setLoading(false);
                    return;
                }
                toast.error('Please sign in as a teacher', { id: 'teacher-inst' });
                router.push('/login');
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return (
            <TeacherLayout title="My courses" userName={userName}>
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg" />
                    ))}
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout title="My courses" userName={userName}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Course instances assigned to you. Select one to manage chapters and lectures.
                </p>

                {instances.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                        No course instances yet. An administrator must assign instances to your teacher account.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {instances.map((inst) => (
                            <li key={inst.id}>
                                <Link
                                    href={`/teacher-dashboard/instances/${inst.id}`}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {inst.course_template?.name ?? 'Course'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {inst.course_template?.course_code}
                                            {inst.instance_name ? ` · ${inst.instance_name}` : ''}
                                        </p>
                                    </div>
                                    <ChevronRightRounded className="text-gray-400" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </TeacherLayout>
    );
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import TeacherLayout from '../../component/TeacherLayout';
import { MenuBookRounded, AddRounded, ChevronRightRounded, AccessTimeRounded, CheckCircleRounded, CancelRounded } from '@mui/icons-material';

export default function CourseRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await frontendApi.get('/api/teacher/course-requests');
            setRequests(res.requests || []);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AccessTimeRounded className="text-yellow-500" />;
            case 'approved': return <CheckCircleRounded className="text-green-500" />;
            case 'rejected': return <CancelRounded className="text-red-500" />;
            default: return <AccessTimeRounded className="text-gray-500" />;
        }
    };

    return (
        <TeacherLayout title="Course Requests">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
                        <p className="mt-1 text-sm text-gray-600">Track your requests for new courses and content.</p>
                    </div>
                    <Link
                        href="/teacher-dashboard/course-requests/new"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 shadow-sm"
                    >
                        <AddRounded className="mr-2" />
                        New Request
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>)}
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <MenuBookRounded className="mx-auto text-gray-400 text-5xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                        <p className="text-gray-500">You haven't submitted any course or content requests.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {requests.map(req => (
                                <li key={req.id}>
                                    <Link
                                        href={`/teacher-dashboard/course-requests/${req.id}`}
                                        className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="mr-4">
                                            {getStatusIcon(req.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {req.request_type === 'NEW_COURSE' 
                                                        ? req.course_name 
                                                        : `New Content for: ${req.target_course_instance?.course_template?.name || 'Course'}`}
                                                </p>
                                                <span className="ml-3 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                    {req.request_type === 'NEW_COURSE' ? 'New Course' : 'New Content'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Submitted on {new Date(req.created_at).toLocaleDateString()} • {req.resource_links?.length || 0} resources
                                            </p>
                                        </div>
                                        <ChevronRightRounded className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}

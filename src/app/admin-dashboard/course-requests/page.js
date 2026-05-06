'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import AdminLayout from '../../component/AdminLayout';
import { 
    MenuBookRounded, 
    ChevronRightRounded, 
    AccessTimeRounded, 
    CheckCircleRounded, 
    CancelRounded,
    FilterListRounded
} from '@mui/icons-material';

export default function AdminCourseRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await frontendApi.get('/api/admin/course-requests');
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

    const filteredRequests = requests.filter(req => filter === 'all' ? true : req.status === filter);

    return (
        <AdminLayout title="Course Requests">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Course & Content Requests</h1>
                        <p className="mt-1 text-sm text-gray-600">Review requests from teachers to create new courses or add content.</p>
                    </div>
                    
                    {/* Filters */}
                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        <FilterListRounded className="text-gray-400 w-5 h-5 ml-2 mr-1" />
                        <select 
                            value={filter} 
                            onChange={(e) => setFilter(e.target.value)}
                            className="border-none text-sm focus:ring-0 text-gray-700 bg-transparent pr-8 py-1"
                        >
                            <option value="all">All Requests</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>)}
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <MenuBookRounded className="mx-auto text-gray-400 text-5xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                        <p className="text-gray-500">There are currently no course requests from teachers.</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No {filter} requests</h3>
                        <p className="text-gray-500">Try changing the filter to see other requests.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {filteredRequests.map(req => (
                                <li key={req.id}>
                                    <Link
                                        href={`/admin-dashboard/course-requests/${req.id}`}
                                        className="flex flex-col sm:flex-row items-start sm:items-center px-6 py-4 hover:bg-gray-50 transition-colors group gap-4"
                                    >
                                        <div className="flex-shrink-0 mt-1 sm:mt-0">
                                            {getStatusIcon(req.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center flex-wrap gap-2 mb-1">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {req.request_type === 'NEW_COURSE' 
                                                        ? req.course_name 
                                                        : `New Content for: ${req.target_course_instance?.course_template?.name || 'Course'}`}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${req.request_type === 'NEW_COURSE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {req.request_type === 'NEW_COURSE' ? 'New Course' : 'New Content'}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500 space-x-2">
                                                <span>Teacher: <span className="font-medium text-gray-700">{req.teacher?.user?.name || `Teacher #${req.teacher_id}`}</span></span>
                                                <span>•</span>
                                                <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{req.resource_links?.length || 0} links</span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 w-full sm:w-auto flex justify-end">
                                            <span className="text-sm text-primary-600 font-medium group-hover:text-primary-800 flex items-center">
                                                Review
                                                <ChevronRightRounded className="w-4 h-4 ml-1" />
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

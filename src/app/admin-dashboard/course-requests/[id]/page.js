'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import AdminLayout from '../../../component/AdminLayout';
import toast from 'react-hot-toast';
import { 
    ArrowBackRounded, 
    CheckCircleRounded, 
    CancelRounded, 
    AccessTimeRounded,
    OpenInNewRounded,
    PersonRounded,
    SchoolRounded
} from '@mui/icons-material';

export default function AdminCourseRequestDetail({ params }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Action state
    const [action, setAction] = useState(null); // 'approve', 'reject'
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Approve specific state
    const [approveMode, setApproveMode] = useState('new'); // 'new' or 'existing'
    
    // Data for dropdowns
    const [templates, setTemplates] = useState([]);
    const [instances, setInstances] = useState([]);
    
    // Form fields for approval
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [newInstanceName, setNewInstanceName] = useState('');
    const [selectedInstanceId, setSelectedInstanceId] = useState('');

    useEffect(() => {
        fetchRequest();
    }, [id]);

    useEffect(() => {
        if (action === 'approve' && request?.request_type === 'NEW_COURSE') {
            // Fetch templates and instances for the dropdowns
            frontendApi.get('/api/admin/course-templates/dropdown').then(res => {
                setTemplates(res.data || []);
                if (res.data?.length > 0) setSelectedTemplateId(res.data[0].id.toString());
            }).catch(console.error);

            frontendApi.get('/api/admin/course-instances/dropdown').then(res => {
                const teacherInstances = (res.data || []).filter(inst => inst.teacher_id === request.teacher_id);
                setInstances(teacherInstances);
                if (teacherInstances.length > 0) setSelectedInstanceId(teacherInstances[0].id.toString());
            }).catch(console.error);
        }
    }, [action, request]);

    const fetchRequest = async () => {
        try {
            const res = await frontendApi.get(`/api/admin/course-requests/${id}`);
            setRequest(res.request);
        } catch (error) {
            console.error('Failed to fetch request:', error);
            toast.error('Request not found');
            router.push('/admin-dashboard/course-requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            let linkedInstanceId = null;

            if (request.request_type === 'NEW_COURSE') {
                if (approveMode === 'new') {
                    // Create a new instance first
                    const res = await frontendApi.post('/api/admin/course-instances', {
                        course_template_id: parseInt(selectedTemplateId),
                        teacher_id: request.teacher_id,
                        instance_name: newInstanceName || request.course_name
                    });
                    linkedInstanceId = res.instance.id;
                } else {
                    linkedInstanceId = parseInt(selectedInstanceId);
                }
            } else {
                // NEW_CONTENT already has a target instance
                linkedInstanceId = request.target_course_instance_id;
            }

            // Update request status
            await frontendApi.put(`/api/admin/course-requests/${id}/status`, {
                status: 'approved',
                admin_notes: adminNotes,
                linked_instance_id: linkedInstanceId
            });

            toast.success('Request approved successfully');
            fetchRequest();
            setAction(null);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to approve request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!adminNotes.trim()) {
            return toast.error('Please provide a reason for rejection in the notes');
        }
        
        setIsSubmitting(true);
        try {
            await frontendApi.put(`/api/admin/course-requests/${id}/status`, {
                status: 'rejected',
                admin_notes: adminNotes
            });
            toast.success('Request rejected');
            fetchRequest();
            setAction(null);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to reject request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Review Request">
                <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
                    <div className="h-40 bg-gray-200 rounded-xl"></div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!request) return null;

    const isPending = request.status === 'pending';

    const getStatusBadge = () => {
        switch (request.status) {
            case 'approved': 
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"><CheckCircleRounded className="w-4 h-4 mr-1.5" /> Approved</span>;
            case 'rejected': 
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"><CancelRounded className="w-4 h-4 mr-1.5" /> Rejected</span>;
            default: 
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"><AccessTimeRounded className="w-4 h-4 mr-1.5" /> Pending Review</span>;
        }
    };

    return (
        <AdminLayout title="Review Request">
            <div className="max-w-5xl mx-auto space-y-6">
                <Link href="/admin-dashboard/course-requests" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
                    <ArrowBackRounded className="mr-1 text-sm" />
                    Back to Requests List
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${request.request_type === 'NEW_COURSE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {request.request_type === 'NEW_COURSE' ? 'New Course Request' : 'New Content Request'}
                                </span>
                                {getStatusBadge()}
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                {request.request_type === 'NEW_COURSE' 
                                    ? request.course_name 
                                    : `Content for: ${request.target_course_instance?.course_template?.name}`}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="flex items-center">
                                    <PersonRounded className="w-4 h-4 mr-1.5 text-gray-400" />
                                    <span className="font-medium text-gray-900 mr-1">{request.teacher?.user?.name}</span> (ID: {request.teacher_id})
                                </div>
                                <div className="flex items-center">
                                    <AccessTimeRounded className="w-4 h-4 mr-1.5 text-gray-400" />
                                    {new Date(request.created_at).toLocaleString()}
                                </div>
                                {request.request_type === 'NEW_COURSE' && request.course_code && (
                                    <div className="flex items-center">
                                        <SchoolRounded className="w-4 h-4 mr-1.5 text-gray-400" />
                                        Proposed Code: <span className="font-medium text-gray-900 ml-1">{request.course_code}</span>
                                    </div>
                                )}
                            </div>

                            {request.description && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Message from Teacher:</h3>
                                    <div className="text-base text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {request.description}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Resource Links */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Resource Links ({request.resource_links?.length || 0})</h3>
                            
                            <div className="space-y-3">
                                {!request.resource_links || request.resource_links.length === 0 ? (
                                    <p className="text-gray-500 italic text-sm">No links provided.</p>
                                ) : request.resource_links.map((link, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
                                        <div className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-600 uppercase w-28 text-center shrink-0">
                                            {link.type.replace('_', ' ')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {link.label && <div className="font-medium text-gray-900 text-sm mb-0.5">{link.label}</div>}
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 text-sm truncate flex items-center hover:underline group">
                                                <span className="truncate">{link.url}</span>
                                                <OpenInNewRounded className="w-3.5 h-3.5 ml-1.5 opacity-50 group-hover:opacity-100 shrink-0" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {!isPending && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <CheckCircleRounded className="w-4 h-4 mr-1.5 text-green-500" />
                                        Admin action: Links must be manually added to the target course instance.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="space-y-6">
                        {/* Status/Action Panel */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
                            
                            {isPending && !action ? (
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => setAction('approve')}
                                        className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm"
                                    >
                                        <CheckCircleRounded className="w-5 h-5 mr-2" /> Approve Request
                                    </button>
                                    <button 
                                        onClick={() => setAction('reject')}
                                        className="w-full flex justify-center items-center px-4 py-2.5 border border-red-200 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                                    >
                                        <CancelRounded className="w-5 h-5 mr-2" /> Reject Request
                                    </button>
                                </div>
                            ) : isPending && action ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-semibold ${action === 'approve' ? 'text-green-700' : 'text-red-700'}`}>
                                            {action === 'approve' ? 'Approve Request' : 'Reject Request'}
                                        </h4>
                                        <button onClick={() => setAction(null)} className="text-xs text-gray-500 hover:text-gray-700 underline">Cancel</button>
                                    </div>

                                    {action === 'approve' && request.request_type === 'NEW_COURSE' && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                            <p className="text-sm font-medium text-gray-900">How would you like to process this new course?</p>
                                            
                                            <div className="flex space-x-4">
                                                <label className="flex items-center text-sm">
                                                    <input type="radio" checked={approveMode === 'new'} onChange={() => setApproveMode('new')} className="text-primary-600 mr-2" />
                                                    Create New Instance
                                                </label>
                                                <label className="flex items-center text-sm">
                                                    <input type="radio" checked={approveMode === 'existing'} onChange={() => setApproveMode('existing')} className="text-primary-600 mr-2" />
                                                    Link to Existing
                                                </label>
                                            </div>

                                            {approveMode === 'new' ? (
                                                <div className="space-y-3 pt-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Select Course Template</label>
                                                        <select value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)} className="w-full text-sm rounded-md border-gray-300">
                                                            {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.course_code})</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Instance Name (Optional)</label>
                                                        <input type="text" value={newInstanceName} onChange={e => setNewInstanceName(e.target.value)} placeholder={request.course_name} className="w-full text-sm rounded-md border-gray-300" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 pt-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Select Existing Instance for this Teacher</label>
                                                        {instances.length === 0 ? (
                                                            <p className="text-sm text-red-500 italic">This teacher has no existing instances.</p>
                                                        ) : (
                                                            <select value={selectedInstanceId} onChange={e => setSelectedInstanceId(e.target.value)} className="w-full text-sm rounded-md border-gray-300">
                                                                {instances.map(inst => <option key={inst.id} value={inst.id}>{inst.course_template?.name} {inst.instance_name ? `- ${inst.instance_name}` : ''}</option>)}
                                                            </select>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {action === 'approve' && request.request_type === 'NEW_CONTENT' && (
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                                            This request is for existing instance: <span className="font-bold">{request.target_course_instance?.course_template?.name}</span>. Approving will mark it as accepted. You must manually add the resources.
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (visible to teacher)</label>
                                        <textarea 
                                            rows="3" 
                                            value={adminNotes} 
                                            onChange={e => setAdminNotes(e.target.value)}
                                            className="w-full text-sm rounded-md border-gray-300"
                                            placeholder={action === 'reject' ? "Reason for rejection..." : "Optional notes..."}
                                            required={action === 'reject'}
                                        ></textarea>
                                    </div>

                                    <button 
                                        onClick={action === 'approve' ? handleApprove : handleReject}
                                        disabled={isSubmitting || (action === 'approve' && request.request_type === 'NEW_COURSE' && approveMode === 'existing' && instances.length === 0)}
                                        className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white shadow-sm disabled:opacity-50 ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                    >
                                        {isSubmitting ? 'Processing...' : `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}`}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg border ${request.status === 'approved' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {request.status === 'approved' ? <CheckCircleRounded className="text-green-600 w-5 h-5" /> : <CancelRounded className="text-red-600 w-5 h-5" />}
                                            <span className={`font-semibold ${request.status === 'approved' ? 'text-green-800' : 'text-red-800'}`}>
                                                Request {request.status === 'approved' ? 'Approved' : 'Rejected'}
                                            </span>
                                        </div>
                                        {request.admin_notes && (
                                            <div className="mt-2 text-sm text-gray-700 bg-white bg-opacity-50 p-2 rounded border border-gray-200">
                                                <span className="font-semibold block mb-1">Notes:</span>
                                                {request.admin_notes}
                                            </div>
                                        )}
                                    </div>

                                    {request.status === 'approved' && request.linked_instance && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Linked Course Instance</h4>
                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                                                <p className="font-medium text-gray-900">{request.linked_instance.course_template?.name}</p>
                                                <p className="text-gray-500">ID: {request.linked_instance.id}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

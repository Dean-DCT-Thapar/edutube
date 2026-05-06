'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import frontendApi from '@/utils/frontendApiClient';
import TeacherLayout from '../../../component/TeacherLayout';
import toast from 'react-hot-toast';
import { 
    ArrowBackRounded, 
    EditRounded, 
    DeleteRounded, 
    CheckCircleRounded, 
    CancelRounded, 
    AccessTimeRounded,
    SaveRounded,
    CloseRounded,
    AddRounded,
    RemoveCircleOutlineRounded,
    OpenInNewRounded
} from '@mui/icons-material';

export default function CourseRequestDetail({ params }) {
    // React 19 unwrapping of params
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Edit state
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [description, setDescription] = useState('');
    const [links, setLinks] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const res = await frontendApi.get(`/api/teacher/course-requests/${id}`);
            setRequest(res.request);
            // Initialize edit state
            setCourseName(res.request.course_name || '');
            setCourseCode(res.request.course_code || '');
            setDescription(res.request.description || '');
            setLinks(res.request.resource_links || []);
        } catch (error) {
            console.error('Failed to fetch request:', error);
            toast.error('Request not found');
            router.push('/teacher-dashboard/course-requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = () => setLinks([...links, { url: '', type: 'youtube', label: '' }]);
    const handleRemoveLink = (index) => setLinks(links.filter((_, i) => i !== index));
    const handleLinkChange = (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleSave = async () => {
        if (request.request_type === 'NEW_COURSE' && !courseName.trim()) {
            return toast.error('Course name is required');
        }
        if (links.some(l => !l.url.trim())) {
            return toast.error('All links must have a URL');
        }

        setSaving(true);
        try {
            const res = await frontendApi.put(`/api/teacher/course-requests/${id}`, {
                course_name: courseName,
                course_code: courseCode,
                description,
                resource_links: links
            });
            setRequest(res.request);
            setIsEditing(false);
            toast.success('Request updated');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update request');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this request?')) return;
        
        try {
            await frontendApi.delete(`/api/teacher/course-requests/${id}`);
            toast.success('Request deleted');
            router.push('/teacher-dashboard/course-requests');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to delete request');
        }
    };

    if (loading) {
        return (
            <TeacherLayout title="Request Details">
                <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
                    <div className="h-40 bg-gray-200 rounded-xl"></div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </TeacherLayout>
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
        <TeacherLayout title="Request Details">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/teacher-dashboard/course-requests" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2">
                    <ArrowBackRounded className="mr-1 text-sm" />
                    Back to Requests
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                    {request.request_type === 'NEW_COURSE' ? 'New Course' : 'New Content'}
                                </span>
                                {getStatusBadge()}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {request.request_type === 'NEW_COURSE' 
                                    ? request.course_name 
                                    : `Content for: ${request.target_course_instance?.course_template?.name}`}
                            </h1>
                            <p className="text-sm text-gray-500 mt-2">
                                Submitted on {new Date(request.created_at).toLocaleString()}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        {isPending && !isEditing && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <EditRounded className="w-4 h-4 mr-1.5" /> Edit
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-3 py-1.5 border border-red-200 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100"
                                >
                                    <DeleteRounded className="w-4 h-4 mr-1.5" /> Delete
                                </button>
                            </div>
                        )}
                        {isEditing && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <CloseRounded className="w-4 h-4 mr-1.5" /> Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                                >
                                    <SaveRounded className="w-4 h-4 mr-1.5" /> {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Admin Notes */}
                    {request.admin_notes && (
                        <div className={`mt-6 p-4 rounded-lg border ${request.status === 'rejected' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                            <h4 className={`text-sm font-semibold mb-1 ${request.status === 'rejected' ? 'text-red-800' : 'text-blue-800'}`}>
                                Note from Administrator:
                            </h4>
                            <p className={`text-sm ${request.status === 'rejected' ? 'text-red-700' : 'text-blue-700'}`}>
                                {request.admin_notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Request Details</h3>
                    
                    <div className="space-y-6">
                        {isEditing && request.request_type === 'NEW_COURSE' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                                    <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                    <input type="text" value={courseCode} onChange={e => setCourseCode(e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" />
                                </div>
                            </div>
                        ) : !isEditing && request.request_type === 'NEW_COURSE' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Proposed Name</p>
                                    <p className="mt-1 text-base text-gray-900">{request.course_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Proposed Code</p>
                                    <p className="mt-1 text-base text-gray-900">{request.course_code || 'None provided'}</p>
                                </div>
                            </div>
                        ) : null}

                        <div>
                            {isEditing ? (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message / Description</label>
                                    <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border-gray-300 text-sm"></textarea>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-gray-500">Message / Description</p>
                                    <div className="mt-1 text-base text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {request.description || <span className="text-gray-400 italic">No description provided.</span>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resource Links Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Resource Links</h3>
                        {isEditing && (
                            <button onClick={handleAddLink} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                                <AddRounded className="w-4 h-4 mr-1" /> Add Link
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {links.length === 0 && !isEditing ? (
                            <p className="text-gray-500 italic text-sm">No links provided.</p>
                        ) : links.map((link, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                                {isEditing ? (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <input type="url" required value={link.url} onChange={e => handleLinkChange(idx, 'url', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" placeholder="https://..." />
                                        </div>
                                        <div className="w-32 flex-shrink-0">
                                            <select value={link.type} onChange={e => handleLinkChange(idx, 'type', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm">
                                                <option value="youtube">YouTube</option>
                                                <option value="google_drive">Google Drive</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <input type="text" value={link.label} onChange={e => handleLinkChange(idx, 'label', e.target.value)} className="w-full rounded-lg border-gray-300 text-sm" placeholder="Label" />
                                        </div>
                                        {links.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveLink(idx)} className="text-red-500 hover:text-red-700 p-1">
                                                <RemoveCircleOutlineRounded />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="px-2.5 py-1 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-600 uppercase w-24 text-center shrink-0">
                                            {link.type.replace('_', ' ')}
                                        </div>
                                        <div className="flex-1 min-w-0 flex items-center justify-between">
                                            <div className="truncate">
                                                {link.label && <span className="font-medium text-gray-900 mr-2">{link.label}:</span>}
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 text-sm truncate hover:underline">
                                                    {link.url}
                                                </a>
                                            </div>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-gray-400 hover:text-gray-600 shrink-0">
                                                <OpenInNewRounded className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import frontendApi from '@/utils/frontendApiClient';
import TeacherLayout from '../../../component/TeacherLayout';
import toast from 'react-hot-toast';
import { AddRounded, RemoveCircleOutlineRounded, ArrowBackRounded } from '@mui/icons-material';
import Link from 'next/link';

export default function NewCourseRequestPage() {
    const router = useRouter();
    const [requestType, setRequestType] = useState('NEW_COURSE');
    const [instances, setInstances] = useState([]);
    
    // Form fields
    const [targetInstanceId, setTargetInstanceId] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [description, setDescription] = useState('');
    const [links, setLinks] = useState([{ url: '', type: 'youtube', label: '' }]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Fetch instances for the dropdown if needed
        frontendApi.get('/api/teacher/my-instances')
            .then(res => {
                setInstances(res.instances || []);
                if (res.instances && res.instances.length > 0) {
                    setTargetInstanceId(res.instances[0].id.toString());
                }
            })
            .catch(err => console.error('Failed to fetch instances', err));
    }, []);

    // Auto-switch from NEW_CONTENT to NEW_COURSE if no courses available
    useEffect(() => {
        if (requestType === 'NEW_CONTENT' && instances.length === 0) {
            setRequestType('NEW_COURSE');
        }
    }, [instances.length, requestType]);

    const handleAddLink = () => {
        setLinks([...links, { url: '', type: 'youtube', label: '' }]);
    };

    const handleRemoveLink = (index) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (requestType === 'NEW_COURSE' && !courseName.trim()) {
            return toast.error('Course name is required');
        }
        if (requestType === 'NEW_CONTENT' && !targetInstanceId) {
            return toast.error('Please select a target course');
        }
        if (links.some(l => !l.url.trim())) {
            return toast.error('All links must have a URL');
        }

        setSubmitting(true);
        try {
            await frontendApi.post('/api/teacher/course-requests', {
                request_type: requestType,
                course_name: requestType === 'NEW_COURSE' ? courseName : null,
                course_code: requestType === 'NEW_COURSE' ? courseCode : null,
                target_course_instance_id: requestType === 'NEW_CONTENT' ? parseInt(targetInstanceId) : null,
                description,
                resource_links: links
            });
            toast.success('Request submitted successfully');
            router.push('/teacher-dashboard/course-requests');
        } catch (error) {
            toast.error(error?.data?.message || error?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <TeacherLayout title="New Request">
            <div className="max-w-3xl mx-auto space-y-6">
                <Link href="/teacher-dashboard/course-requests" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowBackRounded className="mr-1 text-sm" />
                    Back to Requests
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Submit a Request</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Request Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        className="text-primary-600 focus:ring-primary-500"
                                        checked={requestType === 'NEW_COURSE'}
                                        onChange={() => setRequestType('NEW_COURSE')}
                                    />
                                    <span className="ml-2 text-gray-900">Add New Course</span>
                                </label>
                                <label className={`flex items-center ${instances.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input
                                        type="radio"
                                        className="text-primary-600 focus:ring-primary-500"
                                        checked={requestType === 'NEW_CONTENT'}
                                        onChange={() => setRequestType('NEW_CONTENT')}
                                        disabled={instances.length === 0}
                                    />
                                    <span className="ml-2 text-gray-900">Add Content to Existing Course</span>
                                </label>
                            </div>
                        </div>

                        {/* Fields for NEW COURSE */}
                        {requestType === 'NEW_COURSE' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={courseName}
                                        onChange={e => setCourseName(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="e.g. Advanced Machine Learning"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                    <input
                                        type="text"
                                        value={courseCode}
                                        onChange={e => setCourseCode(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="e.g. CS401"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Fields for NEW CONTENT */}
                        {requestType === 'NEW_CONTENT' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Course *</label>
                                {instances.length === 0 ? (
                                    <div className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-center text-gray-600">
                                        <p className="text-sm">No courses assigned to you yet.</p>
                                        <p className="text-xs text-gray-500 mt-1">You can only add content to courses you currently teach.</p>
                                    </div>
                                ) : (
                                    <select
                                        required
                                        value={targetInstanceId}
                                        onChange={e => setTargetInstanceId(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="" disabled>Select a course</option>
                                        {instances.map(inst => (
                                            <option key={inst.id} value={inst.id}>
                                                {inst.course_template?.name} {inst.course_template?.course_code ? `(${inst.course_template.course_code})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message / Description</label>
                            <textarea
                                rows="3"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Any specific instructions for the admin?"
                            ></textarea>
                        </div>

                        {/* Resources Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Resource Links *</h3>
                                <button
                                    type="button"
                                    onClick={handleAddLink}
                                    className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
                                >
                                    <AddRounded className="text-sm mr-1" />
                                    Add Link
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {links.map((link, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex-1 w-full">
                                            <input
                                                type="url"
                                                required
                                                value={link.url}
                                                onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="w-full sm:w-1/4">
                                            <select
                                                value={link.type}
                                                onChange={e => handleLinkChange(idx, 'type', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
                                            >
                                                <option value="youtube">YouTube</option>
                                                <option value="google_drive">Google Drive</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="w-full sm:w-1/4">
                                            <input
                                                type="text"
                                                value={link.label}
                                                onChange={e => handleLinkChange(idx, 'label', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="Label (optional)"
                                            />
                                        </div>
                                        {links.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveLink(idx)}
                                                className="mt-2 sm:mt-1 text-red-500 hover:text-red-700 p-1"
                                                title="Remove link"
                                            >
                                                <RemoveCircleOutlineRounded />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </TeacherLayout>
    );
}

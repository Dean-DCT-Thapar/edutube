'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../component/AdminLayout';
import {
    AddRounded,
    EditRounded,
    DeleteRounded,
    PlayCircleOutlineRounded,
    BookRounded,
    ArrowBackRounded
} from '@mui/icons-material';

export default function CourseInstanceChapters() {
    const router = useRouter();
    const params = useParams();
    const instanceId = params.id;

    const [instance, setInstance] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);

    useEffect(() => {
        if (instanceId) {
            fetchInstanceDetails();
            fetchChapters();
        }
    }, [instanceId]);

    const fetchInstanceDetails = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/course-instances/${instanceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInstance(response.data.instance);
        } catch (error) {
            console.error('Error fetching instance:', error);
            toast.error('Failed to load course instance details');
        }
    };

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/course-instances/${instanceId}/chapters`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChapters(response.data.chapters || []);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            toast.error('Failed to load chapters');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChapter = () => {
        setEditingChapter(null);
        setShowModal(true);
    };

    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter);
        setShowModal(true);
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!confirm('Are you sure you want to delete this chapter? This will also delete all lectures in this chapter.')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/chapters/${chapterId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Chapter deleted successfully');
            fetchChapters();
        } catch (error) {
            console.error('Error deleting chapter:', error);
            toast.error('Failed to delete chapter');
        }
    };

    const handleSubmitChapter = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const data = {
                ...formData,
                course_instance_id: parseInt(instanceId)
            };

            if (editingChapter) {
                await axios.put(`http://localhost:5000/api/admin/chapters/${editingChapter.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Chapter updated successfully');
            } else {
                await axios.post(`http://localhost:5000/api/admin/chapters`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Chapter created successfully');
            }
            
            setShowModal(false);
            fetchChapters();
        } catch (error) {
            console.error('Error saving chapter:', error);
            toast.error('Failed to save chapter');
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Course Chapters">
                <div className="animate-pulse space-y-6">
                    <div className="bg-gray-200 h-8 w-64 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Course Chapters">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
                        >
                            <ArrowBackRounded className="mr-1" />
                            Back to Course Instances
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Manage Chapters
                        </h1>
                        {instance && (
                            <p className="text-gray-600">
                                {instance.course_template?.course_code} - {instance.course_template?.name}
                                {instance.instance_name && ` (${instance.instance_name})`}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleCreateChapter}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        <AddRounded className="mr-2" />
                        Add Chapter
                    </button>
                </div>

                {/* Chapters Grid */}
                {chapters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chapters.map((chapter) => (
                            <div key={chapter.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <BookRounded className="text-primary-600 mr-2" />
                                        <span className="text-sm font-medium text-gray-500">
                                            Chapter {chapter.number}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditChapter(chapter)}
                                            className="text-gray-400 hover:text-blue-600"
                                        >
                                            <EditRounded style={{ fontSize: '18px' }} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteChapter(chapter.id)}
                                            className="text-gray-400 hover:text-red-600"
                                        >
                                            <DeleteRounded style={{ fontSize: '18px' }} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                    {chapter.name}
                                </h3>
                                
                                {chapter.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {chapter.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        {chapter._count?.lectures || 0} lectures
                                    </span>
                                    <button
                                        onClick={() => router.push(`/admin-dashboard/course-instances/${instanceId}/lectures?chapterId=${chapter.id}`)}
                                        className="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        <PlayCircleOutlineRounded className="mr-1" style={{ fontSize: '16px' }} />
                                        Manage Lectures
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BookRounded className="mx-auto text-gray-400 mb-4" style={{ fontSize: '48px' }} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters yet</h3>
                        <p className="text-gray-600 mb-6">
                            Start organizing your course content by creating the first chapter.
                        </p>
                        <button
                            onClick={handleCreateChapter}
                            className="flex items-center mx-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            <AddRounded className="mr-2" />
                            Create First Chapter
                        </button>
                    </div>
                )}

                {/* Chapter Modal */}
                {showModal && (
                    <ChapterModal
                        chapter={editingChapter}
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onSubmit={handleSubmitChapter}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

// Chapter Modal Component
const ChapterModal = ({ chapter, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        number: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (chapter) {
            setFormData({
                name: chapter.name || '',
                description: chapter.description || '',
                number: chapter.number || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                number: ''
            });
        }
        setErrors({});
    }, [chapter, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Chapter name is required';
        }

        if (!formData.number || formData.number < 1) {
            newErrors.number = 'Chapter number must be a positive integer';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                number: parseInt(formData.number)
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">
                    {chapter ? 'Edit Chapter' : 'Create New Chapter'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                            Chapter Number
                        </label>
                        <input
                            type="number"
                            id="number"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            min="1"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.number ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="1"
                        />
                        {errors.number && (
                            <p className="mt-1 text-sm text-red-600">{errors.number}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Chapter Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Introduction to Programming"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Brief description of what this chapter covers..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (chapter ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

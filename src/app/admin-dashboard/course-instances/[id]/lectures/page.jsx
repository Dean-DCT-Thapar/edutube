'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../component/AdminLayout';
import {
    AddRounded,
    EditRounded,
    DeleteRounded,
    FilterListRounded,
    PlayCircleOutlineRounded,
    ArrowBackRounded
} from '@mui/icons-material';

export default function CourseInstanceLectures() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const instanceId = params.id;
    const chapterId = searchParams.get('chapterId');

    const [instance, setInstance] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(chapterId || '');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);

    useEffect(() => {
        if (instanceId) {
            fetchInstanceDetails();
            fetchChapters();
        }
    }, [instanceId]);

    useEffect(() => {
        if (selectedChapter) {
            fetchLectures();
        } else {
            setLectures([]);
        }
    }, [selectedChapter, instanceId]);

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
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/course-instances/${instanceId}/chapters`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChapters(response.data.chapters || []);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            toast.error('Failed to load chapters');
        }
    };

    const fetchLectures = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/course-instances/${instanceId}/lectures?chapterId=${selectedChapter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLectures(response.data.lectures || []);
        } catch (error) {
            console.error('Error fetching lectures:', error);
            toast.error('Failed to load lectures');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLecture = () => {
        if (!selectedChapter) {
            toast.error('Please select a chapter first');
            return;
        }
        setEditingLecture(null);
        setShowModal(true);
    };

    const handleEditLecture = (lecture) => {
        setEditingLecture(lecture);
        setShowModal(true);
    };

    const handleDeleteLecture = async (lectureId) => {
        if (!confirm('Are you sure you want to delete this lecture?')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/lectures/${lectureId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Lecture deleted successfully');
            fetchLectures();
        } catch (error) {
            console.error('Error deleting lecture:', error);
            toast.error('Failed to delete lecture');
        }
    };

    const handleSubmitLecture = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const data = {
                ...formData,
                chapter_id: parseInt(selectedChapter)
            };

            if (editingLecture) {
                await axios.put(`http://localhost:5000/api/admin/lectures/${editingLecture.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Lecture updated successfully');
            } else {
                await axios.post(`http://localhost:5000/api/admin/lectures`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Lecture created successfully');
            }
            
            setShowModal(false);
            fetchLectures();
        } catch (error) {
            console.error('Error saving lecture:', error);
            toast.error('Failed to save lecture');
        }
    };

    const getYouTubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYouTubeThumbnail = (url) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    };

    const selectedChapterName = chapters.find(c => c.id.toString() === selectedChapter)?.name;

    return (
        <AdminLayout title="Course Lectures">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.push(`/admin-dashboard/course-instances/${instanceId}/chapters`)}
                            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
                        >
                            <ArrowBackRounded className="mr-1" />
                            Back to Chapters
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Manage Lectures
                        </h1>
                        {instance && (
                            <p className="text-gray-600">
                                {instance.course_template?.course_code} - {instance.course_template?.name}
                                {instance.instance_name && ` (${instance.instance_name})`}
                                {selectedChapterName && ` • ${selectedChapterName}`}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleCreateLecture}
                        disabled={!selectedChapter}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <AddRounded className="mr-2" />
                        Add Lecture
                    </button>
                </div>

                {/* Chapter Filter */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4">
                        <FilterListRounded className="text-gray-400" />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Chapter
                            </label>
                            <select
                                value={selectedChapter}
                                onChange={(e) => setSelectedChapter(e.target.value)}
                                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Select a chapter to view lectures</option>
                                {chapters.map((chapter) => (
                                    <option key={chapter.id} value={chapter.id}>
                                        Chapter {chapter.number}: {chapter.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lectures List */}
                {selectedChapter ? (
                    loading ? (
                        <div className="animate-pulse space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                            ))}
                        </div>
                    ) : lectures.length > 0 ? (
                        <div className="space-y-4">
                            {lectures.map((lecture) => (
                                <div key={lecture.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start space-x-4">
                                        {/* YouTube Thumbnail */}
                                        <div className="flex-shrink-0">
                                            {getYouTubeThumbnail(lecture.youtube_url) ? (
                                                <img
                                                    src={getYouTubeThumbnail(lecture.youtube_url)}
                                                    alt={lecture.title}
                                                    className="w-32 h-20 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <PlayCircleOutlineRounded className="text-gray-400" style={{ fontSize: '32px' }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Lecture Details */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                                                            Lecture {lecture.lecture_number}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                                        {lecture.title}
                                                    </h3>
                                                    {lecture.description && (
                                                        <p className="text-gray-600 text-sm mb-3">
                                                            {lecture.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <a
                                                            href={lecture.youtube_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-red-600 hover:text-red-700"
                                                        >
                                                            <PlayCircleOutlineRounded className="mr-1" style={{ fontSize: '16px' }} />
                                                            Watch on YouTube
                                                        </a>
                                                        {lecture.duration > 0 && (
                                                            <span>
                                                                Duration: {Math.floor(lecture.duration / 60)}:{String(lecture.duration % 60).padStart(2, '0')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditLecture(lecture)}
                                                        className="text-gray-400 hover:text-blue-600"
                                                    >
                                                        <EditRounded style={{ fontSize: '20px' }} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteLecture(lecture.id)}
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <DeleteRounded style={{ fontSize: '20px' }} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <PlayCircleOutlineRounded className="mx-auto text-gray-400 mb-4" style={{ fontSize: '48px' }} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No lectures yet</h3>
                            <p className="text-gray-600 mb-6">
                                Start adding lectures to this chapter from YouTube videos.
                            </p>
                            <button
                                onClick={handleCreateLecture}
                                className="flex items-center mx-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                                <AddRounded className="mr-2" />
                                Add First Lecture
                            </button>
                        </div>
                    )
                ) : (
                    <div className="text-center py-12">
                        <FilterListRounded className="mx-auto text-gray-400 mb-4" style={{ fontSize: '48px' }} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Chapter</h3>
                        <p className="text-gray-600">
                            Choose a chapter from the dropdown above to view and manage its lectures.
                        </p>
                    </div>
                )}

                {/* Lecture Modal */}
                {showModal && (
                    <LectureModal
                        lecture={editingLecture}
                        chapterId={selectedChapter}
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        onSubmit={handleSubmitLecture}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

// Lecture Modal Component
const LectureModal = ({ lecture, chapterId, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtube_url: '',
        lecture_number: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lecture) {
            setFormData({
                title: lecture.title || '',
                description: lecture.description || '',
                youtube_url: lecture.youtube_url || '',
                lecture_number: lecture.lecture_number || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                youtube_url: '',
                lecture_number: ''
            });
        }
        setErrors({});
    }, [lecture, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Lecture title is required';
        }

        if (!formData.youtube_url.trim()) {
            newErrors.youtube_url = 'YouTube URL is required';
        } else if (!formData.youtube_url.includes('youtube.com') && !formData.youtube_url.includes('youtu.be')) {
            newErrors.youtube_url = 'Please enter a valid YouTube URL';
        }

        if (!formData.lecture_number || formData.lecture_number < 1) {
            newErrors.lecture_number = 'Lecture number must be a positive integer';
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
                lecture_number: parseInt(formData.lecture_number)
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
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
                <h3 className="text-lg font-semibold mb-4">
                    {lecture ? 'Edit Lecture' : 'Create New Lecture'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="lecture_number" className="block text-sm font-medium text-gray-700 mb-1">
                            Lecture Number
                        </label>
                        <input
                            type="number"
                            id="lecture_number"
                            name="lecture_number"
                            value={formData.lecture_number}
                            onChange={handleChange}
                            min="1"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.lecture_number ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="1"
                        />
                        {errors.lecture_number && (
                            <p className="mt-1 text-sm text-red-600">{errors.lecture_number}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Lecture Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Introduction to Variables"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
                            YouTube URL
                        </label>
                        <input
                            type="url"
                            id="youtube_url"
                            name="youtube_url"
                            value={formData.youtube_url}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.youtube_url ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {errors.youtube_url && (
                            <p className="mt-1 text-sm text-red-600">{errors.youtube_url}</p>
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
                            placeholder="Brief description of what this lecture covers..."
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
                            {loading ? 'Saving...' : (lecture ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

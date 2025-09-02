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
    ArrowBackRounded,
    DragIndicatorRounded
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
            const response = await axios.get(`http://localhost:5000/api/admin/course-instances/${instanceId}`, {
                withCredentials: true
            });
            setInstance(response.data.instance);
        } catch (error) {
            console.error('Error fetching instance:', error);
            toast.error('Failed to load course instance details');
        }
    };

    const fetchChapters = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/course-instances/${instanceId}/chapters`, {
                withCredentials: true
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
            const response = await axios.get(`http://localhost:5000/api/admin/course-instances/${instanceId}/lectures?chapterId=${selectedChapter}&limit=1000`, {
                withCredentials: true
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
            await axios.delete(`/api/admin/lectures/${lectureId}`, {
                withCredentials: true
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
            const data = {
                ...formData,
                chapter_id: parseInt(selectedChapter)
            };

            if (editingLecture) {
                // Use the with-tags endpoint for updating
                await axios.put(`/api/admin/lectures/${editingLecture.id}/with-tags`, data, {
                    withCredentials: true
                });
                toast.success('Lecture updated successfully');
            } else {
                // Create lecture with tags
                await axios.post(`/api/admin/lectures`, data, {
                    withCredentials: true
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

    // Drag and Drop functions for reordering lectures
    const [draggedLecture, setDraggedLecture] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handleDragStart = (e, lecture, index) => {
        setDraggedLecture({ lecture, index });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault();
        setDragOverIndex(null);

        if (!draggedLecture || draggedLecture.index === dropIndex) {
            setDraggedLecture(null);
            return;
        }

        const reorderedLectures = [...lectures];
        const [draggedItem] = reorderedLectures.splice(draggedLecture.index, 1);
        reorderedLectures.splice(dropIndex, 0, draggedItem);

        // Update lecture numbers based on new order
        const updatedLectures = reorderedLectures.map((lecture, index) => ({
            ...lecture,
            lecture_number: index + 1
        }));

        // Optimistically update the UI
        setLectures(updatedLectures);

        try {
            // Send reorder request to backend
            await axios.put(`/api/admin/lectures/reorder`, {
                chapterId: selectedChapter,
                lectureOrders: updatedLectures.map(lecture => ({
                    id: lecture.id,
                    lecture_number: lecture.lecture_number
                }))
            }, {
                withCredentials: true
            });

            toast.success('Lectures reordered successfully');
        } catch (error) {
            console.error('Error reordering lectures:', error);
            toast.error('Failed to reorder lectures');
            // Revert changes on error
            fetchLectures();
        }

        setDraggedLecture(null);
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
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center">
                                    <DragIndicatorRounded className="text-blue-600 mr-2" />
                                    <p className="text-sm text-blue-800">
                                        <strong>Tip:</strong> Drag and drop lectures to reorder them. The lecture numbers will be automatically updated based on their position.
                                    </p>
                                </div>
                            </div>
                            {lectures.map((lecture, index) => (
                                <div 
                                    key={lecture.id} 
                                    className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-move ${
                                        dragOverIndex === index ? 'border-primary-500 bg-primary-50' : ''
                                    }`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lecture, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, index)}
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Drag Handle */}
                                        <div className="flex-shrink-0 flex items-center">
                                            <DragIndicatorRounded className="text-gray-400 cursor-grab active:cursor-grabbing" />
                                        </div>

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
                                                    {lecture.tags && lecture.tags.length > 0 && (
                                                        <div className="mb-3">
                                                            <div className="flex flex-wrap gap-1">
                                                                {lecture.tags.map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                                                    >
                                                                        #{tag.tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
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

// Tag Input Component
const TagInput = ({ tags, onTagsChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            // Remove last tag if input is empty and backspace is pressed
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmedValue = inputValue.trim().toLowerCase();
        if (trimmedValue && !tags.includes(trimmedValue) && tags.length < 10) {
            onTagsChange([...tags, trimmedValue]);
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove) => {
        onTagsChange(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        // Don't allow commas in the input, they trigger tag creation
        if (!value.includes(',')) {
            setInputValue(value);
        } else {
            // If comma is typed, add the tag
            setInputValue(value.replace(',', ''));
            addTag();
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 text-primary-600 hover:text-primary-800 focus:outline-none"
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="flex-1 min-w-[120px] border-none outline-none bg-transparent"
                    disabled={tags.length >= 10}
                />
            </div>
            {tags.length >= 10 && (
                <p className="mt-1 text-xs text-amber-600">
                    Maximum 10 tags reached
                </p>
            )}
        </div>
    );
};

// Lecture Modal Component
const LectureModal = ({ lecture, chapterId, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtube_url: '',
        tags: []
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lecture) {
            setFormData({
                title: lecture.title || '',
                description: lecture.description || '',
                youtube_url: lecture.youtube_url || '',
                tags: lecture.tags ? lecture.tags.map(tag => tag.tag) : []
            });
        } else {
            setFormData({
                title: '',
                description: '',
                youtube_url: '',
                tags: []
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
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

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (Optional)
                        </label>
                        <TagInput
                            tags={formData.tags}
                            onTagsChange={(newTags) => setFormData(prev => ({ ...prev, tags: newTags }))}
                            placeholder="Add tags to help students find this lecture..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Press Enter or comma to add a tag. Maximum 10 tags.
                        </p>
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

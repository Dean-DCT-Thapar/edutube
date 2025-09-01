'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../component/AdminLayout';
import {
    AddRounded,
    EditRounded,
    DeleteRounded,
    AutoStoriesRounded,
    DragIndicatorRounded,
    VideoLibraryRounded,
    ExpandMoreRounded,
    ExpandLessRounded
} from '@mui/icons-material';

const ChaptersPage = () => {
    const [chapters, setChapters] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(true);
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingChapter, setDeletingChapter] = useState(null);
    const [expandedChapters, setExpandedChapters] = useState(new Set());

    // Chapter form data
    const [chapterForm, setChapterForm] = useState({
        name: '',
        description: '',
        number: 1
    });
    const [formErrors, setFormErrors] = useState({});

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/courses?limit=100', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data.courses);
            
            if (response.data.courses.length > 0 && !selectedCourseId) {
                setSelectedCourseId(response.data.courses[0].id.toString());
            }
        } catch (error) {
            toast.error('Failed to fetch courses');
        }
    };

    const fetchChapters = async (courseId) => {
        if (!courseId) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/courses/${courseId}/chapters`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChapters(response.data.chapters || []);
        } catch (error) {
            toast.error('Failed to fetch chapters');
            setChapters([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchChapters(selectedCourseId);
        } else {
            setChapters([]);
            setLoading(false);
        }
    }, [selectedCourseId]);

    const validateChapterForm = () => {
        const errors = {};
        
        if (!chapterForm.name.trim()) {
            errors.name = 'Chapter name is required';
        }
        
        if (!chapterForm.number || chapterForm.number < 1) {
            errors.number = 'Chapter number must be 1 or greater';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateChapter = async (e) => {
        e.preventDefault();
        
        if (!validateChapterForm()) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:5000/api/admin/chapters', {
                ...chapterForm,
                course_id: parseInt(selectedCourseId),
                number: parseInt(chapterForm.number)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Chapter created successfully');
            setShowChapterModal(false);
            resetForm();
            fetchChapters(selectedCourseId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create chapter');
        }
    };

    const handleUpdateChapter = async (e) => {
        e.preventDefault();
        
        if (!validateChapterForm()) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/chapters/${editingChapter.id}`, {
                ...chapterForm,
                number: parseInt(chapterForm.number)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Chapter updated successfully');
            setShowChapterModal(false);
            setEditingChapter(null);
            resetForm();
            fetchChapters(selectedCourseId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update chapter');
        }
    };

    const handleDeleteChapter = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/chapters/${deletingChapter.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Chapter deleted successfully');
            setShowDeleteDialog(false);
            setDeletingChapter(null);
            fetchChapters(selectedCourseId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete chapter');
        }
    };

    const openCreateModal = () => {
        const nextNumber = chapters.length > 0 ? Math.max(...chapters.map(c => c.number)) + 1 : 1;
        setChapterForm({
            name: '',
            description: '',
            number: nextNumber
        });
        setEditingChapter(null);
        setShowChapterModal(true);
    };

    const openEditModal = (chapter) => {
        setChapterForm({
            name: chapter.name,
            description: chapter.description || '',
            number: chapter.number
        });
        setEditingChapter(chapter);
        setShowChapterModal(true);
    };

    const resetForm = () => {
        setChapterForm({ name: '', description: '', number: 1 });
        setFormErrors({});
    };

    const toggleChapterExpansion = (chapterId) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    };

    const selectedCourse = courses.find(course => course.id.toString() === selectedCourseId);

    return (
        <AdminLayout title="Chapter Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Organize course content into structured chapters
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        disabled={!selectedCourseId}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <AddRounded className="mr-2" />
                        Add Chapter
                    </button>
                </div>

                {/* Course Selection */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                            <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Course
                            </label>
                            <select
                                id="courseSelect"
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="">Choose a course...</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} - {course.teacher?.user?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedCourse && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">{selectedCourse.name}</p>
                                    <p className="text-gray-600">Teacher: {selectedCourse.teacher?.user?.name}</p>
                                    <p className="text-gray-500">{chapters.length} chapters</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chapters Content */}
                {!selectedCourseId ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <AutoStoriesRounded className="text-gray-300 text-6xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                        <p className="text-gray-600">Choose a course from the dropdown above to view and manage its chapters.</p>
                    </div>
                ) : loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            <span className="ml-3 text-gray-600">Loading chapters...</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        {chapters.length === 0 ? (
                            <div className="p-12 text-center">
                                <AutoStoriesRounded className="text-gray-300 text-6xl mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Chapters Yet</h3>
                                <p className="text-gray-600 mb-4">
                                    Start organizing your course content by creating the first chapter.
                                </p>
                                <button
                                    onClick={openCreateModal}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                                >
                                    <AddRounded className="mr-2" />
                                    Create First Chapter
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Chapter
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Lectures
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {chapters.map((chapter) => (
                                            <tr key={chapter.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-primary-600 font-bold">{chapter.number}</span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {chapter.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">
                                                        {chapter.description || 'No description'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <VideoLibraryRounded className="w-4 h-4 mr-1 text-gray-400" />
                                                        {chapter._count?.lectures || 0} lectures
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(chapter.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(chapter)}
                                                            className="text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                                                            title="Edit chapter"
                                                        >
                                                            <EditRounded className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setDeletingChapter(chapter);
                                                                setShowDeleteDialog(true);
                                                            }}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            title="Delete chapter"
                                                        >
                                                            <DeleteRounded className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Chapter Modal */}
                {showChapterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <form onSubmit={editingChapter ? handleUpdateChapter : handleCreateChapter}>
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
                                    </h3>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label htmlFor="chapterName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Chapter Name
                                        </label>
                                        <input
                                            type="text"
                                            id="chapterName"
                                            value={chapterForm.name}
                                            onChange={(e) => setChapterForm(prev => ({ ...prev, name: e.target.value }))}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                                formErrors.name ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="e.g., Introduction, Advanced Topics"
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="chapterDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            id="chapterDescription"
                                            rows={3}
                                            value={chapterForm.description}
                                            onChange={(e) => setChapterForm(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="Brief description of what this chapter covers"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="chapterNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Chapter Number
                                        </label>
                                        <input
                                            type="number"
                                            id="chapterNumber"
                                            min="1"
                                            value={chapterForm.number}
                                            onChange={(e) => setChapterForm(prev => ({ ...prev, number: parseInt(e.target.value) || 1 }))}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                                formErrors.number ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.number && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.number}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowChapterModal(false);
                                            setEditingChapter(null);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700"
                                    >
                                        {editingChapter ? 'Update Chapter' : 'Create Chapter'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Chapter</h3>
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to delete "{deletingChapter?.name}"? This will also delete all lectures within this chapter. This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteDialog(false);
                                            setDeletingChapter(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteChapter}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                                    >
                                        Delete Chapter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ChaptersPage;

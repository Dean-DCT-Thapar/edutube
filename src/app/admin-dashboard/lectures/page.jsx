'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../component/AdminLayout';
import LectureTable from '../../component/LectureTable';
import LectureModal from '../../component/LectureModal';
import ConfirmDialog from '../../component/ConfirmDialog';
import {
    AddRounded,
    SearchRounded,
    FilterListRounded,
    VideoLibraryRounded
} from '@mui/icons-material';

const LecturesPage = () => {
    const [lectures, setLectures] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingLecture, setDeletingLecture] = useState(null);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/courses?limit=100', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCourses(response.data.courses);
            
            // Auto-select first course if available
            if (response.data.courses.length > 0 && !selectedCourseId) {
                setSelectedCourseId(response.data.courses[0].id.toString());
            }
        } catch (error) {
            toast.error('Failed to fetch courses');
        }
    };

    const fetchLectures = async (courseId) => {
        if (!courseId) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/courses/${courseId}/lectures`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLectures(response.data.lectures);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Failed to fetch lectures');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            fetchLectures(selectedCourseId);
        } else {
            setLectures([]);
            setLoading(false);
        }
    }, [selectedCourseId]);

    const handleCreateLecture = async (lectureData) => {
        try {
            const token = localStorage.getItem('adminToken');
            
            // Create the lecture with all required fields
            const lecturePayload = {
                title: lectureData.title,
                description: lectureData.description,
                youtube_url: lectureData.youtube_url,
                course_id: parseInt(selectedCourseId),
                chapter_id: parseInt(lectureData.chapter_id),
                lecture_number: parseInt(lectureData.lecture_number)
            };

            const response = await axios.post('http://localhost:5000/api/admin/lectures', lecturePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // If tags were provided, add them to the lecture
            if (lectureData.tags && lectureData.tags.length > 0) {
                await axios.post(`http://localhost:5000/api/admin/lectures/${response.data.lecture.id}/tags`, {
                    tags: lectureData.tags
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            toast.success('Lecture created successfully');
            setShowLectureModal(false);
            fetchLectures(selectedCourseId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create lecture');
        }
    };

    const handleUpdateLecture = async (lectureData) => {
        try {
            const token = localStorage.getItem('adminToken');
            
            // Update lecture basic information
            const lecturePayload = {
                title: lectureData.title,
                description: lectureData.description,
                youtube_url: lectureData.youtube_url,
                chapter_id: parseInt(lectureData.chapter_id),
                lecture_number: parseInt(lectureData.lecture_number)
            };

            await axios.put(`http://localhost:5000/api/admin/lectures/${editingLecture.id}`, lecturePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update tags if provided
            if (lectureData.tags !== undefined) {
                // Use the with-tags endpoint to update both lecture and tags
                await axios.put(`http://localhost:5000/api/admin/lectures/${editingLecture.id}/with-tags`, {
                    ...lecturePayload,
                    tags: lectureData.tags
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            toast.success('Lecture updated successfully');
            setShowLectureModal(false);
            setEditingLecture(null);
            fetchLectures(selectedCourseId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update lecture');
        }
    };

    const handleDeleteLecture = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/lectures/${deletingLecture.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Lecture deleted successfully');
            setShowDeleteDialog(false);
            setDeletingLecture(null);
            fetchLectures(selectedCourseId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete lecture');
        }
    };

    const handleEdit = (lecture) => {
        setEditingLecture(lecture);
        setShowLectureModal(true);
    };

    const handleDelete = (lecture) => {
        setDeletingLecture(lecture);
        setShowDeleteDialog(true);
    };

    const selectedCourse = courses.find(course => course.id.toString() === selectedCourseId);

    return (
        <AdminLayout title="Lecture Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lectures</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage course lectures and video content
                        </p>
                    </div>
                    <button
                        onClick={() => setShowLectureModal(true)}
                        disabled={!selectedCourseId}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <AddRounded className="mr-2" />
                        Add Lecture
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
                                    <p className="text-gray-500">{selectedCourse._count?.lectures || 0} lectures</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lectures Content */}
                {!selectedCourseId ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <VideoLibraryRounded className="text-gray-300 text-6xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                        <p className="text-gray-600">Choose a course from the dropdown above to view and manage its lectures.</p>
                    </div>
                ) : (
                    <LectureTable
                        lectures={lectures}
                        loading={loading}
                        selectedCourse={selectedCourse}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}

                {/* Lecture Modal */}
                {showLectureModal && (
                    <LectureModal
                        lecture={editingLecture}
                        course={selectedCourse}
                        isOpen={showLectureModal}
                        onClose={() => {
                            setShowLectureModal(false);
                            setEditingLecture(null);
                        }}
                        onSubmit={editingLecture ? handleUpdateLecture : handleCreateLecture}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <ConfirmDialog
                        isOpen={showDeleteDialog}
                        title="Delete Lecture"
                        message={`Are you sure you want to delete "${deletingLecture?.title}"? This will also remove all watch history for this lecture. This action cannot be undone.`}
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onConfirm={handleDeleteLecture}
                        onCancel={() => {
                            setShowDeleteDialog(false);
                            setDeletingLecture(null);
                        }}
                        type="danger"
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default LecturesPage;

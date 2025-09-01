'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../component/AdminLayout';
import CourseTable from '../../component/CourseTable';
import CourseModal from '../../component/CourseModal';
import ConfirmDialog from '../../component/ConfirmDialog';
import {
    AddRounded,
    SearchRounded,
    FilterListRounded
} from '@mui/icons-material';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        teacherId: 'all'
    });
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'all') {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`http://localhost:5000/api/admin/courses?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCourses(response.data.courses);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/teachers/dropdown', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeachers(response.data);
        } catch (error) {
            console.error('Failed to fetch teachers:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [filters]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleCreateCourse = async (courseData) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:5000/api/admin/courses', courseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Course created successfully');
            setShowCourseModal(false);
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create course');
        }
    };

    const handleUpdateCourse = async (courseData) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/courses/${editingCourse.id}`, courseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Course updated successfully');
            setShowCourseModal(false);
            setEditingCourse(null);
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update course');
        }
    };

    const handleDeleteCourse = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/courses/${deletingCourse.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Course deleted successfully');
            setShowDeleteDialog(false);
            setDeletingCourse(null);
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete course');
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowCourseModal(true);
    };

    const handleDelete = (course) => {
        setDeletingCourse(course);
        setShowDeleteDialog(true);
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleTeacherFilter = (teacherId) => {
        setFilters(prev => ({ ...prev, teacherId, page: 1 }));
    };

    return (
        <AdminLayout title="Course Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage courses and their content
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCourseModal(true)}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <AddRounded className="mr-2" />
                        Add Course
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <SearchRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={filters.search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Teacher Filter */}
                        <div className="sm:w-48">
                            <select
                                value={filters.teacherId}
                                onChange={(e) => handleTeacherFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="all">All Teachers</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Courses Table */}
                <CourseTable
                    courses={courses}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* Course Modal */}
                {showCourseModal && (
                    <CourseModal
                        course={editingCourse}
                        teachers={teachers}
                        isOpen={showCourseModal}
                        onClose={() => {
                            setShowCourseModal(false);
                            setEditingCourse(null);
                        }}
                        onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <ConfirmDialog
                        isOpen={showDeleteDialog}
                        title="Delete Course"
                        message={`Are you sure you want to delete "${deletingCourse?.name}"? This will also delete all lectures and enrollments associated with this course. This action cannot be undone.`}
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onConfirm={handleDeleteCourse}
                        onCancel={() => {
                            setShowDeleteDialog(false);
                            setDeletingCourse(null);
                        }}
                        type="danger"
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default CoursesPage;

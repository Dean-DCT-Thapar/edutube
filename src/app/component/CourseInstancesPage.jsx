'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from './AdminLayout';
import {
    AddRounded,
    SearchRounded,
    EditRounded,
    DeleteRounded,
    GroupRounded,
    SchoolRounded,
    PersonRounded,
    CalendarTodayRounded,
    VisibilityRounded,
    FilterListRounded,
    BookmarkRounded
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const CourseInstancesPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateId = searchParams?.get('template');

    const [instances, setInstances] = useState([]);
    const [courseTemplates, setCourseTemplates] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        search: '',
        teacher_id: '',
        course_template_id: templateId || ''
    });
    const [showModal, setShowModal] = useState(false);
    const [editingInstance, setEditingInstance] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingInstance, setDeletingInstance] = useState(null);

    const fetchInstances = async (page = 1) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await fetch(`http://localhost:5000/api/admin/course-instances?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setInstances(data.instances || []);
                setPagination(data.pagination || {});
            } else {
                throw new Error('Failed to fetch course instances');
            }
        } catch (error) {
            console.error('Error fetching instances:', error);
            toast.error('Failed to load course instances');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseTemplates = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/course-templates/dropdown', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCourseTemplates(data);
            }
        } catch (error) {
            console.error('Error fetching course templates:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/admin/teachers?limit=100', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setTeachers(data.teachers || []);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    useEffect(() => {
        fetchCourseTemplates();
        fetchTeachers();
    }, []);

    useEffect(() => {
        fetchInstances();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchInstances(1);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            teacher_id: '',
            course_template_id: ''
        });
    };

    const handleCreate = () => {
        setEditingInstance(null);
        setShowModal(true);
    };

    const handleEdit = (instance) => {
        setEditingInstance(instance);
        setShowModal(true);
    };

    const handleDelete = (instance) => {
        setDeletingInstance(instance);
        setShowDeleteDialog(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingInstance 
                ? `http://localhost:5000/api/admin/course-instances/${editingInstance.id}`
                : 'http://localhost:5000/api/admin/course-instances';
            
            const method = editingInstance ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(`Course instance ${editingInstance ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                fetchInstances();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Operation failed');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:5000/api/admin/course-instances/${deletingInstance.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Course instance deleted successfully');
                setShowDeleteDialog(false);
                setDeletingInstance(null);
                fetchInstances();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete instance');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <AdminLayout title="Course Instances">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Course Instances</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Teacher-specific implementations of course templates
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <AddRounded className="mr-2" />
                        Add Instance
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                <input
                                    type="text"
                                    placeholder="Instance name or course..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Template</label>
                                <select
                                    value={filters.course_template_id}
                                    onChange={(e) => handleFilterChange('course_template_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">All Templates</option>
                                    {courseTemplates.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.course_code} - {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                                <select
                                    value={filters.teacher_id}
                                    onChange={(e) => handleFilterChange('teacher_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="">All Teachers</option>
                                    {teachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.user?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                                >
                                    <SearchRounded className="mr-1" style={{ fontSize: '18px' }} />
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                                >
                                    <FilterListRounded className="mr-1" style={{ fontSize: '18px' }} />
                                    Clear
                                </button>
                            </div>
                            
                            {(filters.search || filters.teacher_id || filters.course_template_id) && (
                                <span className="text-sm text-gray-500">
                                    Filtered results
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Instances Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="space-y-2 mb-4">
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="flex space-x-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {instances.map((instance) => (
                            <div key={instance.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <GroupRounded className="text-green-600" />
                                        </div>
                                        <div className="ml-3">
                                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                {instance.course_template?.course_code}
                                            </span>
                                        </div>
                                    </div>
                                    {!instance.is_active && (
                                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {instance.course_template?.name}
                                </h3>
                                
                                {instance.instance_name && (
                                    <p className="text-sm font-medium text-blue-600 mb-2">
                                        {instance.instance_name}
                                    </p>
                                )}
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <PersonRounded className="mr-2" style={{ fontSize: '16px' }} />
                                        <span>{instance.teacher?.user?.name}</span>
                                    </div>
                                    {instance.instance_name && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <CalendarTodayRounded className="mr-2" style={{ fontSize: '16px' }} />
                                            <span>{instance.instance_name}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span>{instance._count?.chapters || 0} chapters</span>
                                    <span>{instance._count?.enrollments || 0} students</span>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => router.push(`/admin-dashboard/course-instances/${instance.id}/chapters`)}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Manage Content →
                                    </button>
                                    
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => handleEdit(instance)}
                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                            title="Edit Instance"
                                        >
                                            <EditRounded style={{ fontSize: '18px' }} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(instance)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete Instance"
                                        >
                                            <DeleteRounded style={{ fontSize: '18px' }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && instances.length === 0 && (
                    <div className="text-center py-12">
                        <GroupRounded className="text-gray-300 text-6xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No course instances found</h3>
                        <p className="text-gray-600 mb-4">
                            {Object.values(filters).some(f => f) ? 
                                'Try adjusting your filters.' : 
                                'Teachers can create instances from course templates.'}
                        </p>
                        {!Object.values(filters).some(f => f) && (
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                            >
                                <AddRounded className="mr-2" />
                                Create Course Instance
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => fetchInstances(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchInstances(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages}
                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                                    <span className="font-medium">{pagination.totalPages}</span> ({pagination.total} total)
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => fetchInstances(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchInstances(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Instance Modal */}
            {showModal && (
                <CourseInstanceModal
                    instance={editingInstance}
                    courseTemplates={courseTemplates}
                    teachers={teachers}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteDialog && (
                <DeleteConfirmationDialog
                    isOpen={showDeleteDialog}
                    title="Delete Course Instance"
                    message={`Are you sure you want to delete this course instance? This will also delete all associated chapters, lectures, and enrollment data.`}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteDialog(false);
                        setDeletingInstance(null);
                    }}
                />
            )}
        </AdminLayout>
    );
};

// Course Instance Modal Component
const CourseInstanceModal = ({ instance, courseTemplates, teachers, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        course_template_id: '',
        teacher_id: '',
        instance_name: '',
        is_active: true
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (instance) {
            setFormData({
                course_template_id: instance.course_template_id || '',
                teacher_id: instance.teacher_id || '',
                instance_name: instance.instance_name || '',
                is_active: instance.is_active ?? true
            });
        } else {
            setFormData({
                course_template_id: '',
                teacher_id: '',
                instance_name: '',
                is_active: true
            });
        }
        setErrors({});
    }, [instance, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.course_template_id) {
            newErrors.course_template_id = 'Course template is required';
        }

        if (!formData.teacher_id) {
            newErrors.teacher_id = 'Teacher is required';
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
                course_template_id: parseInt(formData.course_template_id),
                teacher_id: parseInt(formData.teacher_id)
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {instance ? 'Edit Course Instance' : 'Create Course Instance'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="course_template_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Template
                        </label>
                        <select
                            id="course_template_id"
                            name="course_template_id"
                            value={formData.course_template_id}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.course_template_id ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select a course template...</option>
                            {courseTemplates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.course_code} - {template.name}
                                </option>
                            ))}
                        </select>
                        {errors.course_template_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.course_template_id}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Teacher
                        </label>
                        <select
                            id="teacher_id"
                            name="teacher_id"
                            value={formData.teacher_id}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.teacher_id ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select a teacher...</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.user?.name} ({teacher.user?.email})
                                </option>
                            ))}
                        </select>
                        {errors.teacher_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="instance_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Instance Name (Optional)
                        </label>
                        <input
                            type="text"
                            id="instance_name"
                            name="instance_name"
                            value={formData.instance_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="e.g., Morning Batch, Evening Section"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Optional identifier for multiple sections by the same teacher
                        </p>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                            Active instance (students can enroll)
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : instance ? 'Update Instance' : 'Create Instance'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Delete Confirmation Dialog (reused from CourseTemplatesPage)
const DeleteConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInstancesPage;

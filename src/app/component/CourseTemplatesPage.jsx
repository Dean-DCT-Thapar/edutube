'use client';
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
    AddRounded,
    SearchRounded,
    EditRounded,
    DeleteRounded,
    SchoolRounded,
    PeopleRounded,
    VisibilityRounded,
    FilterListRounded
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const CourseTemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingTemplate, setDeletingTemplate] = useState(null);

    const fetchTemplates = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });
            
            if (search) {
                params.append('search', search);
            }

            const response = await fetch(`http://localhost:5000/api/admin/course-templates?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setTemplates(data.templates || []);
                setPagination(data.pagination || {});
            } else {
                throw new Error('Failed to fetch course templates');
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
            toast.error('Failed to load course templates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTemplates(1, searchQuery);
    };

    const handleCreate = () => {
        setEditingTemplate(null);
        setShowModal(true);
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setShowModal(true);
    };

    const handleDelete = (template) => {
        setDeletingTemplate(template);
        setShowDeleteDialog(true);
    };

    const handleSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const url = editingTemplate 
                ? `http://localhost:5000/api/admin/course-templates/${editingTemplate.id}`
                : 'http://localhost:5000/api/admin/course-templates';
            
            const method = editingTemplate ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(`Course template ${editingTemplate ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                fetchTemplates();
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
            const response = await fetch(`http://localhost:5000/api/admin/course-templates/${deletingTemplate.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Course template deleted successfully');
                setShowDeleteDialog(false);
                setDeletingTemplate(null);
                fetchTemplates();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete template');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <AdminLayout title="Course Templates">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Course Templates</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Master course definitions that teachers can use to create course instances
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <AddRounded className="mr-2" />
                        Add Template
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by course code or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                        >
                            <SearchRounded className="mr-1" />
                            Search
                        </button>
                    </form>
                </div>

                {/* Templates Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="flex justify-between items-center">
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
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
                        {templates.map((template) => (
                            <div key={template.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <SchoolRounded className="text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                                {template.course_code}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {template.name}
                                </h3>
                                
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                    {template.description || 'No description provided'}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <PeopleRounded className="mr-1" style={{ fontSize: '16px' }} />
                                        <span>{template._count?.course_instances || 0} instances</span>
                                    </div>
                                    
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => window.location.href = `/admin-dashboard/course-instances?template=${template.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            title="View Instances"
                                        >
                                            <VisibilityRounded style={{ fontSize: '18px' }} />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(template)}
                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                            title="Edit Template"
                                        >
                                            <EditRounded style={{ fontSize: '18px' }} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(template)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete Template"
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
                {!loading && templates.length === 0 && (
                    <div className="text-center py-12">
                        <SchoolRounded className="text-gray-300 text-6xl mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No course templates found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first course template.'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleCreate}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                            >
                                <AddRounded className="mr-2" />
                                Create Course Template
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={() => fetchTemplates(pagination.page - 1, searchQuery)}
                                disabled={pagination.page <= 1}
                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchTemplates(pagination.page + 1, searchQuery)}
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
                                    onClick={() => fetchTemplates(pagination.page - 1, searchQuery)}
                                    disabled={pagination.page <= 1}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchTemplates(pagination.page + 1, searchQuery)}
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

            {/* Template Modal */}
            {showModal && (
                <CourseTemplateModal
                    template={editingTemplate}
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteDialog && (
                <DeleteConfirmationDialog
                    isOpen={showDeleteDialog}
                    title="Delete Course Template"
                    message={`Are you sure you want to delete "${deletingTemplate?.course_code} - ${deletingTemplate?.name}"? This will also delete all associated course instances and their content.`}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteDialog(false);
                        setDeletingTemplate(null);
                    }}
                />
            )}
        </AdminLayout>
    );
};

// Course Template Modal Component
const CourseTemplateModal = ({ template, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        course_code: '',
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (template) {
            setFormData({
                course_code: template.course_code || '',
                name: template.name || '',
                description: template.description || ''
            });
        } else {
            setFormData({
                course_code: '',
                name: '',
                description: ''
            });
        }
        setErrors({});
    }, [template, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.course_code.trim()) {
            newErrors.course_code = 'Course code is required';
        } else if (!/^[A-Za-z0-9]{6,10}$/.test(formData.course_code)) {
            newErrors.course_code = 'Course code must be 6-10 alphanumeric characters';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Course name is required';
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
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
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
                        {template ? 'Edit Course Template' : 'Create Course Template'}
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
                        <label htmlFor="course_code" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Code
                        </label>
                        <input
                            type="text"
                            id="course_code"
                            name="course_code"
                            value={formData.course_code}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                errors.course_code ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="e.g., CS101A, MATH201"
                            disabled={!!template} // Disable editing course code
                        />
                        {errors.course_code && (
                            <p className="mt-1 text-sm text-red-600">{errors.course_code}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            6-10 alphanumeric characters (cannot be changed after creation)
                        </p>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Name
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
                            placeholder="e.g., Introduction to Programming"
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
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                            placeholder="Brief description of the course..."
                        />
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
                            {loading ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Delete Confirmation Dialog
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

export default CourseTemplatesPage;

'use client';
import React, { useState, useEffect } from 'react';
import {
    CloseRounded,
    MenuBookRounded,
    TitleRounded,
    DescriptionRounded,
    SchoolRounded
} from '@mui/icons-material';

const CourseModal = ({ course, teachers, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        teacher_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name || '',
                description: course.description || '',
                teacher_id: course.teacher_id?.toString() || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                teacher_id: ''
            });
        }
        setErrors({});
    }, [course, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Course name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Course description is required';
        }

        if (!formData.teacher_id) {
            newErrors.teacher_id = 'Please select a teacher';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                teacher_id: parseInt(formData.teacher_id)
            };
            await onSubmit(submitData);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MenuBookRounded className="text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {course ? 'Edit Course' : 'Add New Course'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {course ? 'Update course information' : 'Create a new course'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                    >
                        <CloseRounded />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Course Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Name
                        </label>
                        <div className="relative">
                            <TitleRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter course name"
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Course Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Description
                        </label>
                        <div className="relative">
                            <DescriptionRounded className="absolute left-3 top-3 text-gray-400" />
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter course description"
                            />
                        </div>
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Teacher Assignment */}
                    <div>
                        <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Teacher
                        </label>
                        <div className="relative">
                            <SchoolRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                id="teacher_id"
                                name="teacher_id"
                                value={formData.teacher_id}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                    errors.teacher_id ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select a teacher...</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name} ({teacher.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.teacher_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>
                        )}
                        {teachers.length === 0 && (
                            <p className="mt-1 text-sm text-yellow-600">
                                No teachers available. Create teachers first before adding courses.
                            </p>
                        )}
                    </div>

                    {/* Info box */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <MenuBookRounded className="text-purple-600 mr-2 mt-0.5" />
                            <div className="text-sm text-purple-800">
                                <p className="font-medium mb-1">Course Management</p>
                                <ul className="text-xs space-y-1">
                                    <li>• Courses can be assigned to only one teacher</li>
                                    <li>• Teachers can manage course content and lectures</li>
                                    <li>• Students can enroll in courses to access content</li>
                                    <li>• Course statistics track student progress</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || teachers.length === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseModal;

'use client';
import React from 'react';
import {
    EditRounded,
    DeleteRounded,
    MenuBookRounded,
    VideoLibraryRounded,
    PeopleRounded,
    SchoolRounded
} from '@mui/icons-material';

const CourseTable = ({ courses, loading, pagination, onPageChange, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="animate-pulse p-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="w-20 h-6 bg-gray-200 rounded"></div>
                                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teacher
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stats
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
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <MenuBookRounded className="text-gray-300 text-4xl mb-2" />
                                    <p className="text-gray-500">No courses found</p>
                                </td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <MenuBookRounded className="text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {course.name}
                                                </div>
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {course.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <SchoolRounded className="text-blue-600 text-sm" />
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {course.teacher?.user?.name || 'Unassigned'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {course.teacher?.user?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center text-xs text-gray-600">
                                                <VideoLibraryRounded className="text-gray-400 mr-1 text-sm" />
                                                {course._count?.lectures || 0} lectures
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600">
                                                <PeopleRounded className="text-gray-400 mr-1 text-sm" />
                                                {course._count?.enrollments || 0} students
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(course.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onEdit(course)}
                                                className="text-primary-600 hover:text-primary-900 p-1 rounded-lg hover:bg-primary-50"
                                                title="Edit course"
                                            >
                                                <EditRounded className="text-sm" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(course)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50"
                                                title="Delete course"
                                            >
                                                <DeleteRounded className="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {((pagination.page - 1) * pagination.limit) + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{pagination.total}</span>{' '}
                                    results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => onPageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(pagination.totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        const isCurrentPage = pageNumber === pagination.page;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => onPageChange(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    isCurrentPage
                                                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => onPageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseTable;

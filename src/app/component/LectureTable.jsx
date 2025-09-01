'use client';
import React from 'react';
import {
    EditRounded,
    DeleteRounded,
    VideoLibraryRounded,
    PlayArrowRounded,
    AccessTimeRounded,
    LocalOfferRounded,
    LabelRounded
} from '@mui/icons-material';
import { LectureTagManager } from './LectureTagComponents';

const LectureTable = ({ lectures, loading, selectedCourse, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDuration = (duration) => {
        if (!duration) return 'N/A';
        return duration;
    };

    if (loading) {
        return (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="animate-pulse p-6">
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-16 h-12 bg-gray-200 rounded"></div>
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
            {/* Course Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">{selectedCourse?.name}</h3>
                        <p className="text-sm text-gray-600">
                            {lectures.length} lecture{lectures.length !== 1 ? 's' : ''} 
                            {selectedCourse?.teacher?.user?.name && ` • Taught by ${selectedCourse.teacher.user.name}`}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <VideoLibraryRounded className="text-gray-400" />
                        <span>Course Content</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lecture
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Video URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tags
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
                        {lectures.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <VideoLibraryRounded className="text-gray-300 text-4xl mb-2" />
                                    <p className="text-gray-500">No lectures found for this course</p>
                                    <p className="text-sm text-gray-400 mt-1">Add your first lecture to get started</p>
                                </td>
                            </tr>
                        ) : (
                            lectures.map((lecture, index) => (
                                <tr key={lecture.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                                <PlayArrowRounded className="text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {lecture.title}
                                                </div>
                                                <div className="text-sm text-gray-500 max-w-md truncate">
                                                    {lecture.description || 'No description provided'}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Lecture #{index + 1}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <AccessTimeRounded className="text-gray-400 mr-1 text-sm" />
                                            {formatDuration(lecture.duration)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="max-w-xs truncate">
                                            {lecture.youtube_url ? (
                                                <a
                                                    href={lecture.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary-600 hover:text-primary-900 text-sm"
                                                >
                                                    {lecture.youtube_url}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No URL provided</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs">
                                            <LectureTagManager
                                                lectureId={lecture.id}
                                                initialTags={lecture.tags || []}
                                                onTagsUpdated={(updatedTags) => {
                                                    // Optionally refresh the lecture list
                                                    console.log('Tags updated for lecture', lecture.id, updatedTags);
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(lecture.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onEdit(lecture)}
                                                className="text-primary-600 hover:text-primary-900 p-1 rounded-lg hover:bg-primary-50"
                                                title="Edit lecture"
                                            >
                                                <EditRounded className="text-sm" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(lecture)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50"
                                                title="Delete lecture"
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
        </div>
    );
};

export default LectureTable;

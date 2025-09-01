'use client';
import React, { useState, useEffect } from 'react';
import {
    CloseRounded,
    VideoLibraryRounded,
    TitleRounded,
    DescriptionRounded,
    LinkRounded,
    LabelRounded,
    AutoStoriesRounded,
    NumbersRounded
} from '@mui/icons-material';
import { TagInput } from './LectureTagComponents';

const LectureModal = ({ lecture, course, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtube_url: '',
        chapter_id: '',
        lecture_number: 1,
        tags: []
    });
    const [availableChapters, setAvailableChapters] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch available tags and chapters
        const fetchData = async () => {
            try {
                // Fetch tags
                const tagsResponse = await fetch('/api/admin/tags/unique');
                if (tagsResponse.ok) {
                    const tagsData = await tagsResponse.json();
                    setAvailableTags(tagsData.tags || []);
                }

                // Fetch chapters for the course
                if (course?.id) {
                    const chaptersResponse = await fetch(`/api/admin/chapters/dropdown?courseId=${course.id}`);
                    if (chaptersResponse.ok) {
                        const chaptersData = await chaptersResponse.json();
                        setAvailableChapters(chaptersData.chapters || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

        if (lecture) {
            setFormData({
                title: lecture.title || '',
                description: lecture.description || '',
                youtube_url: lecture.youtube_url || '',
                chapter_id: lecture.chapter_id || '',
                lecture_number: lecture.lecture_number || 1,
                tags: (lecture.tags || []).map(tag => typeof tag === 'object' ? tag.tag : tag)
            });
        } else {
            setFormData({
                title: '',
                description: '',
                youtube_url: '',
                chapter_id: '',
                lecture_number: 1,
                tags: []
            });
        }
        setErrors({});
    }, [lecture, isOpen, course]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Lecture title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Lecture description is required';
        }

        if (!formData.youtube_url.trim()) {
            newErrors.youtube_url = 'Video URL is required';
        } else {
            // Basic URL validation
            try {
                new URL(formData.youtube_url);
            } catch {
                newErrors.youtube_url = 'Please enter a valid URL';
            }
        }

        if (!formData.chapter_id) {
            newErrors.chapter_id = 'Please select a chapter';
        }

        if (!formData.lecture_number || formData.lecture_number < 1) {
            newErrors.lecture_number = 'Lecture number must be 1 or greater';
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
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <VideoLibraryRounded className="text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {lecture ? 'Edit Lecture' : 'Add New Lecture'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {course?.name || 'Course'} • {lecture ? 'Update lecture content' : 'Create a new lecture'}
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
                    {/* Lecture Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Lecture Title
                        </label>
                        <div className="relative">
                            <TitleRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                    errors.title ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter lecture title"
                            />
                        </div>
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Lecture Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Lecture Description
                        </label>
                        <div className="relative">
                            <DescriptionRounded className="absolute left-3 top-3 text-gray-400" />
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                                    errors.description ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Enter lecture description"
                            />
                        </div>
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                    </div>

                    {/* Video URL */}
                    <div>
                        <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
                            Video URL
                        </label>
                        <div className="relative">
                            <LinkRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="url"
                                id="youtube_url"
                                name="youtube_url"
                                value={formData.youtube_url}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                    errors.youtube_url ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="https://example.com/video.mp4"
                            />
                        </div>
                        {errors.youtube_url && (
                            <p className="mt-1 text-sm text-red-600">{errors.youtube_url}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Supported formats: YouTube, Vimeo, MP4, or any direct video link
                        </p>
                    </div>

                    {/* Chapter Selection */}
                    <div>
                        <label htmlFor="chapter_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Chapter
                        </label>
                        <div className="relative">
                            <AutoStoriesRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                id="chapter_id"
                                name="chapter_id"
                                value={formData.chapter_id}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                    errors.chapter_id ? 'border-red-300' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select a chapter...</option>
                                {availableChapters.map((chapter) => (
                                    <option key={chapter.id} value={chapter.id}>
                                        {chapter.number}. {chapter.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.chapter_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.chapter_id}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Select the chapter where this lecture belongs
                        </p>
                    </div>

                    {/* Lecture Number */}
                    <div>
                        <label htmlFor="lecture_number" className="block text-sm font-medium text-gray-700 mb-1">
                            Lecture Number
                        </label>
                        <div className="relative">
                            <NumbersRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                id="lecture_number"
                                name="lecture_number"
                                min="1"
                                value={formData.lecture_number}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                    errors.lecture_number ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="1"
                            />
                        </div>
                        {errors.lecture_number && (
                            <p className="mt-1 text-sm text-red-600">{errors.lecture_number}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Order of this lecture within the selected chapter
                        </p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <LabelRounded className="inline mr-1" style={{ fontSize: '16px' }} />
                            Tags (Optional)
                        </label>
                        <TagInput
                            tags={formData.tags}
                            onTagsChange={(newTags) => setFormData(prev => ({ ...prev, tags: newTags }))}
                            availableTags={availableTags}
                            placeholder="Add tags to categorize this lecture (e.g., javascript, beginner, functions)"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Tags help students find lectures across courses. Separate multiple tags with commas or Enter.
                        </p>
                    </div>

                    {/* Info box */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <VideoLibraryRounded className="text-orange-600 mr-2 mt-0.5" />
                            <div className="text-sm text-orange-800">
                                <p className="font-medium mb-1">Lecture Guidelines</p>
                                <ul className="text-xs space-y-1">
                                    <li>• Ensure video URL is accessible and publicly available</li>
                                    <li>• Use descriptive titles and detailed descriptions</li>
                                    <li>• Duration is automatically extracted from the video</li>
                                    <li>• Select an existing chapter to organize your content</li>
                                    <li>• Lecture numbers determine the order within a chapter</li>
                                    <li>• Add relevant tags to improve content discoverability</li>
                                    <li>• Lectures will be added to "{course?.name}" course</li>
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
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : lecture ? 'Update Lecture' : 'Create Lecture'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LectureModal;

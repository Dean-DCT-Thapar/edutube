'use client';
import React, { useState, useEffect } from 'react';
import {
    LocalOfferRounded,
    AddRounded,
    DeleteRounded,
    SearchRounded,
    FilterListRounded,
    LabelRounded,
    BookmarkRounded,
    CloseRounded,
    EditRounded,
    SaveRounded
} from '@mui/icons-material';

const TagInput = ({ tags, onTagsChange, availableTags = [], placeholder = "Add tags..." }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (inputValue.length > 0) {
            const filtered = availableTags
                .filter(tag => 
                    tag.toLowerCase().includes(inputValue.toLowerCase()) &&
                    !tags.includes(tag)
                )
                .slice(0, 10);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [inputValue, availableTags, tags]);

    const addTag = (tag) => {
        const cleanTag = tag.trim().toLowerCase();
        if (cleanTag && !tags.includes(cleanTag)) {
            onTagsChange([...tags, cleanTag]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (tagToRemove) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (inputValue.trim()) {
                addTag(inputValue);
            }
        }
    };

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-white min-h-[50px]">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                        <LabelRounded className="w-4 h-4 mr-1" />
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                            <CloseRounded className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="flex-1 outline-none bg-transparent min-w-[120px]"
                />
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.map((tag, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => addTag(tag)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center"
                        >
                            <LabelRounded className="w-4 h-4 mr-2 text-gray-500" />
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const LectureTagManager = ({ lectureId, initialTags = [], onTagsUpdated }) => {
    const [tags, setTags] = useState(initialTags.map(t => typeof t === 'object' ? t.tag : t));
    const [availableTags, setAvailableTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchAvailableTags();
    }, []);

    const fetchAvailableTags = async () => {
        try {
            const response = await fetch('/api/admin/tags/unique');
            if (response.ok) {
                const data = await response.json();
                setAvailableTags(data.tags || []);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const saveTags = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/lectures/${lectureId}/tags`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tags })
            });

            if (response.ok) {
                const data = await response.json();
                setIsEditing(false);
                if (onTagsUpdated) {
                    onTagsUpdated(data.lecture.tags);
                }
            } else {
                throw new Error('Failed to save tags');
            }
        } catch (error) {
            console.error('Error saving tags:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                            >
                                <LabelRounded className="w-3 h-3 mr-1" />
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">No tags</span>
                    )}
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit tags"
                >
                    <EditRounded className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <TagInput
                tags={tags}
                onTagsChange={setTags}
                availableTags={availableTags}
                placeholder="Add tags to categorize this lecture..."
            />
            <div className="flex gap-2">
                <button
                    onClick={saveTags}
                    disabled={loading}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                    <SaveRounded className="w-4 h-4 mr-1" />
                    {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setTags(initialTags.map(t => typeof t === 'object' ? t.tag : t));
                    }}
                    className="flex items-center px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                    <CloseRounded className="w-4 h-4 mr-1" />
                    Cancel
                </button>
            </div>
        </div>
    );
};

const TagSearchFilter = ({ onSearch, onFilterChange }) => {
    const [searchTags, setSearchTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchAvailableTags();
        fetchCourses();
    }, []);

    const fetchAvailableTags = async () => {
        try {
            const response = await fetch('/api/admin/tags/unique');
            if (response.ok) {
                const data = await response.json();
                setAvailableTags(data.tags || []);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/admin/courses');
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTags.length > 0) {
            params.set('tags', searchTags.join(','));
        }
        if (selectedCourse) {
            params.set('course_id', selectedCourse);
        }
        
        if (onSearch) {
            onSearch(params.toString());
        }
    };

    const clearFilters = () => {
        setSearchTags([]);
        setSelectedCourse('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
                <FilterListRounded className="text-blue-600" />
                Search & Filter Lectures
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search by Tags
                    </label>
                    <TagInput
                        tags={searchTags}
                        onTagsChange={setSearchTags}
                        availableTags={availableTags}
                        placeholder="Enter tags to search..."
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Course
                    </label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Courses</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="flex gap-3">
                <button
                    onClick={handleSearch}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <SearchRounded className="w-5 h-5 mr-2" />
                    Search Lectures
                </button>
                <button
                    onClick={clearFilters}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    <CloseRounded className="w-5 h-5 mr-2" />
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

const TagAnalytics = () => {
    const [tagStats, setTagStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTagStats();
    }, []);

    const fetchTagStats = async () => {
        try {
            const response = await fetch('/api/admin/tags/unique');
            if (response.ok) {
                const data = await response.json();
                // Convert simple tag array to stats format for display
                setTagStats(data.tags?.map(tag => ({ tag, count: 'N/A' })) || []);
            }
        } catch (error) {
            console.error('Error fetching tag stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading tag analytics...</div>;
    }

    const sortedTags = [...tagStats].sort((a, b) => a.tag.localeCompare(b.tag)).slice(0, 20);

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                <BookmarkRounded className="text-green-600" />
                Tag Usage Analytics
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sortedTags.map(({ tag, count }) => (
                    <div key={tag} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                            <LabelRounded className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="font-medium">{tag}</span>
                        </div>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                            Available
                        </span>
                    </div>
                ))}
            </div>
            
            {tagStats.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No tags found. Start adding tags to lectures to see analytics.
                </div>
            )}
        </div>
    );
};

export { TagInput, LectureTagManager, TagSearchFilter, TagAnalytics };

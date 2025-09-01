'use client';
import React, { useState, useEffect } from 'react';
import { 
    VideoLibraryRounded,
    SearchRounded,
    AddRounded,
    TuneRounded,
    TrendingUpRounded,
    BookmarkRounded,
    FilterListRounded,
    ClearRounded,
    ViewListRounded,
    ViewModuleRounded
} from '@mui/icons-material';
import LectureTable from '../../component/LectureTable';
import LectureModal from '../../component/LectureModal';
import ConfirmDialog from '../../component/ConfirmDialog';
import { TagSearchFilter, TagAnalytics } from '../../component/LectureTagComponents';
import toast from 'react-hot-toast';

const EnhancedLecturesPage = () => {
    // State management
    const [lectures, setLectures] = useState([]);
    const [filteredLectures, setFilteredLectures] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    
    // Modal states
    const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
    const [editingLecture, setEditingLecture] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [lectureToDelete, setLectureToDelete] = useState(null);
    
    // View and filter states
    const [viewMode, setViewMode] = useState('filtered'); // 'all', 'filtered'
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState('');

    // Load courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch all courses
    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/admin/courses');
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses || []);
                if (data.courses?.length > 0) {
                    setSelectedCourse(data.courses[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
        }
    };

    // Fetch lectures for selected course
    const fetchLectures = async (courseId = null) => {
        if (!courseId && !selectedCourse) return;
        
        setLoading(true);
        try {
            const targetCourseId = courseId || selectedCourse.id;
            const response = await fetch(`/api/admin/courses/${targetCourseId}/lectures`);
            if (response.ok) {
                const data = await response.json();
                setLectures(data.lectures || []);
                setFilteredLectures(data.lectures || []);
            } else {
                throw new Error('Failed to fetch lectures');
            }
        } catch (error) {
            console.error('Error fetching lectures:', error);
            toast.error('Failed to load lectures');
        } finally {
            setLoading(false);
        }
    };

    // Search lectures by tags
    const searchLecturesByTags = async (filterParams) => {
        if (!filterParams) {
            // Reset to course lectures
            fetchLectures();
            setViewMode('all');
            setActiveFilters('');
            return;
        }

        setSearchLoading(true);
        setActiveFilters(filterParams);
        
        try {
            const response = await fetch(`/api/admin/lectures/search/by-tags?${filterParams}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredLectures(data.lectures || []);
                setViewMode('filtered');
                toast.success(`Found ${data.total || 0} lectures matching your search`);
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Error searching lectures:', error);
            toast.error('Search failed. Please try again.');
        } finally {
            setSearchLoading(false);
        }
    };

    // Handle course selection
    const handleCourseChange = (course) => {
        setSelectedCourse(course);
        setViewMode('all');
        setActiveFilters('');
        fetchLectures(course.id);
    };

    // Load lectures when course changes
    useEffect(() => {
        if (selectedCourse) {
            fetchLectures();
        }
    }, [selectedCourse]);

    // Handle creating new lecture
    const handleCreateLecture = async (lectureData) => {
        try {
            const response = await fetch('/api/admin/lectures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...lectureData,
                    course_id: selectedCourse.id
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // If tags were provided, add them
                if (lectureData.tags && lectureData.tags.length > 0) {
                    await fetch(`/api/admin/lectures/${data.lecture.id}/tags`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tags: lectureData.tags })
                    });
                }
                
                setIsLectureModalOpen(false);
                fetchLectures();
                toast.success('Lecture created successfully');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create lecture');
            }
        } catch (error) {
            console.error('Error creating lecture:', error);
            toast.error(error.message || 'Failed to create lecture');
        }
    };

    // Handle updating lecture
    const handleUpdateLecture = async (lectureData) => {
        try {
            // Use the with-tags endpoint to update both lecture and tags
            const response = await fetch(`/api/admin/lectures/${editingLecture.id}/with-tags`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lectureData)
            });

            if (response.ok) {
                setIsLectureModalOpen(false);
                setEditingLecture(null);
                fetchLectures();
                toast.success('Lecture updated successfully');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update lecture');
            }
        } catch (error) {
            console.error('Error updating lecture:', error);
            toast.error(error.message || 'Failed to update lecture');
        }
    };

    // Handle deleting lecture
    const handleDeleteLecture = async () => {
        try {
            const response = await fetch(`/api/admin/lectures/${lectureToDelete.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setIsDeleteDialogOpen(false);
                setLectureToDelete(null);
                fetchLectures();
                toast.success('Lecture deleted successfully');
            } else {
                throw new Error('Failed to delete lecture');
            }
        } catch (error) {
            console.error('Error deleting lecture:', error);
            toast.error('Failed to delete lecture');
        }
    };

    // Open edit modal
    const openEditModal = (lecture) => {
        setEditingLecture(lecture);
        setIsLectureModalOpen(true);
    };

    // Open delete dialog
    const openDeleteDialog = (lecture) => {
        setLectureToDelete(lecture);
        setIsDeleteDialogOpen(true);
    };

    const currentLectures = viewMode === 'filtered' ? filteredLectures : lectures;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <VideoLibraryRounded className="mr-3 text-primary-600" />
                            Enhanced Lecture Management
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage lectures with advanced tagging and search capabilities
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowAnalytics(!showAnalytics)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                                showAnalytics 
                                    ? 'bg-blue-600 text-white border-blue-600' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <TrendingUpRounded className="mr-2" style={{ fontSize: '18px' }} />
                            Analytics
                        </button>
                        <button
                            onClick={() => setIsLectureModalOpen(true)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
                        >
                            <AddRounded className="mr-2" style={{ fontSize: '18px' }} />
                            Add Lecture
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Selection and View Controls */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Course Selection */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">Course:</span>
                        <select
                            value={selectedCourse?.id || ''}
                            onChange={(e) => {
                                const course = courses.find(c => c.id === parseInt(e.target.value));
                                if (course) handleCourseChange(course);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* View Mode and Filters */}
                    <div className="flex items-center space-x-3">
                        {activeFilters && (
                            <div className="flex items-center text-sm">
                                <span className="text-gray-600 mr-2">Active filters:</span>
                                <button
                                    onClick={() => searchLecturesByTags('')}
                                    className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs hover:bg-orange-200 flex items-center"
                                >
                                    <FilterListRounded style={{ fontSize: '12px' }} className="mr-1" />
                                    Clear
                                </button>
                            </div>
                        )}
                        <div className="text-sm text-gray-600">
                            {viewMode === 'filtered' ? (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    Search Results: {currentLectures.length} lectures
                                </span>
                            ) : (
                                <span>
                                    {currentLectures.length} lecture{currentLectures.length !== 1 ? 's' : ''} in course
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tag Search and Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Tag Search */}
                <div className="xl:col-span-2">
                    <TagSearchFilter 
                        onSearch={searchLecturesByTags}
                        onFilterChange={setActiveFilters}
                    />
                </div>

                {/* Analytics Panel */}
                {showAnalytics && (
                    <div className="xl:col-span-1">
                        <TagAnalytics />
                    </div>
                )}
            </div>

            {/* Loading States */}
            {(loading || searchLoading) && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <span className="ml-3 text-gray-600">
                            {searchLoading ? 'Searching lectures...' : 'Loading lectures...'}
                        </span>
                    </div>
                </div>
            )}

            {/* Lectures Table */}
            {!loading && !searchLoading && (
                <LectureTable
                    lectures={currentLectures}
                    loading={false}
                    selectedCourse={selectedCourse}
                    onEdit={openEditModal}
                    onDelete={openDeleteDialog}
                />
            )}

            {/* Empty State for Filtered Results */}
            {!loading && !searchLoading && viewMode === 'filtered' && currentLectures.length === 0 && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
                    <SearchRounded className="text-gray-300 text-6xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No lectures found</h3>
                    <p className="text-gray-600 mb-4">
                        No lectures match your search criteria. Try adjusting your filters or search terms.
                    </p>
                    <button
                        onClick={() => searchLecturesByTags('')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Modals and Dialogs */}
            <LectureModal
                lecture={editingLecture}
                course={selectedCourse}
                isOpen={isLectureModalOpen}
                onClose={() => {
                    setIsLectureModalOpen(false);
                    setEditingLecture(null);
                }}
                onSubmit={editingLecture ? handleUpdateLecture : handleCreateLecture}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Lecture"
                message={`Are you sure you want to delete "${lectureToDelete?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteLecture}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setLectureToDelete(null);
                }}
                variant="danger"
            />
        </div>
    );
};

export default EnhancedLecturesPage;

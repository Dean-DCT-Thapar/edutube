'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import TopBar from '../component/TopBar';
import SideBar from '../component/SideBar';
import Footer from '../component/Footer';
import { 
    SearchRounded, 
    FilterListRounded, 
    ClearRounded, 
    PersonRounded, 
    SchoolRounded, 
    PlayLessonRounded, 
    GroupRounded,
    TuneRounded,
    ExpandMoreRounded,
    ExpandLessRounded
} from '@mui/icons-material';

const SEARCH_TYPES = {
    all: { label: 'All', icon: SearchRounded },
    teachers: { label: 'Teachers', icon: PersonRounded },
    courses: { label: 'Courses', icon: SchoolRounded },
    lectures: { label: 'Lectures', icon: PlayLessonRounded },
    students: { label: 'Students', icon: GroupRounded }
};

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'name', label: 'Name' },
    { value: 'date', label: 'Date' }
];

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [searchType, setSearchType] = useState(searchParams.get('type') || 'all');
    const [results, setResults] = useState({
        teachers: [],
        courses: [],
        students: [],
        lectures: [],
        totalCount: 0,
        hasMore: false,
        page: 1,
        limit: 10
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        courseCode: '',
        teacherName: '',
        chapterName: '',
        enrolledInCourse: '',
        isActive: true
    });
    const [sortBy, setSortBy] = useState('relevance');
    const [sortOrder, setSortOrder] = useState('desc');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userRole, setUserRole] = useState(null);
    
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const debounceRef = useRef(null);

    // Check authentication and get user role
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await axios.get('/api/verify-auth', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUserRole(response.data.role);
            } catch (error) {
                console.error('Auth error:', error);
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // Initial search if query parameter exists
    useEffect(() => {
        const initialQuery = searchParams.get('q');
        const initialType = searchParams.get('type') || 'all';
        
        if (initialQuery) {
            setSearchQuery(initialQuery);
            setSearchType(initialType);
            handleSearch(initialQuery, initialType, filters, sortBy, sortOrder, 1, true);
        }
    }, []);

    // Debounced suggestions
    const fetchSuggestions = useCallback(async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get('/api/quick-search', {
                params: { q: query, limit: 5 }
            });
            setSuggestions(response.data.suggestions || []);
        } catch (error) {
            console.error('Suggestions error:', error);
            setSuggestions([]);
        }
    }, []);

    // Handle input change with debouncing for suggestions
    const handleInputChange = (value) => {
        setSearchQuery(value);
        
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    // Main search function
    const handleSearch = async (query = searchQuery, type = searchType, currentFilters = filters, 
                              currentSortBy = sortBy, currentSortOrder = sortOrder, page = 1, replace = true) => {
        if (!query.trim() && Object.values(currentFilters).every(v => !v)) {
            toast.error('Please enter a search query or apply filters');
            return;
        }

        if (page === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const response = await axios.post('/api/advanced-search', {
                query: query.trim(),
                type,
                page,
                limit: 10,
                filters: currentFilters,
                sortBy: currentSortBy,
                sortOrder: currentSortOrder
            });

            if (replace || page === 1) {
                setResults(response.data);
            } else {
                // Append results for pagination
                setResults(prev => ({
                    ...response.data,
                    teachers: [...prev.teachers, ...response.data.teachers],
                    courses: [...prev.courses, ...response.data.courses],
                    students: [...prev.students, ...response.data.students],
                    lectures: [...prev.lectures, ...response.data.lectures]
                }));
            }

            // Update URL
            const params = new URLSearchParams();
            if (query) params.set('q', query);
            if (type !== 'all') params.set('type', type);
            router.replace(`/search?${params.toString()}`, { scroll: false });

            setShowSuggestions(false);
        } catch (error) {
            console.error('Search error:', error);
            toast.error(error.response?.data?.message || 'Search failed');
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Load more results
    const handleLoadMore = () => {
        if (results.hasMore && !isLoadingMore) {
            handleSearch(searchQuery, searchType, filters, sortBy, sortOrder, results.page + 1, false);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        setSearchType(suggestion.type === 'course' ? 'courses' : 
                    suggestion.type === 'teacher' ? 'teachers' : 
                    suggestion.type === 'lecture' ? 'lectures' : 'all');
        setShowSuggestions(false);
        handleSearch(suggestion.title, suggestion.type === 'course' ? 'courses' : 
                   suggestion.type === 'teacher' ? 'teachers' : 
                   suggestion.type === 'lecture' ? 'lectures' : 'all');
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            courseCode: '',
            teacherName: '',
            chapterName: '',
            enrolledInCourse: '',
            isActive: true
        });
    };

    // Handle clicks outside suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Navigate to result details
    const handleResultClick = (result) => {
        switch (result.type) {
            case 'course':
                router.push(`/course-page/${result.id}`);
                break;
            case 'lecture':
                router.push(`/course-page/${result.course_instance_id}?lecture=${result.id}`);
                break;
            case 'teacher':
                router.push(`/teacher/${result.id}`);
                break;
            case 'student':
                if (userRole === 'admin') {
                    router.push(`/admin-dashboard/students/${result.id}`);
                }
                break;
            default:
                break;
        }
    };

    if (!userRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <TopBar />
            <div className="flex flex-1">
                <SideBar />
                <main className="flex-1 transition-all duration-300 ease-in-out">
                    {/* Search Header */}
                    <div className="bg-white border-b border-gray-200 p-6">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {/* Main Search Bar */}
                            <div className="relative">
                                <div className="relative">
                                    <SearchRounded className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                        placeholder="Search for courses, teachers, lectures..."
                                        className="w-full pl-12 pr-24 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                    />
                                    <button
                                        onClick={() => handleSearch()}
                                        disabled={isLoading}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Searching...' : 'Search'}
                                    </button>
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div 
                                        ref={suggestionsRef}
                                        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1"
                                    >
                                        {suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                                            >
                                                {suggestion.type === 'teacher' && <PersonRounded className="text-gray-400" />}
                                                {suggestion.type === 'course' && <SchoolRounded className="text-gray-400" />}
                                                {suggestion.type === 'lecture' && <PlayLessonRounded className="text-gray-400" />}
                                                <div>
                                                    <div className="font-medium text-gray-900">{suggestion.title}</div>
                                                    <div className="text-sm text-gray-500">{suggestion.subtitle}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Search Type Tabs */}
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                    {Object.entries(SEARCH_TYPES).map(([key, config]) => {
                                        const Icon = config.icon;
                                        const isActive = searchType === key;
                                        
                                        // Hide students tab for non-admin users
                                        if (key === 'students' && userRole !== 'admin') {
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={key}
                                                onClick={() => {
                                                    setSearchType(key);
                                                    if (searchQuery) {
                                                        handleSearch(searchQuery, key);
                                                    }
                                                }}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                                    isActive 
                                                        ? 'bg-white text-primary-600 shadow-sm' 
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <Icon className="text-lg" />
                                                <span>{config.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Filter and Sort Controls */}
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <TuneRounded />
                                        <span>Filters</span>
                                        {showFilters ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                                    </button>

                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            if (searchQuery) {
                                                handleSearch(searchQuery, searchType, filters, e.target.value, sortOrder);
                                            }
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        {SORT_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                Sort by {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                                        <button
                                            onClick={handleClearFilters}
                                            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            <ClearRounded className="text-sm" />
                                            <span>Clear all</span>
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                                            <input
                                                type="text"
                                                value={filters.courseCode}
                                                onChange={(e) => setFilters(prev => ({ ...prev, courseCode: e.target.value }))}
                                                placeholder="e.g. CS101"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name</label>
                                            <input
                                                type="text"
                                                value={filters.teacherName}
                                                onChange={(e) => setFilters(prev => ({ ...prev, teacherName: e.target.value }))}
                                                placeholder="Teacher name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                                            <input
                                                type="text"
                                                value={filters.chapterName}
                                                onChange={(e) => setFilters(prev => ({ ...prev, chapterName: e.target.value }))}
                                                placeholder="Chapter name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                        
                                        {userRole === 'admin' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Enrolled Course</label>
                                                <input
                                                    type="text"
                                                    value={filters.enrolledInCourse}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, enrolledInCourse: e.target.value }))}
                                                    placeholder="Course code"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleSearch(searchQuery, searchType, filters, sortBy, sortOrder)}
                                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Results */}
                    <div className="max-w-7xl mx-auto p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
                            </div>
                        ) : results.totalCount > 0 ? (
                            <div className="space-y-8">
                                {/* Results Summary */}
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {results.totalCount} {results.totalCount === 1 ? 'result' : 'results'} found
                                        {searchQuery && ` for "${searchQuery}"`}
                                    </h2>
                                </div>

                                {/* Teachers Results */}
                                {results.teachers.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <PersonRounded className="mr-2" />
                                            Teachers ({results.teachers.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {results.teachers.map((teacher) => (
                                                <div
                                                    key={teacher.id}
                                                    onClick={() => handleResultClick(teacher)}
                                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                                                            <PersonRounded className="text-primary-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                                                            <p className="text-sm text-gray-500">{teacher.email}</p>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {teacher.course_count} courses • {teacher.total_students} students
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Courses Results */}
                                {results.courses.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <SchoolRounded className="mr-2" />
                                            Courses ({results.courses.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {results.courses.map((course) => (
                                                <div
                                                    key={course.id}
                                                    onClick={() => handleResultClick(course)}
                                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 line-clamp-2">{course.course_name}</h4>
                                                                <p className="text-sm text-primary-600 font-medium">{course.course_code}</p>
                                                            </div>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                course.is_active 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {course.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                                            <span>By {course.teacher_name}</span>
                                                            <span>{course.enrollment_count} enrolled</span>
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {course.chapter_count} chapters • {course.lecture_count} lectures
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Lectures Results */}
                                {results.lectures.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <PlayLessonRounded className="mr-2" />
                                            Lectures ({results.lectures.length})
                                        </h3>
                                        <div className="space-y-3">
                                            {results.lectures.map((lecture) => (
                                                <div
                                                    key={lecture.id}
                                                    onClick={() => handleResultClick(lecture)}
                                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                            <PlayLessonRounded className="text-gray-500" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{lecture.title}</h4>
                                                            <p className="text-sm text-gray-600 line-clamp-2">{lecture.description}</p>
                                                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                                                                <span>{lecture.course_name} ({lecture.course_code})</span>
                                                                <span>Chapter {lecture.chapter_number}: {lecture.chapter_name}</span>
                                                                <span>Lecture {lecture.lecture_number}</span>
                                                                <span>By {lecture.teacher_name}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right text-xs text-gray-500">
                                                            {lecture.duration && (
                                                                <div>{Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')}</div>
                                                            )}
                                                            <div>{lecture.watch_count} views</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Students Results (Admin only) */}
                                {userRole === 'admin' && results.students.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <GroupRounded className="mr-2" />
                                            Students ({results.students.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {results.students.map((student) => (
                                                <div
                                                    key={student.id}
                                                    onClick={() => handleResultClick(student)}
                                                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <GroupRounded className="text-gray-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                                                            <p className="text-sm text-gray-500">{student.email}</p>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                {student.enrolled_courses} courses • {student.videos_watched} videos watched
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Load More Button */}
                                {results.hasMore && (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isLoadingMore}
                                            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
                                        >
                                            {isLoadingMore ? 'Loading...' : 'Load More Results'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : searchQuery || Object.values(filters).some(v => v) ? (
                            <div className="text-center py-20">
                                <SearchRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search terms or filters
                                </p>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <SearchRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
                                <p className="text-gray-600">
                                    Enter a search term above to find courses, teachers, lectures, and more
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

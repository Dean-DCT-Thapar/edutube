"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import SearchCard from "./SearchCard";
import SearchBox from "./SearchBox";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  SearchRounded, 
  FilterListRounded, 
  SchoolRounded,
  VideoLibraryRounded,
  PersonRounded,
  ClearRounded,
  TuneRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  PlayLessonRounded,
  SortRounded
} from "@mui/icons-material";

const SEARCH_TYPES = {
  all: { label: 'All', icon: SearchRounded },
  courses: { label: 'Courses', icon: SchoolRounded },
  lectures: { label: 'Lectures', icon: PlayLessonRounded },
  teachers: { label: 'Teachers', icon: PersonRounded }
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Date' }
];

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [results, setResults] = useState({
    teachers: [],
    courses: [],
    lectures: [],
    totalCount: 0,
    hasMore: false,
    page: 1,
    limit: 10
  });
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    courseCode: '',
    teacherName: '',
    chapterName: '',
    isActive: true
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Check authentication and get user role
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/verify-auth', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUserRole('guest'); // Allow browsing as guest
      }
    };

    checkAuth();
  }, []);

  // Load all available courses on component mount
  useEffect(() => {
    loadAllCourses();
  }, []);

  const loadAllCourses = async () => {
    setInitialLoading(true);
    try {
      const response = await axios.get(`/api/courses/browse`);
      setAllCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setAllCourses([]);
    } finally {
      setInitialLoading(false);
    }
  };

  // Debounced suggestions for search input
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get('/api/quick-search', {
        params: { q: query, limit: 8 }
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Suggestions error:', error);
      setSuggestions([]);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (value) => {
    setSearchQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Advanced search using PostgreSQL FTS
  const handleAdvancedSearch = async (query = searchQuery, type = searchType, 
                                    currentFilters = filters, currentSortBy = sortBy, 
                                    currentSortOrder = sortOrder, page = 1, replace = true) => {
    if (!query.trim() && Object.values(currentFilters).every(v => !v)) {
      if (searchInitiated) {
        // Clear search and show all courses
        setSearchInitiated(false);
        setResults({
          teachers: [],
          courses: [],
          lectures: [],
          totalCount: 0,
          hasMore: false,
          page: 1,
          limit: 10
        });
      }
      return;
    }

    setIsLoading(page === 1);
    setSearchInitiated(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // For guest users, fall back to basic search
        return handleBasicSearch(query, type);
      }

      const response = await axios.post('/api/advanced-search', {
        query: query.trim(),
        type,
        page,
        limit: 12,
        filters: currentFilters,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (replace || page === 1) {
        setResults(response.data);
      } else {
        // Append results for pagination
        setResults(prev => ({
          ...response.data,
          teachers: [...prev.teachers, ...response.data.teachers],
          courses: [...prev.courses, ...response.data.courses],
          lectures: [...prev.lectures, ...response.data.lectures]
        }));
      }

      setShowSuggestions(false);
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Fallback to basic search for unauthenticated users
        handleBasicSearch(query, type);
      } else {
        toast.error(error.response?.data?.message || 'Search failed');
        setResults({
          teachers: [],
          courses: [],
          lectures: [],
          totalCount: 0,
          hasMore: false,
          page: 1,
          limit: 10
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback basic search for guests
  const handleBasicSearch = async (query, type) => {
    try {
      const response = await axios.get(`/api/search`, {
        params: { q: query, type: type === 'all' ? '' : type },
      });
      
      // Transform legacy response to new format
      const transformedResults = {
        teachers: response.data.filter(r => r.type === 'teacher'),
        courses: response.data.filter(r => r.type === 'course'),
        lectures: response.data.filter(r => r.type === 'lecture'),
        totalCount: response.data.length,
        hasMore: false,
        page: 1,
        limit: response.data.length
      };
      
      setResults(transformedResults);
      setShowSuggestions(false);
    } catch (error) {
      console.error("Error with basic search:", error);
      toast.error('Search failed');
      setResults({
        teachers: [],
        courses: [],
        lectures: [],
        totalCount: 0,
        hasMore: false,
        page: 1,
        limit: 10
      });
    }
  };

  // Load more results
  const handleLoadMore = () => {
    if (results.hasMore && !isLoading) {
      handleAdvancedSearch(searchQuery, searchType, filters, sortBy, sortOrder, results.page + 1, false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    const newType = suggestion.type === 'course' ? 'courses' : 
                   suggestion.type === 'teacher' ? 'teachers' : 
                   suggestion.type === 'lecture' ? 'lectures' : 'all';
    setSearchType(newType);
    setShowSuggestions(false);
    handleAdvancedSearch(suggestion.title, newType);
  };

  // Clear search and filters
  const clearSearch = () => {
    setSearchQuery("");
    setResults({
      teachers: [],
      courses: [],
      lectures: [],
      totalCount: 0,
      hasMore: false,
      page: 1,
      limit: 10
    });
    setSearchInitiated(false);
    setSearchType("all");
    setFilters({
      courseCode: '',
      teacherName: '',
      chapterName: '',
      isActive: true
    });
    setSortBy('relevance');
    setSortOrder('desc');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Clear filters only
  const clearFilters = () => {
    setFilters({
      courseCode: '',
      teacherName: '',
      chapterName: '',
      isActive: true
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdvancedSearch();
    }
  };

  // Navigate to result details
  const handleResultClick = (result) => {
    switch (result.type) {
      case 'course':
        return `/course-overview/${result.id}`;
      case 'lecture':
        return `/course_page/${result.course_instance_id}?chapter=${result.chapter_number}&lecture=${result.lecture_number}`;
      case 'teacher':
        return `/teacher/${result.id}`;
      default:
        return '#';
    }
  };

  // Render search results by type
  const renderResults = () => {
    const hasResults = results.totalCount > 0;
    
    if (!hasResults) {
      return (
        <div className="text-center py-12">
          <SearchRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
          <p className="text-gray-500 text-lg">No results found</p>
          <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {results.totalCount} {results.totalCount === 1 ? 'result' : 'results'} found
            {searchQuery && ` for "${searchQuery}"`}
          </h2>
        </div>

        {/* Courses Results */}
        {results.courses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <SchoolRounded className="mr-2" />
              Courses ({results.courses.length})
            </h3>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {results.courses.map((course) => (
                <Link 
                  key={course.id} 
                  href={handleResultClick(course)}
                  className="block"
                >
                  <SearchCard 
                    main_title={course.course_name} 
                    subtitle1={`by ${course.teacher_name}`} 
                    subtitle2={course.course_code && `Course Code: ${course.course_code}`}
                    description={course.description}
                    type="course" 
                    subtitle3="course"
                    chaptersCount={course.chapter_count}
                    lecturesCount={course.lecture_count}
                    enrollmentCount={course.enrollment_count}
                    isActive={course.is_active}
                  />
                </Link>
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
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {results.lectures.map((lecture) => (
                <Link 
                  key={lecture.id} 
                  href={handleResultClick(lecture)}
                  className="block"
                >
                  <SearchCard 
                    main_title={lecture.title} 
                    subtitle1={`${lecture.course_name} (${lecture.course_code})`} 
                    subtitle2={`Chapter ${lecture.chapter_number}: ${lecture.chapter_name}`}
                    subtitle3={`Lecture ${lecture.lecture_number} • by ${lecture.teacher_name}`}
                    description={lecture.description}
                    type="lecture" 
                    duration={lecture.duration}
                    watchCount={lecture.watch_count}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Teachers Results */}
        {results.teachers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PersonRounded className="mr-2" />
              Teachers ({results.teachers.length})
            </h3>
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {results.teachers.map((teacher) => (
                <Link 
                  key={teacher.id} 
                  href={`/teacher/${teacher.id}`}
                  className="block"
                >
                  <SearchCard 
                    main_title={teacher.name} 
                    subtitle1={teacher.email}
                    subtitle2={`${teacher.course_count} courses • ${teacher.total_students} students`}
                    type="teacher" 
                    subtitle3="teacher" 
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Load More Button */}
        {results.hasMore && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Load More Results'}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
        <p className="text-gray-600">
          Discover and preview all available courses. You can watch lectures without enrolling - 
          enrollment just saves courses to your dashboard!
        </p>
      </div>

      {/* Advanced Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        {/* Main Search Bar */}
        <div className="relative mb-4">
          <div className="relative">
            <SearchRounded className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search for courses, teachers, lectures..."
              className="w-full pl-12 pr-24 py-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={() => handleAdvancedSearch()}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
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

        {/* Search Controls */}
        <div className="flex items-center justify-between">
          {/* Search Type Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {Object.entries(SEARCH_TYPES).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = searchType === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setSearchType(key);
                    if (searchQuery) {
                      handleAdvancedSearch(searchQuery, key);
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
                  handleAdvancedSearch(searchQuery, searchType, filters, e.target.value, sortOrder);
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

            {(searchQuery || searchInitiated) && (
              <button
                onClick={clearSearch}
                className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                <ClearRounded />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-6 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <ClearRounded className="text-sm" />
                <span>Clear all</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => handleAdvancedSearch(searchQuery, searchType, filters, sortBy, sortOrder)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        </div>
      ) : searchInitiated ? (
        renderResults()
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Available Courses</h2>
          {initialLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600">Loading courses...</span>
            </div>
          ) : allCourses.length === 0 ? (
            <div className="text-center py-12">
              <SchoolRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
              <p className="text-gray-500 text-lg">No courses available</p>
              <p className="text-gray-400">Check back later for new courses</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {allCourses.map((course, index) => (
                <Link 
                  key={course.id || index} 
                  href={`/course-overview/${course.id}`}
                  className="block"
                >
                  <SearchCard 
                    main_title={course.course_name || course.name} 
                    subtitle1={`by ${course.teacher_name}`} 
                    subtitle2={course.course_code && `Course Code: ${course.course_code}`}
                    description={course.description}
                    type="course" 
                    subtitle3="course"
                    chaptersCount={course.chapter_count}
                    lecturesCount={course.lecture_count}
                    enrollmentCount={course.enrollment_count}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
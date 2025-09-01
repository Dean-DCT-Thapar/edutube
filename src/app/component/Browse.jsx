"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SearchCard from "./SearchCard";
import Link from "next/link";
import { 
  SearchRounded, 
  FilterListRounded, 
  SchoolRounded,
  VideoLibraryRounded,
  PersonRounded,
  ClearRounded
} from "@mui/icons-material";

export default function Browse() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchInitiated, setSearchInitiated] = useState(false);

  // Load all available courses on component mount
  useEffect(() => {
    loadAllCourses();
  }, []);

  const loadAllCourses = async () => {
    setInitialLoading(true);
    try {
      // For now, let's fetch course instances since courses might be legacy
      // We'll need to update this based on the actual API structure
      const response = await axios.get(`/api/courses/browse`);
      setAllCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Fallback to empty array
      setAllCourses([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setSearchInitiated(false);
      return;
    }
    
    setLoading(true);
    setSearchInitiated(true);
    try {
      const response = await axios.get(`/api/search`, {
        params: { q: query, type: category },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearchInitiated(false);
    setCategory("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
        <p className="text-gray-600">Discover and search through all available courses and lectures</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <SearchRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, lectures, or teachers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              <option value="courses">Courses</option>
              <option value="lectures">Lectures</option>
              <option value="teachers">Teachers</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center gap-2"
          >
            <SearchRounded />
            Search
          </button>

          {/* Clear Button */}
          {(query || searchInitiated) && (
            <button
              onClick={clearSearch}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <ClearRounded />
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      ) : searchInitiated ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Results {query && `for "${query}"`}
          </h2>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <SearchRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
              <p className="text-gray-500 text-lg">No results found</p>
              <p className="text-gray-400">Try adjusting your search terms or category filter</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  {result.type === "lecture" && (
                    <Link href={`/course_page/${result.teacher_id}?chapter=${result.chapter_number}&lecture=${result.lecture_number}`}>
                      <div className="p-4">
                        <SearchCard 
                          main_title={result.lecture_title} 
                          subtitle1={result.course_name} 
                          subtitle2={result.teacher_name} 
                          type="lecture" 
                          subtitle3="lecture"
                        />
                      </div>
                    </Link>
                  )}
                  {result.type === "course" && (
                    <Link href={`/course_page/${result.teacher_id}?chapter=1&lecture=1`}>
                      <div className="p-4">
                        <SearchCard 
                          main_title={result.course_name} 
                          subtitle1={`by ${result.teacher_name}`} 
                          type="course" 
                          subtitle3="course"
                        />
                      </div>
                    </Link>
                  )}
                  {result.type === "teacher" && (
                    <div className="p-4">
                      <SearchCard 
                        main_title={result.teacher_name} 
                        type="teacher" 
                        subtitle3="teacher" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
            <div className="grid gap-4">
              {allCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <Link href={`/course_page/${course.teacher_id}?chapter=1&lecture=1`}>
                    <div className="p-4">
                      <SearchCard 
                        main_title={course.course_name || course.name} 
                        subtitle1={`by ${course.teacher_name}`} 
                        type="course" 
                        subtitle3="course"
                      />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

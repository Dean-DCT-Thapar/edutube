"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import TopBar from '../component/TopBar';
import SideBar from '../component/SideBar';
import {
  PersonRounded,
  SearchRounded,
  SchoolRounded,
  GroupRounded,
  ClearRounded,
  VerifiedRounded
} from "@mui/icons-material";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async (page = 1, search = "") => {
    try {
      setLoading(page === 1);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12'
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await axios.get(`/api/teachers?${params}`);
      
      if (page === 1) {
        setTeachers(response.data.teachers);
      } else {
        setTeachers(prev => [...prev, ...response.data.teachers]);
      }
      
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchInitiated(true);
    fetchTeachers(1, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchInitiated(false);
    fetchTeachers(1, "");
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchTeachers(pagination.currentPage + 1, searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Teachers</h1>
        <p className="text-gray-600">
          Meet our amazing educators and explore the courses they teach.
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <SearchRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teachers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
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
          {(searchQuery || searchInitiated) && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <ClearRounded />
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {loading && pagination.currentPage === 1 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading teachers...</span>
        </div>
      ) : (
        <div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {searchInitiated && searchQuery 
                ? `Search results for "${searchQuery}"`
                : "All Teachers"
              }
            </h2>
            <div className="text-sm text-gray-600">
              {pagination.totalCount} {pagination.totalCount === 1 ? 'teacher' : 'teachers'}
            </div>
          </div>

          {/* Teachers Grid */}
          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <PersonRounded className="text-6xl text-gray-300 mb-4 mx-auto" />
              <p className="text-gray-500 text-lg">
                {searchInitiated ? 'No teachers found' : 'No teachers available'}
              </p>
              <p className="text-gray-400">
                {searchInitiated 
                  ? 'Try adjusting your search terms'
                  : 'Check back later for new teachers'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                  <Link 
                    key={teacher.id} 
                    href={`/teacher/${teacher.id}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all duration-200 group-hover:bg-primary-50">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {teacher.name}
                            </h3>
                            <VerifiedRounded className="text-primary-600 text-sm" />
                          </div>
                          <p className="text-sm text-gray-600">{teacher.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <SchoolRounded className="mr-2 text-lg" />
                          <span className="text-sm">{teacher.courseCount} courses</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <GroupRounded className="mr-2 text-lg" />
                          <span className="text-sm">{teacher.studentCount} students</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Joined {new Date(teacher.joinedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {pagination.hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More Teachers'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  );
}

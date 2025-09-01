'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../component/AdminLayout';
import TeacherTable from '../../component/TeacherTable';
import TeacherModal from '../../component/TeacherModal';
import {
    AddRounded,
    SearchRounded,
    SchoolRounded
} from '@mui/icons-material';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: ''
    });
    const [showTeacherModal, setShowTeacherModal] = useState(false);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`http://localhost:5000/api/admin/teachers?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTeachers(response.data.teachers);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/students/dropdown', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, [filters]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleCreateTeacher = async (data) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:5000/api/admin/teachers', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Teacher created successfully');
            setShowTeacherModal(false);
            fetchTeachers();
            fetchStudents(); // Refresh students list as one has become a teacher
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create teacher');
        }
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    return (
        <AdminLayout title="Teacher Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage teacher accounts and course assignments
                        </p>
                    </div>
                    <button
                        onClick={() => setShowTeacherModal(true)}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <AddRounded className="mr-2" />
                        Promote to Teacher
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="relative">
                        <SearchRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teachers by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Teachers Table */}
                <TeacherTable
                    teachers={teachers}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />

                {/* Teacher Modal */}
                {showTeacherModal && (
                    <TeacherModal
                        students={students}
                        isOpen={showTeacherModal}
                        onClose={() => setShowTeacherModal(false)}
                        onSubmit={handleCreateTeacher}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default TeachersPage;

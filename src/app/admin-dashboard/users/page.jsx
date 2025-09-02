'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../component/AdminLayout';
import UserTable from '../../component/UserTable';
import UserModal from '../../component/UserModal';
import ConfirmDialog from '../../component/ConfirmDialog';
import {
    AddRounded,
    SearchRounded,
    FilterListRounded
} from '@mui/icons-material';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        role: 'all',
        search: ''
    });
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'all') {
                    params.append(key, value);
                }
            });

            const response = await axios.get(`/api/admin/users?${params}`, {
                withCredentials: true
            });

            setUsers(response.data.users);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const handleCreateUser = async (userData) => {
        try {
            await axios.post('/api/admin/users', userData, {
                withCredentials: true
            });
            toast.success('User created successfully');
            setShowUserModal(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            await axios.put(`/api/admin/users/${editingUser.id}`, userData, {
                withCredentials: true
            });
            toast.success('User updated successfully');
            setShowUserModal(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`/api/admin/users/${deletingUser.id}`, {
                withCredentials: true
            });
            toast.success('User deleted successfully');
            setShowDeleteDialog(false);
            setDeletingUser(null);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowUserModal(true);
    };

    const handleDelete = (user) => {
        setDeletingUser(user);
        setShowDeleteDialog(true);
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleSearch = (searchTerm) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleRoleFilter = (role) => {
        setFilters(prev => ({ ...prev, role, page: 1 }));
    };

    return (
        <AdminLayout title="User Management">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage user accounts and permissions
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUserModal(true)}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        <AddRounded className="mr-2" />
                        Add User
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <SearchRounded className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={filters.search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Role Filter */}
                        <div className="sm:w-48">
                            <select
                                value={filters.role}
                                onChange={(e) => handleRoleFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="student">Students</option>
                                <option value="teacher">Teachers</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <UserTable
                    users={users}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* User Modal */}
                {showUserModal && (
                    <UserModal
                        user={editingUser}
                        isOpen={showUserModal}
                        onClose={() => {
                            setShowUserModal(false);
                            setEditingUser(null);
                        }}
                        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                    />
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <ConfirmDialog
                        isOpen={showDeleteDialog}
                        title="Delete User"
                        message={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone and will remove all associated data.`}
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        onConfirm={handleDeleteUser}
                        onCancel={() => {
                            setShowDeleteDialog(false);
                            setDeletingUser(null);
                        }}
                        type="danger"
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default UsersPage;

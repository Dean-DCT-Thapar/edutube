'use client';
import React, { useState, useEffect } from 'react';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import AdminLayout from '../../component/AdminLayout';
import {
    SettingsRounded,
    SecurityRounded,
    VisibilityRounded,
    VisibilityOffRounded
} from '@mui/icons-material';

const SettingsPage = () => {
    const [userData, setUserData] = useState(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState({
        password: false
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await frontendApi.get('/api/verify-auth');
            if (data?.status === 200) {
                setUserData(data);
            }
        } catch (error) {
            const message = error?.message || 'Failed to load user data';
            toast.error(message);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(prev => ({ ...prev, password: true }));
        try {
            await frontendApi.post('/api/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({});
        } catch (error) {
            const message = error?.message || 'Failed to update password';
            toast.error(message);
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <AdminLayout title="Settings">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Password Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl w-full mx-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <SecurityRounded className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                                    <p className="text-sm text-gray-600">Update your account password</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
                            {/* Current Password */}
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full h-11 pr-11 px-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                                            errors.currentPassword ? 'border-red-300 bg-red-50/40' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        {showPasswords.current ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full h-11 pr-11 px-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                                            errors.newPassword ? 'border-red-300 bg-red-50/40' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        {showPasswords.new ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full h-11 pr-11 px-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                                            errors.confirmPassword ? 'border-red-300 bg-red-50/40' : 'border-gray-300'
                                        }`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        {showPasswords.confirm ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading.password}
                                className="w-full h-11 flex items-center justify-center px-4 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <SecurityRounded className="mr-2" />
                                {loading.password ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* System Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <SettingsRounded className="text-gray-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">System Information</h3>
                                <p className="text-sm text-gray-600">Current system status and information</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Platform Details</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Platform:</span>
                                        <span>EduTube Admin Dashboard</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Version:</span>
                                        <span>1.0.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Updated:</span>
                                        <span>{new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">Account Details</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>User ID:</span>
                                        <span>{userData?.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Role:</span>
                                        <span className="capitalize">{userData?.role}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <span className="text-green-600">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SettingsPage;

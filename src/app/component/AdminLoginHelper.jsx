'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    AdminPanelSettingsRounded,
    LoginRounded,
    InfoRounded
} from '@mui/icons-material';

const AdminLoginHelper = () => {
    const router = useRouter();

    const handleAdminLogin = async () => {
        const loadingToast = toast.loading('Logging in as admin...', {id: 'admin-login'});
        
        try {
            // Use actual admin credentials to login
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'admin@gmail.com',
                    password: 'aahil'
                })
            });

            const data = await response.json();

            if (data.success && data.role === 'admin') {
                // Store the admin token if provided
                if (data.accessToken) {
                    localStorage.setItem('adminToken', data.accessToken);
                }
                
                toast.success('Logged in as admin successfully!', {id: loadingToast});
                router.push('/admin-dashboard');
            } else {
                throw new Error(data.message || 'Failed to login as admin');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            toast.error('Failed to login as admin. Make sure backend is running and admin user exists.', {id: loadingToast});
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <AdminPanelSettingsRounded className="text-red-600 text-sm" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Admin Access</h3>
                        <p className="text-xs text-gray-600">For development testing</p>
                    </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start">
                        <InfoRounded className="text-blue-600 mr-2 mt-0.5 text-sm" />
                        <div className="text-xs text-blue-800">
                            <p className="font-medium">Admin Credentials:</p>
                            <p>Email: admin@edutube.com</p>
                            <p>Password: admin123</p>
                        </div>
                    </div>
                </div>
                
                <button
                    onClick={handleAdminLogin}
                    className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <LoginRounded className="mr-1 text-sm" />
                    Quick Admin Login
                </button>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                    Development mode only
                </p>
            </div>
        </div>
    );
};

export default AdminLoginHelper;

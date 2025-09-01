'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    BugReportRounded,
    InfoRounded,
    CheckCircleRounded,
    ErrorRounded
} from '@mui/icons-material';

const AdminDebugHelper = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [debugInfo, setDebugInfo] = useState(null);
    const router = useRouter();

    const runDiagnostics = async () => {
        const info = {
            timestamp: new Date().toISOString(),
            localStorage: {},
            cookies: {},
            apis: {}
        };

        // Check localStorage
        try {
            info.localStorage.adminToken = localStorage.getItem('adminToken') ? 'Present' : 'Missing';
            info.localStorage.hasStorage = true;
        } catch (error) {
            info.localStorage.hasStorage = false;
            info.localStorage.error = error.message;
        }

        // Check cookies
        try {
            info.cookies.document = document.cookie ? 'Present' : 'Empty';
        } catch (error) {
            info.cookies.error = error.message;
        }

        // Test verify-auth API
        try {
            const authResponse = await fetch('/api/verify-auth');
            const authData = await authResponse.json();
            info.apis.verifyAuth = {
                status: authResponse.status,
                data: authData
            };
        } catch (error) {
            info.apis.verifyAuth = {
                error: error.message
            };
        }

        // Test backend connection
        try {
            const backendResponse = await fetch('http://localhost:5000/health');
            info.apis.backend = {
                status: backendResponse.status,
                reachable: true
            };
        } catch (error) {
            info.apis.backend = {
                reachable: false,
                error: error.message
            };
        }

        // Test login API
        try {
            const loginResponse = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@edutube.com',
                    password: 'admin123'
                })
            });
            const loginData = await loginResponse.json();
            info.apis.login = {
                status: loginResponse.status,
                data: loginData
            };
        } catch (error) {
            info.apis.login = {
                error: error.message
            };
        }

        setDebugInfo(info);
    };

    const clearStorageAndRetry = () => {
        localStorage.clear();
        document.cookie.split(";").forEach((c) => {
            const eqPos = c.indexOf("=");
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
        toast.success('Storage cleared. Try logging in again.');
        router.push('/login');
    };

    const forceAdminLogin = async () => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@edutube.com',
                    password: 'admin123'
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.accessToken) {
                localStorage.setItem('adminToken', data.accessToken);
                toast.success('Admin login successful!');
                router.push('/admin-dashboard');
            } else {
                toast.error('Login failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            toast.error('Network error: ' + error.message);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-50 p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700"
                title="Open Debug Panel"
            >
                <BugReportRounded />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <BugReportRounded className="text-orange-600" />
                            <h3 className="text-lg font-semibold">Admin Login Debug Panel</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={runDiagnostics}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Run Diagnostics
                        </button>
                        <button
                            onClick={forceAdminLogin}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Force Admin Login
                        </button>
                        <button
                            onClick={clearStorageAndRetry}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Clear Storage & Retry
                        </button>
                    </div>

                    {debugInfo && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold mb-3">Diagnostic Results:</h4>
                            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <InfoRounded className="text-blue-600 mr-2 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-2">Troubleshooting Steps:</p>
                                <ol className="text-xs space-y-1 list-decimal list-inside">
                                    <li>Ensure your backend is running on http://localhost:5000</li>
                                    <li>Verify admin user exists in your database</li>
                                    <li>Check that all API endpoints are working</li>
                                    <li>Clear browser storage if there are token conflicts</li>
                                    <li>Check browser console for additional errors</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDebugHelper;

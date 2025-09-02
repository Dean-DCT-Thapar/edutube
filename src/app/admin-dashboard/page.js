'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminLayout from '../component/AdminLayout';
import DashboardStats from '../component/DashboardStats';
import RecentActivity from '../component/RecentActivity';

export default function AdminDashboard() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Prevent running multiple times
        if (!loading) return;
        
        console.log('Admin dashboard useEffect running, loading:', loading);
        const loadingToast = toast.loading('Loading...', { id: 'dashboard-loading' });

        console.log('Calling /api/verify-auth with withCredentials...');
        // Verify authentication using cookies
        axios.get('/api/verify-auth', {
            withCredentials: true
        })
            .then((authResponse) => {
                console.log('Auth response received:', authResponse.data);
                if (authResponse.data.status === 200) {
                    if (authResponse.data.role !== 'admin') {
                        console.error('User role is not admin:', authResponse.data.role);
                        throw new Error('Access denied. Administrators only.');
                    }
                    console.log('Admin authentication successful');
                    setUserData(authResponse.data);
                    
                    // Fetch dashboard stats using cookies
                    console.log('Fetching dashboard stats...');
                    return axios.get('/api/admin/dashboard/stats', {
                        withCredentials: true
                    });
                } else {
                    console.error('Auth response status not 200:', authResponse.data);
                    throw new Error(authResponse.data.message || 'Authentication failed');
                }
            })
            .then((statsResponse) => {
                setDashboardData(statsResponse.data);
                toast.dismiss(loadingToast);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Dashboard error details:', {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    headers: error.response?.headers
                });
                toast.dismiss(loadingToast);
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage, {id: loadingToast});
                
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log('Redirecting to login due to auth error');
                    router.push('/login');
                } else {
                    console.log('Setting loading to false due to non-auth error');
                    setLoading(false);
                }
            });
    }, []); // Empty dependency array to run only once

    if (loading) {
        return (
            <AdminLayout title="Dashboard" userName={userData?.name}>
                <div className="animate-pulse space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-200 h-64 rounded-lg"></div>
                        <div className="bg-gray-200 h-64 rounded-lg"></div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard" userName={userData?.name}>
            <div className="space-y-6">
                {/* Dashboard Statistics */}
                {dashboardData && <DashboardStats stats={dashboardData.stats} />}
                
                {/* Recent Activity */}
                {dashboardData && (
                    <RecentActivity 
                        recentUsers={dashboardData.recentUsers}
                        recentCourseInstances={dashboardData.recentCourseInstances}
                    />
                )}
            </div>
        </AdminLayout>
    );
} 
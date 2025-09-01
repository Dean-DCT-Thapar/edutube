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
        const loadingToast = toast.loading('Loading...', { id: 'dashboard-loading' });

        // Verify authentication first
        axios.get('/api/verify-auth')
            .then((authResponse) => {
                console.log('Auth response:', authResponse.data);
                if (authResponse.data.status === 200) {
                    if (authResponse.data.role !== 'admin') {
                        throw new Error('Access denied. Administrators only.');
                    }
                    setUserData(authResponse.data);
                    
                    // Check if we have an admin token stored
                    const adminToken = localStorage.getItem('adminToken');
                    console.log('Admin token from localStorage:', adminToken ? 'Present' : 'Missing');
                    
                    // Fetch dashboard stats if we have admin token
                    if (adminToken) {
                        return axios.get('http://localhost:5000/api/admin/dashboard/stats', {
                            headers: {
                                'Authorization': `Bearer ${adminToken}`
                            }
                        });
                    } else {
                        console.warn('No admin token found, using mock data');
                        // Return mock data for development
                        return Promise.resolve({
                            data: {
                                stats: {
                                    users: 0,
                                    teachers: 0,
                                    courses: 0,
                                    lectures: 0,
                                    enrollments: 0
                                },
                                recentUsers: [],
                                recentCourses: []
                            }
                        });
                    }
                } else {
                    throw new Error(authResponse.data.message || 'Authentication failed');
                }
            })
            .then((statsResponse) => {
                setDashboardData(statsResponse.data);
                toast.dismiss(loadingToast);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Dashboard error:', error);
                toast.dismiss(loadingToast);
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage, {id: loadingToast});
                
                if (error.response?.status === 401 || error.response?.status === 403) {
                    router.push('/login');
                } else {
                    setLoading(false);
                }
            });
    }, [router]);

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
                        recentCourses={dashboardData.recentCourses}
                    />
                )}
            </div>
        </AdminLayout>
    );
} 
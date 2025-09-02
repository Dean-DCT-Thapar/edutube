'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function TeacherDashboard() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadingToast = toast.loading('Loading...', { id: 'dashboard-loading' });
        
        const token = localStorage.getItem('token');
        if (!token) {
            toast.dismiss(loadingToast);
            toast.error('Please login to continue');
            router.push('/login');
            return;
        }

        axios.get('/api/verify-auth', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((authResponse) => {
                if (authResponse.data.status === 200) {
                    if (authResponse.data.role !== 'teacher') {
                        throw new Error('Access denied. Teachers only.');
                    }
                    toast.dismiss(loadingToast);
                    setUserData(authResponse.data);
                } else {
                    throw new Error(authResponse.data.message || 'Authentication failed');
                }
            })
            .catch((error) => {
                toast.dismiss(loadingToast);
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage, {id: loadingToast});
                router.push('/login');
            });
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
            <div className="mb-8">
                <p className="text-lg">Welcome to the Teacher Portal</p>
                {/* Add teacher-specific content here */}
            </div>
            <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
} 
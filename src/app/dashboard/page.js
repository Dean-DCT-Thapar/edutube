'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const router = useRouter();

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const loadingToast = toast.loading('Loading...', { id: 'dashboard-loading' });

        Promise.all([
            axios.get('/api/verify-auth'),
            axios.get('/api/get-user-data')
        ])
            .then(([authResponse, userDataResponse]) => {
                if (authResponse.data.status === 200) {
                    toast.dismiss(loadingToast);
                    setUserData(userDataResponse.data);
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
        <div>
            <div className="text-2xl font-bold mb-4">Welcome {userData?.name}</div>
            <div>
                <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
                {userData?.courses?.map((course) => (
                    <div key={course.course_id} className="border rounded-lg p-4 mb-4 shadow-sm">
                        <p className="text-xl font-semibold mb-2">{course.course_name}</p>
                        <p className="text-gray-600">Teacher: {course.teacher_name}</p>
                    </div>
                ))}
            </div>
            <div>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
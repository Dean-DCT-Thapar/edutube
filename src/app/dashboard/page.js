'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/verify-auth')
            .then(response => {
                if (response.data.status === 200) {
                    setIsLoading(false);
                } else {
                    throw new Error(response.data.message || 'Authentication failed');
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage);
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>Dashboard Content</div>
            <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}
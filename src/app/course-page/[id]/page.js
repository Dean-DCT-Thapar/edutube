'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CoursePage() {
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const loadingToast = toast.loading('Loading...', { id: 'course-loading' });

        Promise.all([
            axios.get('/api/verify-auth'),
        ])
            .then(([authResponse]) => {
                if (authResponse.data.status === 200){
                    if (authResponse.data.role !== 'student') {
                        throw new Error('Access denied. Students only.');
                    }
                    toast.success('Loaded successfully', { id: 'course-loading' } , { duration: 100 });
                } else {
                    throw new Error(authResponse.data.message || 'Authentication failed');
                }
            })
            .catch((error) => {
                toast.dismiss(loadingToast);
                const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
                toast.error(errorMessage, { id: 'course-error' });
                router.push('/login');
            });
    }, []);

    return (
        <div>
            <h1>Course Page {params.id}</h1>
        </div>
    );

}
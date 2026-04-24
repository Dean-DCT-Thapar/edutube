'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';
import TeacherLayout from '../../component/TeacherLayout';
import {
    SecurityRounded,
    VisibilityRounded,
    VisibilityOffRounded
} from '@mui/icons-material';

export default function TeacherSettingsPage() {
    const router = useRouter();
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [show, setShow] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    useEffect(() => {
        frontendApi
            .verifyAuth()
            .then((auth) => {
                if (auth.status !== 200) throw new Error('auth');
                if (auth.role !== 'teacher') throw new Error('role');
                setUserName(auth.name);
            })
            .catch((err) => {
                if (err.message === 'role') {
                    router.push('/dashboard');
                    return;
                }
                router.push('/login');
            });
    }, [router]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleVisibility = (field) => {
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        setLoading(true);
        try {
            await frontendApi.post('/api/change-password', {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword
            });

            toast.success('Password changed successfully');
            setForm({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            if (error?.response?.status === 401 || error?.status === 401) {
                toast.error('Invalid current password');
            } else {
                toast.error(error?.message || 'Failed to change password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <TeacherLayout title="Settings" userName={userName}>
            <div className="max-w-2xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <SecurityRounded className="text-red-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Change Password</h1>
                                <p className="text-sm text-gray-600">
                                    Update your teacher account password
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="oldPassword"
                                    name="oldPassword"
                                    type={show.oldPassword ? 'text' : 'password'}
                                    value={form.oldPassword}
                                    onChange={onChange}
                                    required
                                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('oldPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {show.oldPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={show.newPassword ? 'text' : 'password'}
                                    value={form.newPassword}
                                    onChange={onChange}
                                    required
                                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('newPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {show.newPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={show.confirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={onChange}
                                    required
                                    className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility('confirmPassword')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {show.confirmPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-700">Password must be at least 6 characters long.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SecurityRounded className="mr-2" />
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </TeacherLayout>
    );
}

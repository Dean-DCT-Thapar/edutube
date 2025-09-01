'use client';
import React, { useState } from 'react';
import {
    CloseRounded,
    SchoolRounded,
    PersonRounded
} from '@mui/icons-material';

const TeacherModal = ({ students, isOpen, onClose, onSubmit }) => {
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedUserId) {
            setError('Please select a user to promote');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            await onSubmit({ userId: parseInt(selectedUserId) });
        } catch (error) {
            setError('Failed to create teacher');
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = (e) => {
        setSelectedUserId(e.target.value);
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <SchoolRounded className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Promote to Teacher
                            </h3>
                            <p className="text-sm text-gray-600">
                                Select a student to promote to teacher
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                    >
                        <CloseRounded />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {/* Student Selection */}
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Student
                            </label>
                            {students.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <PersonRounded className="text-gray-300 text-2xl mb-2" />
                                    <p>No students available to promote</p>
                                </div>
                            ) : (
                                <select
                                    id="userId"
                                    value={selectedUserId}
                                    onChange={handleUserChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                                        error ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Choose a student...</option>
                                    {students.map((student) => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} ({student.email})
                                        </option>
                                    ))}
                                </select>
                            )}
                            {error && (
                                <p className="mt-1 text-sm text-red-600">{error}</p>
                            )}
                        </div>

                        {/* Info box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <SchoolRounded className="text-blue-600 mr-2 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">What happens when promoting to teacher?</p>
                                    <ul className="text-xs space-y-1">
                                        <li>• User role changes from "student" to "teacher"</li>
                                        <li>• Teacher record is created in the system</li>
                                        <li>• User can now be assigned to courses</li>
                                        <li>• Teacher gains access to teaching features</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || students.length === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Promoting...' : 'Promote to Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherModal;

'use client';

import { useState, useEffect } from 'react';
import { CloseRounded, BookRounded } from '@mui/icons-material';
import frontendApi from '@/utils/frontendApiClient';

export default function TeacherChapterModal({
    mode,
    courseInstanceId,
    courseLabel,
    chapter,
    isOpen,
    onClose,
    onSaved
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        if (mode === 'edit' && chapter) {
            setName(chapter.name || '');
            setDescription(chapter.description || '');
        } else {
            setName('');
            setDescription('');
        }
        setNameError('');
    }, [isOpen, mode, chapter]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) { setNameError('Chapter name is required'); return; }
        setLoading(true);
        setNameError('');
        try {
            if (mode === 'create') {
                await frontendApi.post('/api/teacher/chapters', {
                    name: trimmed,
                    description: description || '',
                    course_instance_id: courseInstanceId
                });
            } else if (chapter) {
                await frontendApi.put(`/api/teacher/chapters/${chapter.id}`, {
                    name: trimmed,
                    description: description || ''
                });
            }
            await onSaved?.();
            onClose();
        } catch (err) {
            setNameError(err.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-50">
                            <BookRounded className="text-primary-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">
                                {mode === 'create' ? 'Create New Chapter' : 'Edit Chapter'}
                            </h3>
                            {courseLabel && (
                                <p className="text-xs text-gray-500 mt-0.5">{courseLabel}</p>
                            )}
                        </div>
                    </div>
                    <button type="button" onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                        <CloseRounded />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="tc-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Chapter Name
                        </label>
                        <input
                            id="tc-name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setNameError(''); }}
                            placeholder="e.g. Introduction to the subject"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                                nameError ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                    </div>

                    <div>
                        <label htmlFor="tc-desc" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="font-normal text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                            id="tc-desc"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of what this chapter covers…"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                            {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

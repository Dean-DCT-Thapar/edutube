'use client';

import { useState, useEffect } from 'react';
import { CloseRounded, VideoLibraryRounded } from '@mui/icons-material';
import frontendApi from '@/utils/frontendApiClient';
import toast from 'react-hot-toast';

/* ── inline TagInput – same implementation as admin lectures page ── */
function TagInput({ tags, onTagsChange, placeholder = 'Add tags…' }) {
    const [inputValue, setInputValue] = useState('');

    const addTag = () => {
        const trimmed = inputValue.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
            onTagsChange([...tags, trimmed]);
            setInputValue('');
        }
    };

    const removeTag = (idx) => onTagsChange(tags.filter((_, i) => i !== idx));

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        if (val.includes(',')) {
            setInputValue(val.replace(',', ''));
            addTag();
        } else {
            setInputValue(val);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
                {tags.map((tag, idx) => (
                    <span key={idx}
                        className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)}
                            className="ml-1 text-primary-600 hover:text-primary-800">
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    disabled={tags.length >= 10}
                    className="flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm"
                />
            </div>
            {tags.length >= 10 && (
                <p className="mt-1 text-xs text-amber-600">Maximum 10 tags reached.</p>
            )}
        </div>
    );
}

/* ── modal ── */
export default function TeacherLectureEditModal({ lecture, courseLabel, isOpen, onClose, onSaved }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [titleError, setTitleError] = useState('');

    useEffect(() => {
        if (!isOpen || !lecture) return;
        setTitle(lecture.title || '');
        setDescription(lecture.description || '');
        setTags((lecture.tags || []).map((t) => (typeof t === 'object' ? t.tag : t)));
        setTitleError('');
    }, [lecture, isOpen]);

    if (!isOpen || !lecture) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) { setTitleError('Title is required'); return; }
        setLoading(true);
        setTitleError('');
        try {
            await frontendApi.put(`/api/teacher/lectures/${lecture.id}`, {
                title: trimmed,
                description,
                tags
            });
            await onSaved?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Could not save lecture');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-50">
                            <VideoLibraryRounded className="text-orange-600 text-lg" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Edit Lecture</h3>
                            {courseLabel && <p className="text-xs text-gray-500 mt-0.5">{courseLabel}</p>}
                        </div>
                    </div>
                    <button type="button" onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                        <CloseRounded />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="tle-title" className="block text-sm font-medium text-gray-700 mb-1">
                            Lecture Title
                        </label>
                        <input
                            id="tle-title"
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
                            placeholder="Enter lecture title"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm ${
                                titleError ? 'border-red-300' : 'border-gray-300'
                            }`}
                        />
                        {titleError && <p className="mt-1 text-sm text-red-600">{titleError}</p>}
                    </div>

                    <div>
                        <label htmlFor="tle-desc" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="tle-desc"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter lecture description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags <span className="font-normal text-gray-400">(Optional)</span>
                        </label>
                        <TagInput
                            tags={tags}
                            onTagsChange={setTags}
                            placeholder="Type a tag and press Enter or comma…"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Press Enter or comma to add · Backspace to remove last tag.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                            {loading ? 'Saving…' : 'Update Lecture'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

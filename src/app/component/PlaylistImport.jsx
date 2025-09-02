"use client";

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    PlaylistPlayRounded,
    CloudDownloadRounded,
    CloseRounded,
    DragIndicatorRounded,
    CheckBoxRounded,
    CheckBoxOutlineBlankRounded,
    PlayCircleOutlineRounded,
    AccessTimeRounded,
    EditRounded,
    ReorderRounded
} from '@mui/icons-material';

const PlaylistImport = ({ courseInstanceId, onClose, onImportComplete }) => {
    const [step, setStep] = useState(1); // 1: URL input, 2: Organize videos, 3: Import
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [chapters, setChapters] = useState([]);

    // Step 1: Fetch playlist videos
    const handleFetchPlaylist = async () => {
        if (!playlistUrl.trim()) {
            toast.error('Please enter a playlist URL');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/admin/youtube/fetch-playlist', {
                playlistUrl: playlistUrl.trim()
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setVideos(response.data.videos);
                setStep(2);
                toast.success(`Found ${response.data.videos.length} videos in playlist`);
            } else {
                toast.error('Failed to fetch playlist videos');
            }
        } catch (error) {
            console.error('Error fetching playlist:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch playlist');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Organize videos into chapters
    const toggleVideoSelection = (index) => {
        setVideos(prev => prev.map((video, i) => 
            i === index ? { ...video, selected: !video.selected } : video
        ));
    };

    const updateVideoTitle = (index, newTitle) => {
        setVideos(prev => prev.map((video, i) => 
            i === index ? { ...video, title: newTitle } : video
        ));
    };

    const updateVideoChapter = (index, chapterName) => {
        setVideos(prev => prev.map((video, i) => 
            i === index ? { ...video, chapterName } : video
        ));
    };

    const addNewChapter = () => {
        const chapterName = prompt('Enter chapter name:');
        if (chapterName && !chapters.includes(chapterName)) {
            setChapters(prev => [...prev, chapterName]);
        }
    };

    const autoOrganizeByChapters = () => {
        const videosPerChapter = 3; // Default organization
        const updatedVideos = videos.map((video, index) => {
            const chapterNumber = Math.floor(index / videosPerChapter) + 1;
            const chapterName = `Chapter ${chapterNumber}`;
            return { ...video, chapterName };
        });
        setVideos(updatedVideos);

        // Update chapters list
        const uniqueChapters = [...new Set(updatedVideos.map(v => v.chapterName))];
        setChapters(uniqueChapters);
    };

    // Step 3: Import lectures
    const handleImportLectures = async () => {
        const selectedVideos = videos.filter(video => video.selected);
        
        if (selectedVideos.length === 0) {
            toast.error('Please select at least one video to import');
            return;
        }

        // Validate that all selected videos have chapters assigned
        const videosWithoutChapters = selectedVideos.filter(video => !video.chapterName);
        if (videosWithoutChapters.length > 0) {
            toast.error('Please assign chapters to all selected videos');
            return;
        }

        setImporting(true);
        try {
            // Prepare lecture data
            const chapterGroups = {};
            selectedVideos.forEach(video => {
                if (!chapterGroups[video.chapterName]) {
                    chapterGroups[video.chapterName] = [];
                }
                chapterGroups[video.chapterName].push(video);
            });

            // Create lecture data with proper numbering
            const lectureData = [];
            let chapterNumber = 1;
            
            Object.entries(chapterGroups).forEach(([chapterName, chapterVideos]) => {
                chapterVideos.forEach((video, lectureIndex) => {
                    lectureData.push({
                        title: video.title,
                        description: video.description,
                        youtubeUrl: video.youtubeUrl,
                        duration: video.duration,
                        chapterName: chapterName,
                        chapterNumber: chapterNumber,
                        lectureNumber: lectureIndex + 1
                    });
                });
                chapterNumber++;
            });

            console.log(lectureData);
            const response = await axios.post('/api/admin/youtube/bulk-import-lectures', {
                courseInstanceId: courseInstanceId,
                lectureData: lectureData
            }, {
                withCredentials: true
            });


            if (response.data.success) {
                toast.success(response.data.message);
                setStep(3);
                setTimeout(() => {
                    onImportComplete && onImportComplete();
                    onClose();
                }, 2000);
            } else {
                toast.error('Failed to import lectures');
            }
        } catch (error) {
            console.error('Error importing lectures:', error);
            toast.error(error.response?.data?.message || 'Failed to import lectures');
        } finally {
            setImporting(false);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <PlaylistPlayRounded className="text-primary-600 text-2xl" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Import YouTube Playlist</h2>
                            <p className="text-sm text-gray-600">
                                {step === 1 && 'Enter playlist URL to fetch videos'}
                                {step === 2 && 'Organize videos into chapters'}
                                {step === 3 && 'Import completed successfully!'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <CloseRounded />
                    </button>
                </div>

                {/* Step 1: URL Input */}
                {step === 1 && (
                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    YouTube Playlist URL
                                </label>
                                <input
                                    type="url"
                                    value={playlistUrl}
                                    onChange={(e) => setPlaylistUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/playlist?list=..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Paste the URL of a YouTube playlist to import all videos
                                </p>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFetchPlaylist}
                                    disabled={loading || !playlistUrl.trim()}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Fetching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CloudDownloadRounded />
                                            <span>Fetch Videos</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Organize Videos */}
                {step === 2 && (
                    <div className="flex flex-col h-[600px]">
                        {/* Controls */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">
                                    Found {videos.length} videos • {videos.filter(v => v.selected).length} selected
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={autoOrganizeByChapters}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                    >
                                        <ReorderRounded className="mr-1" />
                                        Auto-organize
                                    </button>
                                    <button
                                        onClick={addNewChapter}
                                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                    >
                                        Add Chapter
                                    </button>
                                </div>
                            </div>
                            
                            {chapters.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm text-gray-600">Chapters:</span>
                                    {chapters.map((chapter, index) => (
                                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 rounded-md text-sm">
                                            {chapter}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Video List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-3">
                                {videos.map((video, index) => (
                                    <div
                                        key={video.id}
                                        className={`border rounded-lg p-4 transition-all ${
                                            video.selected ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-4">
                                            {/* Selection checkbox */}
                                            <button
                                                onClick={() => toggleVideoSelection(index)}
                                                className="mt-1"
                                            >
                                                {video.selected ? (
                                                    <CheckBoxRounded className="text-primary-600" />
                                                ) : (
                                                    <CheckBoxOutlineBlankRounded className="text-gray-400" />
                                                )}
                                            </button>

                                            {/* Thumbnail */}
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-24 h-18 object-cover rounded flex-shrink-0"
                                            />

                                            {/* Video details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 pr-4">
                                                        <input
                                                            type="text"
                                                            value={video.title}
                                                            onChange={(e) => updateVideoTitle(index, e.target.value)}
                                                            className="w-full font-medium text-gray-900 border-none bg-transparent focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
                                                        />
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                            {video.description}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                            <span className="flex items-center">
                                                                <AccessTimeRounded className="mr-1 text-xs" />
                                                                {formatDuration(video.duration)}
                                                            </span>
                                                            <span>Position: {index + 1}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chapter assignment */}
                                                {video.selected && (
                                                    <div className="mt-3">
                                                        <div className="flex items-center space-x-2">
                                                            <label className="text-sm font-medium text-gray-700">Chapter:</label>
                                                            <select
                                                                value={video.chapterName || ''}
                                                                onChange={(e) => updateVideoChapter(index, e.target.value)}
                                                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500"
                                                            >
                                                                <option value="">Select chapter...</option>
                                                                {chapters.map((chapter, i) => (
                                                                    <option key={i} value={chapter}>{chapter}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleImportLectures}
                                    disabled={importing || videos.filter(v => v.selected).length === 0}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {importing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Importing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CloudDownloadRounded />
                                            <span>Import {videos.filter(v => v.selected).length} Videos</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckBoxRounded className="text-green-600 text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Import Completed Successfully!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Your videos have been imported and organized into chapters and lectures.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistImport;

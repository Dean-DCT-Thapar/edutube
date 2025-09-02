"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    PlaylistPlayRounded,
    CloudDownloadRounded,
    CloseRounded,
    DragIndicatorRounded,
    AddRounded,
    DeleteRounded,
    EditRounded,
    PlayCircleOutlineRounded,
    AccessTimeRounded,
    FolderRounded,
    VideoLibraryRounded,
    ArrowDownwardRounded,
    SaveRounded
} from '@mui/icons-material';

const PlaylistChapterOrganizer = ({ courseInstanceId, onClose, onImportComplete }) => {
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [videos, setVideos] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [draggedVideo, setDraggedVideo] = useState(null);
    const [dragOverTarget, setDragOverTarget] = useState(null);

    // Fetch playlist videos
    const handleFetchPlaylist = async () => {
        if (!playlistUrl.trim()) {
            toast.error('Please enter a playlist URL');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.post('http://localhost:5000/api/admin/youtube/fetch-playlist', {
                playlistUrl: playlistUrl.trim()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const videosWithIds = response.data.videos.map((video, index) => ({
                    ...video,
                    tempId: `video-${index}`,
                    originalIndex: index
                }));
                setVideos(videosWithIds);
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

    // Chapter management
    const addChapter = () => {
        const chapterName = prompt('Enter chapter name:');
        if (chapterName && chapterName.trim()) {
            const newChapter = {
                id: `chapter-${Date.now()}`,
                name: chapterName.trim(),
                lectures: []
            };
            setChapters(prev => [...prev, newChapter]);
        }
    };

    const deleteChapter = (chapterId) => {
        if (confirm('Are you sure you want to delete this chapter? All lectures will be moved back to the video list.')) {
            const chapterToDelete = chapters.find(c => c.id === chapterId);
            if (chapterToDelete) {
                // Move lectures back to videos list
                const lecturesAsVideos = chapterToDelete.lectures.map(lecture => lecture.video);
                setVideos(prev => [...prev, ...lecturesAsVideos]);
                setChapters(prev => prev.filter(c => c.id !== chapterId));
            }
        }
    };

    const editChapterName = (chapterId) => {
        const chapter = chapters.find(c => c.id === chapterId);
        const newName = prompt('Enter new chapter name:', chapter.name);
        if (newName && newName.trim()) {
            setChapters(prev => prev.map(c => 
                c.id === chapterId ? { ...c, name: newName.trim() } : c
            ));
        }
    };

    const editLectureName = (chapterId, lectureIndex) => {
        const chapter = chapters.find(c => c.id === chapterId);
        const lecture = chapter.lectures[lectureIndex];
        const newName = prompt('Enter new lecture name:', lecture.name);
        if (newName && newName.trim()) {
            setChapters(prev => prev.map(c => 
                c.id === chapterId ? {
                    ...c,
                    lectures: c.lectures.map((l, i) => 
                        i === lectureIndex ? { ...l, name: newName.trim() } : l
                    )
                } : c
            ));
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e, video) => {
        setDraggedVideo(video);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, target) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverTarget(target);
    };

    const handleDrop = (e, chapterId) => {
        e.preventDefault();
        if (!draggedVideo) return;

        const lectureName = draggedVideo.title || `Lecture ${Date.now()}`;
        const newLecture = {
            id: `lecture-${Date.now()}`,
            name: lectureName,
            video: draggedVideo
        };

        // Add to chapter
        setChapters(prev => prev.map(c => 
            c.id === chapterId ? {
                ...c,
                lectures: [...c.lectures, newLecture]
            } : c
        ));

        // Remove from videos list
        setVideos(prev => prev.filter(v => v.tempId !== draggedVideo.tempId));

        setDraggedVideo(null);
        setDragOverTarget(null);
    };

    const handleDragEnd = () => {
        setDraggedVideo(null);
        setDragOverTarget(null);
    };

    // Remove lecture from chapter (move back to videos)
    const removeLectureFromChapter = (chapterId, lectureIndex) => {
        const chapter = chapters.find(c => c.id === chapterId);
        const lecture = chapter.lectures[lectureIndex];
        
        // Move back to videos
        setVideos(prev => [...prev, lecture.video]);
        
        // Remove from chapter
        setChapters(prev => prev.map(c => 
            c.id === chapterId ? {
                ...c,
                lectures: c.lectures.filter((_, i) => i !== lectureIndex)
            } : c
        ));
    };

    // Import lectures
    const handleImportLectures = async () => {
        if (chapters.length === 0) {
            toast.error('Please create at least one chapter');
            return;
        }

        const hasLectures = chapters.some(chapter => chapter.lectures.length > 0);
        if (!hasLectures) {
            toast.error('Please add at least one lecture to a chapter');
            return;
        }

        setImporting(true);
        try {
            const lectureData = [];
            
            chapters.forEach((chapter, chapterIndex) => {
                chapter.lectures.forEach((lecture, lectureIndex) => {
                    lectureData.push({
                        title: lecture.name,
                        description: lecture.video.description || '',
                        youtubeUrl: lecture.video.youtubeUrl,
                        duration: lecture.video.duration,
                        chapterName: chapter.name,
                        chapterNumber: chapterIndex + 1,
                        lectureNumber: lectureIndex + 1
                    });
                });
            });

            const token = localStorage.getItem('adminToken');
            console.log(lectureData);
            const response = await axios.post('http://localhost:5000/api/admin/youtube/bulk-import-lectures', {
                courseInstanceId: courseInstanceId,
                lectureData: lectureData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setTimeout(() => {
                    onImportComplete && onImportComplete();
                    onClose();
                }, 1500);
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

    const totalLectures = chapters.reduce((sum, chapter) => sum + chapter.lectures.length, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <PlaylistPlayRounded className="text-primary-600 text-2xl" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Import & Organize YouTube Playlist</h2>
                            <p className="text-sm text-gray-600">
                                Drag videos from the playlist to organize them into chapters and lectures
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

                {/* Playlist URL Input */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <input
                                type="url"
                                value={playlistUrl}
                                onChange={(e) => setPlaylistUrl(e.target.value)}
                                placeholder="https://www.youtube.com/playlist?list=..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleFetchPlaylist}
                            disabled={loading || !playlistUrl.trim()}
                            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
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

                {/* Main Content */}
                {videos.length > 0 && (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Sidebar - Playlist Videos */}
                        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <VideoLibraryRounded className="mr-2 text-primary-600" />
                                        Playlist Videos
                                    </h3>
                                    <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                                        {videos.length}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                    Drag videos to chapters to organize them
                                </p>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {videos.map((video, index) => (
                                    <div
                                        key={video.tempId}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, video)}
                                        onDragEnd={handleDragEnd}
                                        className="bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow group"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <DragIndicatorRounded className="text-gray-400 mt-1 group-hover:text-gray-600" />
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-16 h-12 object-cover rounded flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                    {video.title}
                                                </h4>
                                                <div className="flex items-center text-xs text-gray-500 space-x-2">
                                                    <span className="flex items-center">
                                                        <AccessTimeRounded style={{ fontSize: '12px' }} className="mr-1" />
                                                        {formatDuration(video.duration)}
                                                    </span>
                                                    <span>#{index + 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Panel - Chapters */}
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 flex items-center">
                                        <FolderRounded className="mr-2 text-primary-600" />
                                        Course Chapters
                                        {totalLectures > 0 && (
                                            <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {totalLectures} lectures
                                            </span>
                                        )}
                                    </h3>
                                    <button
                                        onClick={addChapter}
                                        className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                                    >
                                        <AddRounded className="mr-1" />
                                        Add Chapter
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {chapters.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FolderRounded className="mx-auto text-gray-400 mb-4" style={{ fontSize: '48px' }} />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters yet</h3>
                                        <p className="text-gray-600 mb-6">
                                            Create chapters to organize your playlist videos into structured lectures.
                                        </p>
                                        <button
                                            onClick={addChapter}
                                            className="flex items-center mx-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                                        >
                                            <AddRounded className="mr-2" />
                                            Create First Chapter
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {chapters.map((chapter, chapterIndex) => (
                                            <div
                                                key={chapter.id}
                                                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                                                    dragOverTarget === chapter.id
                                                        ? 'border-primary-400 bg-primary-50'
                                                        : 'border-gray-300 bg-white'
                                                }`}
                                                onDragOver={(e) => handleDragOver(e, chapter.id)}
                                                onDrop={(e) => handleDrop(e, chapter.id)}
                                            >
                                                {/* Chapter Header */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="font-semibold text-gray-900">
                                                            Chapter {chapterIndex + 1}: {chapter.name}
                                                        </h4>
                                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                            {chapter.lectures.length} lectures
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => editChapterName(chapter.id)}
                                                            className="text-gray-400 hover:text-blue-600"
                                                        >
                                                            <EditRounded style={{ fontSize: '18px' }} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteChapter(chapter.id)}
                                                            className="text-gray-400 hover:text-red-600"
                                                        >
                                                            <DeleteRounded style={{ fontSize: '18px' }} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Drop Zone */}
                                                {chapter.lectures.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <ArrowDownwardRounded className="mx-auto mb-2 text-2xl" />
                                                        <p className="text-sm">Drop videos here to create lectures</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {chapter.lectures.map((lecture, lectureIndex) => (
                                                            <div
                                                                key={lecture.id}
                                                                className="bg-gray-50 border border-gray-200 rounded p-3"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <img
                                                                        src={lecture.video.thumbnail}
                                                                        alt={lecture.name}
                                                                        className="w-12 h-9 object-cover rounded flex-shrink-0"
                                                                    />
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                <h5 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                                                    Lecture {lectureIndex + 1}: {lecture.name}
                                                                                </h5>
                                                                                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                                                                                    <span className="flex items-center">
                                                                                        <AccessTimeRounded style={{ fontSize: '10px' }} className="mr-1" />
                                                                                        {formatDuration(lecture.video.duration)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex space-x-1 ml-2">
                                                                                <button
                                                                                    onClick={() => editLectureName(chapter.id, lectureIndex)}
                                                                                    className="text-gray-400 hover:text-blue-600"
                                                                                >
                                                                                    <EditRounded style={{ fontSize: '14px' }} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => removeLectureFromChapter(chapter.id, lectureIndex)}
                                                                                    className="text-gray-400 hover:text-red-600"
                                                                                >
                                                                                    <DeleteRounded style={{ fontSize: '14px' }} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {videos.length > 0 && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                {chapters.length} chapters • {totalLectures} lectures ready to import
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImportLectures}
                                    disabled={importing || totalLectures === 0}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {importing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Importing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <SaveRounded />
                                            <span>Import {totalLectures} Lectures</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistChapterOrganizer;

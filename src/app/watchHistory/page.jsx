// pages/videos.js
'use client';

import { useState, useEffect } from "react";
import TopBar from "../component/TopBar";
import SideBar from "../component/SideBar";
import Footer from "../component/Footer";
import axios from "axios";
import Link from "next/link";
import { 
  PlayArrowRounded,
  AccessTimeRounded,
  VideoLibraryRounded,
  PersonRounded,
  TrendingUpRounded,
  DeleteRounded,
  HistoryRounded
} from '@mui/icons-material';

export default function WatchHistory() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const response = await axios.get('/api/watch-history');
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, []);

  const formatProgress = (percentage) => {
    return Math.round(percentage);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently watched';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Just now (within 2 minutes)
    if (diffMinutes < 2) return 'Just now';
    
    // Minutes ago (2-59 minutes)
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    
    // Hours ago (1-23 hours)
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    
    // Check if it's today, yesterday, or older
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset time to start of day for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.ceil(diffDays / 7)} weeks ago`;
    } else {
      // Show actual date for older entries
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const WatchHistoryCard = ({ video, index }) => {
    const progress = formatProgress(video.progress_percentage || 0);
    
    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
      if (!url) return null;
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7].length === 11) ? match[7] : null;
    };

    // Generate YouTube thumbnail URL
    const getYouTubeThumbnail = (url, quality = 'hqdefault') => {
      const videoId = getYouTubeVideoId(url);
      if (!videoId) return null;
      return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    };

    const thumbnailUrl = getYouTubeThumbnail(video.youtube_url);
    
    return (
      <Link 
        href={`/course_page/${video.course_instance_id}?chapter=${video.chapter_number}&lecture=${video.lecture_number}`}
        className="group block"
      >
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:border-primary-200 hover:-translate-y-1">
          <div className="flex flex-col sm:flex-row">
            {/* Video Thumbnail */}
            <div className="relative sm:w-80 sm:flex-shrink-0">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                {thumbnailUrl ? (
                  <img 
                    src={thumbnailUrl}
                    alt={video.lecture_title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if thumbnail fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback icon */}
                <div className={`absolute inset-0 flex items-center justify-center ${thumbnailUrl ? 'hidden' : 'flex'}`}>
                  <VideoLibraryRounded className="text-4xl text-gray-400" />
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <PlayArrowRounded className="text-2xl text-primary-700 ml-1" />
                  </div>
                </div>
                
                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                    <div 
                      className="h-full bg-primary-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                
                {/* Progress Badge */}
                {progress > 0 && (
                  <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <TrendingUpRounded className="text-xs" />
                    <span>{progress}%</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-primary-700 transition-colors">
                    {video.lecture_title}
                  </h3>
                  
                  <div className="space-y-2">
                    {/* Course Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <VideoLibraryRounded className="text-base" />
                      <span className="font-medium">{video.course_name}</span>
                    </div>
                    
                    {/* Instructor Info */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <PersonRounded className="text-base" />
                      <span>{video.teacher_name}</span>
                    </div>
                    
                    {/* Watch Time */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <HistoryRounded className="text-base" />
                      <span>{formatDate(video.last_watched)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress Section */}
              {progress > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{progress}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Continue Watching Button */}
              <div className="mt-6">
                <div className="inline-flex items-center text-sm font-medium text-primary-700 group-hover:text-primary-800 transition-colors">
                  <PlayArrowRounded className="mr-1" />
                  {progress > 0 ? 'Continue Watching' : 'Start Watching'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar />
      
      <div className="flex flex-1">
        <SideBar />
        
        <main className="flex-1 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <HistoryRounded className="text-primary-600" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Watch History</h1>
              </div>
              <p className="text-gray-600">Continue where you left off or revisit your favorite lectures</p>
            </div>
            
            {loading ? (
              /* Loading State */
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-80 sm:flex-shrink-0">
                        <div className="aspect-video bg-gray-200"></div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              /* Results */
              <div className="space-y-6">
                {results.map((result, index) => (
                  <WatchHistoryCard key={index} video={result} index={index} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HistoryRounded className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Watch History Yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start watching courses and lectures to build your learning journey. Your progress will be saved here for easy access.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                  >
                    <VideoLibraryRounded className="mr-2" />
                    Browse Courses
                  </Link>
                  <Link 
                    href="/browse"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-all duration-200"
                  >
                    Search Content
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

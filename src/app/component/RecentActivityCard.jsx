import React from 'react';
import Link from 'next/link';
import { 
  PlayArrowRounded, 
  AccessTimeRounded, 
  VideoLibraryRounded,
  TrendingUpRounded,
  PersonRounded 
} from '@mui/icons-material';

const RecentActivityCard = ({ activity }) => {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnail = (url, quality = 'mqdefault') => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
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
    } else {
      // Show actual date for older entries
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrentTime = (seconds) => {
    if (!seconds) return '0:00';
    return formatDuration(seconds);
  };

  const thumbnailUrl = getYouTubeThumbnail(activity.youtube_url);

  return (
    <Link 
      href={`/course_page/${activity.course_instance_id}?chapter=${activity.chapter_number}&lecture=${activity.lecture_number}`}
      className="group block"
    >
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:border-primary-200">
        <div className="flex items-center p-4">
          {/* Thumbnail */}
          <div className="relative w-20 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl}
                alt={activity.lecture_title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to icon if thumbnail fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            
            {/* Fallback icon (always present but hidden if image loads) */}
            <div className={`absolute inset-0 flex items-center justify-center ${thumbnailUrl ? 'hidden' : 'flex'}`}>
              <VideoLibraryRounded className="text-primary-600 text-lg" />
            </div>
            
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded-lg">
              <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-200">
                <PlayArrowRounded className="text-xs text-primary-700 ml-0.5" />
              </div>
            </div>
            
            {/* Progress bar */}
            {activity.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 rounded-b-lg">
                <div 
                  className="h-full bg-primary-600 rounded-b-lg transition-all duration-300"
                  style={{ width: `${Math.min(activity.progress, 100)}%` }}
                />
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 ml-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-700 transition-colors">
                  {activity.lecture_title}
                </h4>
                
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <VideoLibraryRounded className="w-3 h-3 mr-1" />
                    {activity.course_name}
                  </span>
                  
                  <span className="flex items-center">
                    <PersonRounded className="w-3 h-3 mr-1" />
                    {activity.teacher_name}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <AccessTimeRounded className="w-3 h-3 mr-1" />
                      {formatDate(activity.last_watched)}
                    </span>
                    
                    {activity.progress > 0 && (
                      <span className="flex items-center">
                        <TrendingUpRounded className="w-3 h-3 mr-1" />
                        {activity.progress}% complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecentActivityCard;

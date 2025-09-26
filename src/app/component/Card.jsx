import React from 'react';
import Link from 'next/link';
import { PlayArrowRounded, PersonOutline, AccessTimeRounded, SchoolRounded } from '@mui/icons-material';

const Card = ({ 
  title, 
  author, 
  course_id, 
  duration, 
  progress, 
  enrolledCount,
  lastAccessed
}) => {
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatLastAccessed = (date) => {
    if (!date) return null;
    const now = new Date();
    const accessed = new Date(date);
    const diffDays = Math.floor((now - accessed) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return accessed.toLocaleDateString();
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-success-100 text-success-800';
      case 'intermediate':
        return 'bg-warning-100 text-warning-800';
      case 'advanced':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/course-overview/${course_id}`} className="block">
      <div className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
      {/* Course Graphic */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          {/* Geometric background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-400 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-5"></div>
          </div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="border-r border-b border-white border-opacity-20"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Modern course illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            {/* Main icon with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20 scale-150"></div>
              <div className="relative w-16 h-16 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm border border-white border-opacity-30 flex items-center justify-center">
                <SchoolRounded className="text-3xl text-white" />
              </div>
            </div>
            
            {/* Course elements visualization */}
            <div className="space-y-2">
              {/* Video/lesson bars */}
              <div className="flex space-x-1 justify-center">
                {[3, 5, 2, 4, 3].map((height, i) => (
                  <div 
                    key={i}
                    className="w-1 bg-white bg-opacity-40 rounded-full animate-pulse"
                    style={{ 
                      height: `${height * 3}px`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Progress indicators */}
              <div className="flex space-x-1 justify-center">
                <div className="w-8 h-0.5 bg-accent-400 rounded-full opacity-80"></div>
                <div className="w-6 h-0.5 bg-white bg-opacity-30 rounded-full"></div>
                <div className="w-4 h-0.5 bg-white bg-opacity-20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20">
            <div 
              className="h-full bg-accent-500 transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}

        {/* Duration badge */}
        {duration && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-60 text-white rounded-full flex items-center space-x-1 backdrop-blur-sm">
              <AccessTimeRounded className="text-xs" />
              <span>{formatDuration(duration)}</span>
            </span>
          </div>
        )}

        {/* Play overlay */}
        {/* Removed - entire card is now clickable */}
      </div>

      {/* Course Info - Mobile responsive padding */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-2 sm:space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-primary-800 transition-colors duration-200 leading-tight">
          {title}
        </h3>

        {/* Author */}
        {author && (
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <PersonOutline className="text-sm sm:text-base" />
            <span className="truncate">{author.replace('by ', '')}</span>
          </div>
        )}

        {/* Meta information - Stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm text-gray-500">
          {enrolledCount && (
            <span>{enrolledCount} students</span>
          )}
          {lastAccessed && (
            <span className="truncate">Last viewed {formatLastAccessed(lastAccessed)}</span>
          )}
        </div>

        {/* Progress indicator */}
        {progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-primary-800">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-primary-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer - Mobile responsive */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">
        <div className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 space-x-1 sm:space-x-2 group/btn shadow-sm">
          <PlayArrowRounded className="text-base sm:text-lg" />
          <span className="truncate">{progress > 0 ? 'Continue Learning' : 'Start Course'}</span>
          <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-200 hidden sm:inline">
            →
          </span>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default Card;

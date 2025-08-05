import React from 'react';
import Link from 'next/link';
import { PlayArrowRounded, PersonOutline, AccessTimeRounded } from '@mui/icons-material';

const Card = ({ 
  title, 
  author, 
  course_id, 
  thumbnail, 
  duration, 
  progress, 
  enrolledCount,
  difficulty = 'Beginner',
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
    switch (level.toLowerCase()) {
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
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={`${title} thumbnail`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center ${thumbnail ? 'hidden' : 'flex'}`}>
          <div className="text-center text-white">
            <PlayArrowRounded className="text-4xl mb-2 opacity-80" />
            <p className="text-sm font-medium opacity-90">Course Preview</p>
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

        {/* Difficulty badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>

        {/* Duration badge */}
        {duration && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-xs font-medium bg-black bg-opacity-60 text-white rounded-full flex items-center space-x-1">
              <AccessTimeRounded className="text-xs" />
              <span>{formatDuration(duration)}</span>
            </span>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg">
              <PlayArrowRounded className="text-2xl text-primary-800 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="px-6 py-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-800 transition-colors">
          {title}
        </h3>

        {/* Author */}
        {author && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <PersonOutline className="text-base" />
            <span>{author.replace('by ', '')}</span>
          </div>
        )}

        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          {enrolledCount && (
            <span>{enrolledCount} students</span>
          )}
          {lastAccessed && (
            <span>Last viewed {formatLastAccessed(lastAccessed)}</span>
          )}
        </div>

        {/* Progress indicator */}
        {progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-primary-800">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-gray-50">
        <Link 
          href={`/course_page/${course_id}`}
          className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-800 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200 space-x-2 group/btn"
        >
          <PlayArrowRounded className="text-lg" />
          <span>{progress > 0 ? 'Continue Learning' : 'Start Course'}</span>
          <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-200">
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Card;

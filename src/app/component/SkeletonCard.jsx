import React from 'react'

export default function SkeletonVideoCard() {
    return (
      <div className="flex ml-20 space-x-4 animate-pulse p-4 border border-gray-300 rounded-lg shadow-md w-3/4 sm:w-full max-w-xl">
        {/* Video Thumbnail Placeholder */}
        <div className="bg-gray-200 rounded-lg w-32 h-20"></div>
        
        {/* Title Placeholder */}
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
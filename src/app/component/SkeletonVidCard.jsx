import React from 'react'

export default function SkeletonVidCard() {
    return (
      <div className="space-y-4 p-4 border -z-10 border-gray-300 rounded-md shadow-md w-9/12 sm:w-full max-w-sm animate-pulse">
        {/* Image Placeholder */}
        <div className="bg-gray-200 -z-10 rounded-md h-32 w-full"></div>
        
        {/* Text Placeholder */}
        <div className="h-4 bg-gray-200 -z-10 rounded w-3/4"></div>
      </div>
    );
  }
  
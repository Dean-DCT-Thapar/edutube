import React from 'react'

// components/SkeletonCourseCard.js
export default function SkeletonCourseCard() {
    return (
      <div className="p-4 border border-gray-300 rounded-lg shadow-md w-9/12 -z-10 sm:w-full max-w-sm space-y-4 animate-pulse">
        {/* Image Placeholder */}
        <div className="bg-gray-200 rounded-md h-40 -z-10 w-full"></div>
        
        {/* Title Placeholder */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Content Line Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        
        {/* Link Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }
  
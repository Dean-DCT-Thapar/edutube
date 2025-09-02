import React from 'react';

const LoadingCard = ({ variant = 'course' }) => {
  if (variant === 'video') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg animate-pulse">
        <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
        <div className="px-6 py-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg animate-pulse">
      <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
      <div className="px-6 py-4 space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Author */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        
        {/* Meta */}
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
};

const LoadingGrid = ({ count = 4, variant = 'course' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <LoadingCard key={i} variant={variant} />
      ))}
    </div>
  );
};

const LoadingList = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
        </div>
      ))}
    </div>
  );
};

export { LoadingCard, LoadingGrid, LoadingList };
export default LoadingCard;

import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      {/* Content area */}
      <div className="p-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3"></div>
        
        {/* Restaurant name */}
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-4"></div>
        
        {/* Price row */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
        </div>
        
        {/* Rating and pickup time */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
        </div>
        
        {/* Distance */}
        <div className="h-4 bg-gray-200 rounded-md w-1/4 mt-2"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
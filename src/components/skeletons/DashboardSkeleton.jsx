import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
      
      {/* Header Skeleton */}
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-xl"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm animate-pulse">
            <div className="h-8 w-8 bg-gray-100 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
        <div className="space-y-8">
            <div className="h-48 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
            <div className="h-48 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse p-4 md:p-0">
      
      {/* 1. Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="h-12 w-full md:w-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>

      {/* 2. Insight Banner Skeleton */}
      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-[1.5rem] w-full border border-gray-100 dark:border-gray-700/50"></div>

      {/* 3. Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Large Hero Card Skeleton */}
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-[2rem]"></div>
        {/* Smaller Stat Cards */}
        {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50"></div>
        ))}
      </div>

      {/* 4. Main Bento Grid Skeleton (Matches Dashboard Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Habits) */}
        <div className="lg:col-span-5 h-[500px] bg-gray-200 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50"></div>
        
        {/* Right Column (Tasks & Spending) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="h-[300px] bg-gray-200 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50"></div>
            <div className="flex-1 min-h-[180px] bg-gray-200 dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700/50"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
import React from 'react';

const HealthSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-2"></div>
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calorie Goal Circle Skeleton */}
          <div className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-800 flex items-center justify-center relative">
              <div className="flex flex-col items-center">
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
            </div>
            <div className="mt-8 flex justify-between w-full gap-4">
              <div className="h-12 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              <div className="h-12 flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 gap-6">
            {/* Steps Skeleton */}
            <div className="glass-panel p-6">
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-6"></div>
              <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>

            {/* Workout / Weight Input Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-panel p-6">
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              </div>
              <div className="glass-panel p-6">
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="glass-panel p-6 min-h-[400px]">
           <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-full mb-8"></div>
           <div className="flex items-end gap-2 h-64 w-full">
              {[...Array(30)].map((_, i) => (
                <div key={i} className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default HealthSkeleton;

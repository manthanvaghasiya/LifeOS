import React from 'react';

const AssetSkeleton = () => {
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

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-panel p-6 h-48 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                 </div>
                 <div>
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full mb-2"></div>
                    <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </div>
  );
};

export default AssetSkeleton;

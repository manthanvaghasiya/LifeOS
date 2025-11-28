import React from 'react';
import Skeleton from '../ui/Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* 1. Header Area */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
            <Skeleton className="h-8 w-48" /> {/* Title */}
            <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-32" /> {/* Button */}
      </div>

      {/* 2. Summary Cards (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart (2/3) */}
        <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full" />
        </div>
        {/* Side Chart (1/3) */}
        <div className="lg:col-span-1">
            <Skeleton className="h-[400px] w-full" />
        </div>
      </div>

      {/* 4. Transactions List */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" /> {/* Header */}
        <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>
      </div>

    </div>
  );
};

export default DashboardSkeleton;
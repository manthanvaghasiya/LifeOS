import React from 'react';
import Skeleton from '../ui/Skeleton';

const HabitsSkeleton = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-96" /> {/* Form Input */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2"><Skeleton className="h-64 w-full" /></div>
        <div><Skeleton className="h-64 w-full" /></div>
      </div>

      {/* Grid */}
      <Skeleton className="h-96 w-full" />

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
};

export default HabitsSkeleton;

import React from 'react';

const OfferCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row items-center gap-5">
      
      {/* Icon Area */}
      <div className="w-16 h-16 bg-slate-200 rounded-2xl shrink-0 animate-pulse"></div>
      
      {/* Content Area */}
      <div className="flex-1 w-full space-y-3">
        <div className="flex gap-2">
            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-slate-200 rounded w-full animate-pulse"></div>
        
        {/* Progress Bar Skeleton */}
        <div className="w-48 pt-2">
            <div className="flex justify-between mb-1">
                <div className="h-2 w-12 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-2 w-8 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Button Area */}
      <div className="hidden sm:flex flex-col items-end gap-2">
         <div className="h-6 w-16 bg-slate-200 rounded animate-pulse"></div>
         <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default OfferCardSkeleton;

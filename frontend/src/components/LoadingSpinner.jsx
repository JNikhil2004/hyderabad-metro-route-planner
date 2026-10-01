import React from 'react';
import { Train } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading metro data...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizes[size]} border-3 border-slate-700 border-t-red-500 rounded-full animate-spin`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Train className="w-3.5 h-3.5 text-red-500 animate-pulse" />
        </div>
      </div>
      {text && (
        <p className="mt-3 text-xs font-semibold text-slate-400 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

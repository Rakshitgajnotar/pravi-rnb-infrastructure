import React from 'react';

export default function LoadingSpinner({ text = 'Loading data...', size = 'md' }) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-brand-500 border-t-transparent animate-spin`}
      />
      {text && <p className="mt-3 text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
}

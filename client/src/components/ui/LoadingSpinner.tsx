import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text,
}) => {
  const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`animate-spin rounded-full border-steel-200 border-t-brand-blue ${sizeMap[size]}`}
      />
      {text && <p className="text-xs font-medium text-steel-500 animate-pulse">{text}</p>}
    </div>
  );
};

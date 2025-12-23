import React from 'react';

export function useLoadingSpinner(): React.JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black/70">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-800 rounded-full animate-spin" />
        <p className="text-purple-200 text-sm tracking-widest">
          Loading...
        </p>
      </div>
    </div>
  );
}

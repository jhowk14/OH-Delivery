import React from 'react';

export default function Loading() {
  return (
    <div role="status" className="flex items-center top-1/2 justify-center">
      <div className="w-16 h-16 text-blue-600">
        <svg
          aria-hidden="true"
          className="w-full h-full animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <circle 
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      </div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}

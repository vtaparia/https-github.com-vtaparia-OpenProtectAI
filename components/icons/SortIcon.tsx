import React from 'react';

interface SortIconProps {
  direction: 'asc' | 'desc';
}

export const SortIcon: React.FC<SortIconProps> = ({ direction }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-gray-400 transition-transform duration-200"
    viewBox="0 0 20 20"
    fill="currentColor"
    style={{ transform: direction === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)' }}
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"
      clipRule="evenodd"
    />
     <path
      fillRule="evenodd"
      d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z"
      clipRule="evenodd"
      className={direction === 'asc' ? 'opacity-30' : 'opacity-100'}
    />
  </svg>
);

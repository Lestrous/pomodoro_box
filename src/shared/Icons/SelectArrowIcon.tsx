import React from 'react';

interface SelectArrowIconProps {
  className?: string;
}

export function SelectArrowIcon({ className = '' }: SelectArrowIconProps) {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M15 1L8 8L1 1" stroke="#B7280F" strokeWidth="2" />
    </svg>
  );
}

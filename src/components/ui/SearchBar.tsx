'use client';

import React from 'react';
import { cn } from '@/lib/cn';

type SearchBarVariant = 'default' | 'minimal';

interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  variant?: SearchBarVariant;
}

/** 작고 미니멀한 검색 아이콘 SVG */
function DefaultSearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      placeholder = '검색...',
      leftIcon,
      rightIcon,
      onRightIconClick,
      variant = 'default',
      disabled,
      ...props
    },
    ref
  ) => (
    <div
      className={cn(
        'flex items-center gap-2 transition-all duration-200',
        // 8pt 시스템: 높이 40px (md)
        variant === 'default' &&
          'bg-paper border border-border-soft rounded-xl h-10 px-3.5',
        variant === 'minimal' &&
          'bg-transparent border-b border-border-soft h-10 px-0',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span className="text-ink-soft/60 flex-shrink-0">
        {leftIcon ?? <DefaultSearchIcon />}
      </span>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'flex-1 bg-transparent text-[15px] text-ink',
          'placeholder:text-ink-soft/50',
          'outline-none focus:placeholder:text-ink-soft/30 transition-colors',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="flex-shrink-0 text-ink-soft/60 hover:text-ink transition-colors -mr-1 p-1"
        >
          {rightIcon}
        </button>
      )}
    </div>
  )
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
export type { SearchBarProps };

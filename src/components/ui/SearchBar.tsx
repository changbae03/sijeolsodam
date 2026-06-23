'use client';

import React from 'react';
import { cn } from '@/lib/cn';

interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 좌측 아이콘 */
  leftIcon?: React.ReactNode;
  /** 우측 아이콘/버튼 */
  rightIcon?: React.ReactNode;
  /** 우측 액션 핸들러 */
  onRightIconClick?: () => void;
  /** 컨테이너 스타일 변형 */
  variant?: 'default' | 'minimal';
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      placeholder = '검색...',
      leftIcon = '🔍',
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
        'flex items-center gap-2.5 transition-all duration-200',
        variant === 'default'
          ? 'bg-paper border border-border-soft rounded-xl px-3.5 py-2.5'
          : 'bg-transparent border-b border-border-soft px-0 py-2',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {leftIcon && <span className="text-ink-soft/60 flex-shrink-0">{leftIcon}</span>}
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'flex-1 bg-transparent text-[14px] placeholder:text-ink-soft/50',
          'outline-none focus:placeholder:text-ink-soft/30 transition-colors',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="flex-shrink-0 text-ink-soft/60 hover:text-ink transition-colors p-1 -mr-1"
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

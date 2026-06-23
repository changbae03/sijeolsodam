import React from 'react';
import { cn } from '@/lib/cn';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 방향 */
  orientation?: 'horizontal' | 'vertical';
  /** 색상 강도 */
  variant?: 'soft' | 'light';
  /** 위아래 여백 (horizontal일 때만) */
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
}

const spacingStyles = {
  xs: 'my-1.5',
  sm: 'my-2.5',
  md: 'my-4',
  lg: 'my-6',
};

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = 'horizontal',
      variant = 'soft',
      spacing = 'md',
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        orientation === 'horizontal'
          ? cn(
              'w-full h-px',
              variant === 'soft' ? 'bg-border-soft' : 'bg-border-soft/40',
              spacingStyles[spacing]
            )
          : 'w-px h-full bg-border-soft',
        className
      )}
      {...props}
    />
  )
);

Divider.displayName = 'Divider';

export { Divider };
export type { DividerProps };

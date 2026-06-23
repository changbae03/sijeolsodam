import React from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 배지 스타일 */
  variant?: 'sage' | 'terracotta' | 'cream' | 'ink';
  /** 크기 */
  size?: 'sm' | 'md';
  /** 아이콘 또는 이모지 */
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const badgeStyles = {
  sage: 'bg-sage/10 text-sage border border-sage/20',
  terracotta: 'bg-terracotta/10 text-terracotta border border-terracotta/20',
  cream: 'bg-cream text-ink-soft border border-border-soft',
  ink: 'bg-ink text-white border border-ink-soft/30',
};

const sizeStyles = {
  sm: 'px-2.5 py-1 text-[11px] font-medium rounded-md',
  md: 'px-3 py-1.5 text-[12px] font-medium rounded-lg',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'sage', size = 'md', icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap transition-colors',
        badgeStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };

import React from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'sage' | 'terracotta' | 'cream' | 'ink' | 'paper';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  sage: 'bg-sage/10 text-sage border border-sage/20',
  terracotta: 'bg-terracotta/10 text-terracotta border border-terracotta/20',
  cream: 'bg-cream-warm text-ink-soft border border-border-soft',
  ink: 'bg-ink text-cream border border-ink/30',
  paper: 'bg-paper/90 text-ink border border-border-soft backdrop-blur-sm',
};

// 8pt 시스템: padding y는 4/8, x는 8/12
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-1 text-[12px] rounded-md', // 8x4 padding
  md: 'px-3 py-1.5 text-[13px] rounded-lg', // 12x6 padding
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'sage', size = 'md', icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap font-medium',
        'transition-colors duration-200',
        variantStyles[variant],
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

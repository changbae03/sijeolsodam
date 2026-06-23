import React from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-terracotta text-paper hover:bg-terracotta-light active:bg-terracotta',
  secondary:
    'bg-sage text-paper hover:bg-sage-light active:bg-sage',
  tertiary:
    'bg-paper text-ink border border-border-soft hover:bg-cream-warm active:bg-cream',
  ghost:
    'text-ink hover:bg-cream-warm active:bg-cream',
};

// 8pt 시스템: 높이는 32/40/48 (8의 배수), 패딩도 8/16/24
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]', // 32px height
  md: 'h-10 px-4 text-[14px]', // 40px height
  lg: 'h-12 px-6 text-[15px]', // 48px height
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        // Base
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'transition-all duration-200 ease-out',
        // State
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none',
        // Variants
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };

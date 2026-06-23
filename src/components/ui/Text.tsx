import React from 'react';
import { cn } from '@/lib/cn';

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 텍스트 타입 */
  variant?: 'body' | 'caption' | 'label' | 'hint';
  /** 색상 */
  color?: 'default' | 'soft' | 'lighter' | 'accent';
  /** 굵기 */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** 자식 요소 */
  children: React.ReactNode;
}

const variantStyles = {
  body: 'text-[14px] leading-relaxed',
  caption: 'text-[13px] leading-relaxed',
  label: 'text-[12px] font-medium leading-tight',
  hint: 'text-[11px] leading-tight',
};

const colorStyles = {
  default: 'text-ink',
  soft: 'text-ink-soft',
  lighter: 'text-ink-soft/60',
  accent: 'text-terracotta',
};

const weightStyles = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      className,
      variant = 'body',
      color = 'default',
      weight = 'normal',
      children,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weightStyles[weight],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);

Text.displayName = 'Text';

export { Text };
export type { TextProps };

import React from 'react';
import { cn } from '@/lib/cn';

type CardVariant = 'paper' | 'cream' | 'ink';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 배경 */
  variant?: CardVariant;
  /** 내부 패딩 (8pt 시스템) */
  padding?: CardPadding;
  /** 호버 상호작용 */
  interactive?: boolean;
  /** 보더 표시 */
  bordered?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  paper: 'bg-paper text-ink',
  cream: 'bg-cream-warm text-ink',
  ink: 'bg-ink text-cream',
};

// 8pt 시스템 — padding 옵션
const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3', // 12px
  md: 'p-4', // 16px
  lg: 'p-6', // 24px
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'paper',
      padding = 'md',
      interactive = false,
      bordered = true,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        // 기본
        'rounded-[16px] transition-all duration-200 ease-out',
        // 변형
        variantStyles[variant],
        paddingStyles[padding],
        // 보더 (ink 변형은 보더 없음)
        bordered && variant !== 'ink' && 'border border-border-soft',
        // 인터랙티브
        interactive && 'cursor-pointer hover:shadow-sm active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export { Card };
export type { CardProps };

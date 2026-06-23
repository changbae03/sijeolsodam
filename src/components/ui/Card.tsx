import React from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 배경 - paper(흰색) 또는 cream(베이지) */
  variant?: 'paper' | 'cream';
  /** 호버 상호작용 활성화 */
  interactive?: boolean;
  /** 보더 표시 */
  bordered?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'paper', interactive = false, bordered = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[18px] transition-all duration-200',
        variant === 'paper' ? 'bg-paper' : 'bg-cream-warm',
        bordered && 'border border-border-soft',
        interactive && 'hover:shadow-sm hover:border-sage-light cursor-pointer',
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

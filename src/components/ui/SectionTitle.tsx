import React from 'react';
import { cn } from '@/lib/cn';

interface SectionTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 제목 */
  title: React.ReactNode;
  /** 부제목 (선택사항) */
  subtitle?: React.ReactNode;
  /** 우측 액션 영역 (보기 더보기 버튼 등) */
  action?: React.ReactNode;
  /** 제목 크기 */
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    title: 'text-[15px] font-semibold',
    subtitle: 'text-[12px]',
  },
  md: {
    title: 'text-[17px] font-semibold',
    subtitle: 'text-[13px]',
  },
  lg: {
    title: 'font-display text-[22px] font-medium tracking-tight',
    subtitle: 'text-[14px]',
  },
};

const SectionTitle = React.forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, subtitle, action, size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-3', className)}
      {...props}
    >
      <div className="flex-1">
        <h2 className={cn('text-ink', sizeStyles[size].title)}>{title}</h2>
        {subtitle && (
          <p className={cn('text-ink-soft/70 mt-1', sizeStyles[size].subtitle)}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
);

SectionTitle.displayName = 'SectionTitle';

export { SectionTitle };
export type { SectionTitleProps };

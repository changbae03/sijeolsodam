import React from 'react';
import { cn } from '@/lib/cn';
import { Overline } from './Overline';

interface SectionTitleProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** 메인 한글 제목 */
  title: React.ReactNode;
  /** 영문 우버라인 (잡지 톤) */
  overline?: React.ReactNode;
  /** 부제목 */
  subtitle?: React.ReactNode;
  /** 우측 액션 */
  action?: React.ReactNode;
  /** 제목 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 우버라인에 디바이더 라인 표시 */
  withDivider?: boolean;
  /** 우버라인 색상 */
  overlineColor?: 'sage' | 'terracotta' | 'ink' | 'soft';
}

const titleStyles = {
  sm: 'text-[17px] font-display font-medium tracking-tight',
  md: 'text-[22px] font-display font-medium tracking-tight',
  lg: 'text-[28px] font-display font-medium tracking-tight leading-tight',
};

const subtitleStyles = {
  sm: 'text-[12px]',
  md: 'text-[13px]',
  lg: 'text-[14px]',
};

const SectionTitle = React.forwardRef<HTMLElement, SectionTitleProps>(
  (
    {
      className,
      title,
      overline,
      subtitle,
      action,
      size = 'md',
      withDivider = false,
      overlineColor = 'sage',
      ...props
    },
    ref
  ) => (
    <header
      ref={ref}
      className={cn('flex items-start justify-between gap-4', className)}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {overline && (
          <Overline color={overlineColor} withDivider={withDivider} className="mb-2">
            {overline}
          </Overline>
        )}
        <h2 className={cn('text-ink', titleStyles[size])}>{title}</h2>
        {subtitle && (
          <p className={cn('text-ink-soft mt-2 leading-relaxed', subtitleStyles[size])}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  )
);

SectionTitle.displayName = 'SectionTitle';

export { SectionTitle };
export type { SectionTitleProps };

import React from 'react';
import { cn } from '@/lib/cn';

interface OverlineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 잡지 스타일 영문 우버라인 (예: "In Season Today") */
  children: React.ReactNode;
  /** 색상 변형 */
  color?: 'sage' | 'terracotta' | 'ink' | 'soft';
  /** 좌측 디바이더 라인 표시 (잡지 섹션 헤더 스타일) */
  withDivider?: boolean;
}

const colorStyles = {
  sage: 'text-sage',
  terracotta: 'text-terracotta',
  ink: 'text-ink',
  soft: 'text-ink-soft/70',
};

const dividerColorStyles = {
  sage: 'bg-sage',
  terracotta: 'bg-terracotta',
  ink: 'bg-ink',
  soft: 'bg-ink-soft/30',
};

/**
 * 잡지 스타일 우버라인 (Section Eyebrow)
 * 모든 우버라인 라벨에 일관된 트래킹, 크기, 굵기를 적용합니다.
 */
const Overline = React.forwardRef<HTMLDivElement, OverlineProps>(
  ({ className, color = 'sage', withDivider = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-baseline gap-3', className)}
      {...props}
    >
      {withDivider && (
        <span className={cn('h-px w-8', dividerColorStyles[color])} />
      )}
      <p
        className={cn(
          'text-[12px] tracking-[0.2em] uppercase font-semibold',
          colorStyles[color]
        )}
      >
        {children}
      </p>
    </div>
  )
);

Overline.displayName = 'Overline';

export { Overline };
export type { OverlineProps };

'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** 활성 상태 (수동 제어) */
  active?: boolean;
  onClick?: () => void;
  badge?: React.ReactNode;
  /** Link로 감싸진 컨테이너로 렌더링 */
  href?: string;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
  /** 현재 활성 항목 ID */
  activeId?: string;
  onSelectItem?: (id: string) => void;
  /** 추가 className */
  className?: string;
}

const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  ({ items, activeId, onSelectItem, className }, ref) => (
    <nav
      ref={ref}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-paper/95 backdrop-blur-xl border-t border-border-soft',
        className
      )}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const isActive = activeId === item.id || item.active;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  onSelectItem?.(item.id);
                }}
                className={cn(
                  // 8pt 시스템: padding 8/16
                  'flex flex-col items-center justify-center gap-1 flex-1',
                  'py-2.5 px-2 transition-colors duration-200',
                  isActive
                    ? 'text-sage'
                    : 'text-ink-soft/60 hover:text-ink-soft active:text-ink'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-[18px] flex items-center justify-center relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-bold text-paper bg-terracotta rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium tracking-tight leading-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* iPhone safe-area inset */}
        <div className="h-[env(safe-area-inset-bottom)] min-h-1" />
      </div>
    </nav>
  )
);

BottomNavigation.displayName = 'BottomNavigation';

export { BottomNavigation };
export type { BottomNavigationProps };

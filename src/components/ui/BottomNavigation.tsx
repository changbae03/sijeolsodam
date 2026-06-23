'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface BottomNavItem {
  /** 고유 ID */
  id: string;
  /** 라벨 */
  label: string;
  /** 아이콘 (이모지 또는 SVG) */
  icon: React.ReactNode;
  /** 활성 여부 */
  active?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 배지 (알림 수 등) */
  badge?: React.ReactNode;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
  /** 활성 항목 ID */
  activeId?: string;
  /** 항목 선택 핸들러 */
  onSelectItem?: (id: string) => void;
}

const BottomNavigation = React.forwardRef<HTMLDivElement, BottomNavigationProps>(
  ({ items, activeId, onSelectItem }, ref) => (
    <div
      ref={ref}
      className="fixed bottom-0 left-0 right-0 z-40 bg-paper border-t border-border-soft"
    >
      <div className="max-w-md mx-auto px-0 py-0">
        <nav className="flex items-center justify-around">
          {items.map((item) => {
            const isActive = activeId === item.id || item.active;
            return (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick?.();
                  onSelectItem?.(item.id);
                }}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 py-3 px-2',
                  'transition-colors duration-200 relative',
                  isActive ? 'text-sage' : 'text-ink-soft/60 hover:text-ink-soft/80'
                )}
              >
                <span className="text-[20px] flex items-center justify-center relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 text-[10px] font-bold text-white bg-terracotta rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium text-center leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  )
);

BottomNavigation.displayName = 'BottomNavigation';

export { BottomNavigation };
export type { BottomNavigationProps };

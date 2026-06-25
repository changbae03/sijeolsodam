'use client';

import { motion } from 'motion/react';
import { monthsData } from '@/data/months';

interface MonthStripProps {
  selectedMonth: number;
  onSelectMonth: (month: number) => void;
}

/**
 * 월 선택 — 가로 한 줄 스와이프 셀렉터 (예: 6월 | 7월 | 8월).
 * 세로 공간을 많이 차지하던 6x2 그리드 대신, 가로로 스크롤하는 컴팩트한 한 줄.
 */
export default function MonthStrip({ selectedMonth, onSelectMonth }: MonthStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 snap-x scroll-px-5">
      {monthsData.map((m) => {
        const isActive = m.month === selectedMonth;
        return (
          <motion.button
            key={m.month}
            onClick={() => onSelectMonth(m.month)}
            whileTap={{ scale: 0.94 }}
            className="relative flex-shrink-0 snap-start px-4 py-2 rounded-full"
          >
            {isActive && (
              <motion.div
                layoutId="month-pill"
                className="absolute inset-0 bg-ink rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 text-[13.5px] font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-cream' : 'text-ink-soft'
              }`}
            >
              {m.month}월
            </span>
            {!isActive && (
              <span className="absolute inset-0 rounded-full bg-paper border border-border-soft -z-10" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

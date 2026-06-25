'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { monthsData } from '@/data/months';

interface MonthStripProps {
  selectedMonth: number;
  onSelectMonth: (month: number) => void;
}

// 계절 그룹 경계 — 이 달 앞에 작은 구분선을 넣어 계절을 은은하게 구분 (라벨 없이, 세로 공간 안 씀)
const SEASON_BOUNDARY_MONTHS = new Set([3, 6, 9, 12]); // 봄/여름/가을/겨울 시작월

/**
 * 월 선택 — iOS 피커 느낌의 가로 스와이프 셀렉터.
 * 선택된 달은 더 크게 + 채워진 필 배경으로 강조되고, 양옆 달이 살짝 보이도록
 * 항상 가운데로 자동 스크롤됩니다.
 */
export default function MonthStrip({ selectedMonth, onSelectMonth }: MonthStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // 선택된 달이 바뀌면 항상 가운데로 부드럽게 스크롤 — 양옆 달이 늘 살짝 보이게
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [selectedMonth]);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide -mx-5 px-5 snap-x scroll-px-5 py-1"
    >
      {monthsData.map((m) => {
        const isActive = m.month === selectedMonth;
        const showSeasonDivider = SEASON_BOUNDARY_MONTHS.has(m.month);

        return (
          <div key={m.month} className="flex items-center gap-2.5 flex-shrink-0">
            {showSeasonDivider && <span className="h-4 w-px bg-border-soft flex-shrink-0" />}
            <motion.button
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelectMonth(m.month)}
              whileTap={{ scale: 0.94 }}
              className="relative flex-shrink-0 snap-center flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                paddingInline: isActive ? 18 : 14,
                paddingBlock: isActive ? 10 : 8,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="month-pill"
                  className="absolute inset-0 bg-ink rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'text-[18px] text-cream' : 'text-[13.5px] text-ink-soft/70'
                }`}
              >
                {m.month}월
              </span>
              {!isActive && (
                <span className="absolute inset-0 rounded-full bg-paper border border-border-soft -z-10" />
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

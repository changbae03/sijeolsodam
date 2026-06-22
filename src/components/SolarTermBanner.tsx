'use client';

import { motion, PanInfo } from 'motion/react';
import { MonthData } from '@/data/types';

interface SolarTermBannerProps {
  monthData: MonthData;
  /** 스와이프로 월을 전환할 때 호출 (-1: 이전 달, 1: 다음 달) */
  onSwipeMonth?: (direction: -1 | 1) => void;
}

const SWIPE_THRESHOLD = 60;

/** 24절기 중 이 달에 해당하는 두 절기의 순번 (1~24, 입춘이 1번) */
function getSolarTermIndices(month: number): [number, number] {
  if (month === 1) return [23, 24];
  const second = (month - 1) * 2;
  return [second - 1, second];
}

export default function SolarTermBanner({ monthData, onSwipeMonth }: SolarTermBannerProps) {
  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!onSwipeMonth) return;
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      onSwipeMonth(1); // 왼쪽으로 스와이프 -> 다음 달
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      onSwipeMonth(-1); // 오른쪽으로 스와이프 -> 이전 달
    }
  };

  const [activeStart, activeEnd] = getSolarTermIndices(monthData.month);

  return (
    <motion.div
      drag={onSwipeMonth ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={handleDragEnd}
      className="relative overflow-hidden rounded-3xl bg-ink touch-pan-y px-6 pt-6 pb-5"
    >
      {/* 상단: 절기 라벨 + 계절 태그 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-cream/40" />
          <span className="text-[11px] tracking-[0.08em] text-cream/70">24절기 자연의 흐름</span>
        </div>
        <span className="text-[11px] text-cream/70 bg-cream/10 rounded-full px-2.5 py-1">
          {monthData.season}
        </span>
      </div>

      {/* 시그니처: 거대한 월 숫자 */}
      <div className="flex items-baseline gap-2 mt-4">
        <span className="font-display text-[92px] leading-[0.85] text-cream tracking-tight tabular-nums">
          {String(monthData.month).padStart(2, '0')}
        </span>
        <span className="font-display text-[22px] text-cream/60 pb-1.5">월</span>
      </div>
      <p className="text-[13px] text-terracotta-light tracking-wide mt-1">{monthData.solarTerm}</p>

      {/* 헤드라인 / 설명 */}
      <h1 className="font-display text-[18px] leading-[1.4] text-cream font-medium tracking-tight mt-4">
        {monthData.headline}
      </h1>
      <p className="text-[13px] leading-relaxed text-cream/70 mt-2.5">{monthData.description}</p>

      {/* 24절기 진행 막대: 지금이 1년 중 어디쯔음인지 보여줌 */}
      {onSwipeMonth && (
        <div className="flex items-center gap-[3px] mt-5">
          {Array.from({ length: 24 }, (_, i) => i + 1).map((term) => {
            const isActive = term === activeStart || term === activeEnd;
            return (
              <span
                key={term}
                className={`h-[3px] flex-1 rounded-full transition-colors ${
                  isActive ? 'bg-terracotta-light' : 'bg-cream/15'
                }`}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

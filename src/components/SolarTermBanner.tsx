'use client';

import Image from 'next/image';
import { motion, PanInfo } from 'motion/react';
import { MonthData } from '@/data/types';

interface SolarTermBannerProps {
  monthData: MonthData;
  /** 배경 전면에 선명하게 보여줄 대표 이미지 (해당 월 추천 레시피의 완성샷) */
  backgroundImage?: string;
  /** 스와이프로 월을 전환할 때 호출 (-1: 이전 달, 1: 다음 달) */
  onSwipeMonth?: (direction: -1 | 1) => void;
}

const SWIPE_THRESHOLD = 60;

export default function SolarTermBanner({
  monthData,
  backgroundImage,
  onSwipeMonth,
}: SolarTermBannerProps) {
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

  return (
    <motion.div
      drag={onSwipeMonth ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={handleDragEnd}
      className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-sage touch-pan-y"
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={monthData.headline}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover pointer-events-none"
          priority
        />
      )}
      {/* 하단 그라데이션: 텍스트 가독성 확보 */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent pointer-events-none" />
      {/* 상단 살짝 그라데이션: 절기 태그 가독성 확보 */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/35 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 top-0 px-5 pt-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-cream/60" />
          <span className="text-[12px] tracking-wide text-cream/90 drop-shadow-sm">
            {monthData.solarTerm}
          </span>
        </div>
        <p className="text-[12px] text-cream/80 drop-shadow-sm">
          {monthData.month}월 · {monthData.season}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pointer-events-none">
        <h1 className="font-display text-[26px] leading-[1.35] text-cream font-semibold tracking-tight drop-shadow-sm">
          {monthData.headline}
        </h1>
        <p className="text-[13.5px] leading-relaxed text-cream/90 mt-3 drop-shadow-sm">
          {monthData.description}
        </p>
        {onSwipeMonth && (
          <div className="flex items-center gap-1.5 mt-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <span
                key={m}
                className={`h-1 rounded-full transition-all ${
                  m === monthData.month ? 'w-5 bg-cream' : 'w-1 bg-cream/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

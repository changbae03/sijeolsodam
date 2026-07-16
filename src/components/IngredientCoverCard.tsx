'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { SeasonalIngredient } from '@/data/types';

interface IngredientCoverCardProps {
  ingredient: SeasonalIngredient;
  /** 좌상단 다크 필 배지 (예: '지금 제철', '가격도 착해요') */
  badge?: string;
  /** 이름 아래 한 줄 (기본: 산지 · 설명) */
  metaOverride?: string;
  animationDelay?: number;
}

/**
 * 홈 캐러셀용 3:4 대형 커버 카드.
 * 사진이 카드 전체를 채우고, 하단은 종이색으로 페이드되며 잉크색 타이포가 얹힌다.
 * UI는 무채색으로 눌러서 컬러는 음식 사진이 담당하게 하는 구조.
 */
export default function IngredientCoverCard({
  ingredient,
  badge,
  metaOverride,
  animationDelay = 0,
}: IngredientCoverCardProps) {
  const meta =
    metaOverride ??
    [ingredient.origin, ingredient.description].filter(Boolean).join(' · ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: animationDelay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/ingredient/${encodeURIComponent(ingredient.name)}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-3xl border border-border-soft bg-cream-warm"
      >
        {ingredient.imageUrl && (
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            fill
            sizes="250px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}

        {/* 하단 종이색 페이드 — 사진 위에 잉크 타이포를 얹기 위한 받침 */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(255,253,249,0.96) 0%, rgba(255,253,249,0.62) 22%, transparent 46%)',
          }}
        />

        {badge && (
          <span className="absolute top-3.5 left-3.5 rounded-full bg-ink/[0.82] px-3 py-1.5 text-[11px] font-semibold tracking-[0.04em] text-cream backdrop-blur-sm">
            {badge}
          </span>
        )}

        <div className="absolute bottom-4 left-[18px] right-[18px]">
          <h3 className="text-[22px] font-bold tracking-[-0.02em] text-ink">
            {ingredient.name}
          </h3>
          {meta && (
            <p className="mt-1 line-clamp-1 text-[12.5px] text-ink-soft">{meta}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { findIngredientByName, formatSeasonMonths } from '@/data/months';
import { SeasonalIngredient } from '@/data/types';
import { Badge } from '@/components/ui';
import PriceBadge from './PriceBadge';

interface IngredientFeatureCardProps {
  ingredient: SeasonalIngredient;
  /** 기본 설명 대신 보여줄 문장 (예: 홈의 "지금 만들어보세요" 행동유도 문구) */
  descriptionOverride?: string;
  /** 'line': 카드 하단에 한 줄 문장(저렴할 때만) · 'badge': 제철 배지 옆에 작은 가격 배지 · 'none': 표시 안 함 */
  priceDisplay?: 'line' | 'badge' | 'none';
  /** 등장 애니메이션 지연 (목록에서 순서대로 나타나게) */
  animationDelay?: number;
}

/**
 * 오늘의 제철 / 제철 탭에서 공용으로 쓰는 큰 식재료 카드.
 * 원물 사진 + 아이보리 프레임 + 이름 + 제철 배지 + 한 줄 설명.
 */
export default function IngredientFeatureCard({
  ingredient,
  descriptionOverride,
  priceDisplay = 'none',
  animationDelay = 0,
}: IngredientFeatureCardProps) {
  const found = findIngredientByName(ingredient.name);
  const seasonLabel = found ? formatSeasonMonths(found.months) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: animationDelay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/ingredient/${encodeURIComponent(ingredient.name)}`} className="block group">
        {ingredient.imageUrl && (
          <div className="ingredient-frame rounded-[20px] mb-3">
            <div className="relative w-full aspect-[5/4] rounded-[14px] overflow-hidden shadow-[0_6px_20px_-4px_rgba(44,42,38,0.14)]">
              <Image
                src={ingredient.imageUrl}
                alt={ingredient.name}
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover img-editorial transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        )}
        <div className="px-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="font-display text-[18px] text-ink font-medium tracking-tight">
              {ingredient.emoji} {ingredient.name}
            </h3>
            {seasonLabel && (
              <Badge variant="sage" size="sm">
                제철 {seasonLabel}
              </Badge>
            )}
            {priceDisplay === 'badge' && <PriceBadge name={ingredient.name} variant="badge" />}
          {/* 큰 카드는 최대 3장 정도라 fetch 비용이 작아 항상 시도해도 무방함 */}
          </div>
          <p
            className={
              descriptionOverride
                ? 'text-[12.5px] text-terracotta leading-relaxed line-clamp-1 font-medium'
                : 'text-[12.5px] text-ink-soft leading-relaxed line-clamp-1'
            }
          >
            {descriptionOverride ?? ingredient.description}
          </p>
          {priceDisplay === 'line' && <PriceBadge name={ingredient.name} variant="line" />}
        </div>
      </Link>
    </motion.div>
  );
}

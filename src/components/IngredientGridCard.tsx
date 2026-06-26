'use client';

import Link from 'next/link';
import Image from 'next/image';
import { findIngredientByName, formatSeasonMonths } from '@/data/months';
import { SeasonalIngredient } from '@/data/types';
import { Badge } from '@/components/ui';
import PriceBadge from './PriceBadge';

interface IngredientGridCardProps {
  ingredient: SeasonalIngredient;
  /** KAMIS에 실제로 매핑된 품목일 때만 true — 불필요한 가격 API 호출을 막기 위함 */
  hasPriceData?: boolean;
}

/**
 * 제철 탭의 단일 식재료 그리드에 쓰는 카드.
 * 에디토리얼 이미지 + 이름 + 제철 배지 + 구매 인사이트 배지 + 한 줄 설명.
 */
export default function IngredientGridCard({ ingredient, hasPriceData }: IngredientGridCardProps) {
  const found = findIngredientByName(ingredient.name);
  const seasonLabel = found ? formatSeasonMonths(found.months) : '';

  return (
    <Link href={`/ingredient/${encodeURIComponent(ingredient.name)}`} className="block group">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-cream-warm mb-2">
        {ingredient.imageUrl ? (
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            fill
            sizes="180px"
            className="object-cover img-editorial transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[30px]">
            {ingredient.emoji}
          </div>
        )}
        {hasPriceData && (
          <div className="absolute top-2 left-2">
            <PriceBadge name={ingredient.name} variant="badge" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[12.5px] font-medium text-ink leading-tight">
          {ingredient.emoji} {ingredient.name}
        </span>
        {seasonLabel && (
          <Badge variant="sage" size="sm">
            {seasonLabel} 제철
          </Badge>
        )}
      </div>
      {ingredient.origin && (
        <p className="text-[10.5px] text-ink-soft/60 mt-0.5">{ingredient.origin}</p>
      )}
      <p className="text-[11px] text-ink-soft/70 leading-snug mt-1 line-clamp-1">
        {ingredient.description}
      </p>
    </Link>
  );
}

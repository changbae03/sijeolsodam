'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SeasonalIngredient } from '@/data/types';
import PriceBadge from './PriceBadge';

interface IngredientGridCardProps {
  ingredient: SeasonalIngredient;
  /** KAMIS에 실제로 매핑된 품목일 때만 true — 불필요한 가격 API 호출을 막기 위함 */
  hasPriceData?: boolean;
}

/**
 * 제철 탭의 "전체 식재료" 스크롤 그리드에 쓰는 컴팩트 카드.
 * 원물 사진 + 이름만, 가격 정보가 있을 때만 아주 작은 배지로.
 * 백과사전처럼 느껴지지 않도록 텍스트를 최소화.
 */
export default function IngredientGridCard({ ingredient, hasPriceData }: IngredientGridCardProps) {
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
      <p className="text-[12.5px] font-medium text-ink leading-tight">
        {ingredient.emoji} {ingredient.name}
      </p>
    </Link>
  );
}

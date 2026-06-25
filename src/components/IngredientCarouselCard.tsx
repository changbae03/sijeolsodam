'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { SeasonalIngredient } from '@/data/types';
import { Badge } from '@/components/ui';
import PriceBadge from './PriceBadge';

interface IngredientCarouselCardProps {
  ingredient: SeasonalIngredient;
  hasPriceData?: boolean;
  animationDelay?: number;
}

/**
 * 대표 식재료를 보여주는 가로 캐러셀 전용 카드.
 * IngredientFeatureCard보다 작고 텍스트가 거의 없어 빠르게 훑어볼 수 있음.
 */
export default function IngredientCarouselCard({
  ingredient,
  hasPriceData,
  animationDelay = 0,
}: IngredientCarouselCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-[168px] flex-shrink-0 snap-start"
    >
      <Link href={`/ingredient/${encodeURIComponent(ingredient.name)}`} className="block group">
        {ingredient.imageUrl && (
          <div className="ingredient-frame rounded-2xl mb-2.5">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-[0_4px_14px_-3px_rgba(44,42,38,0.14)]">
              <Image
                src={ingredient.imageUrl}
                alt={ingredient.name}
                fill
                sizes="168px"
                className="object-cover img-editorial transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {hasPriceData && (
                <div className="absolute top-2 left-2">
                  <PriceBadge name={ingredient.name} variant="badge" />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-[13.5px] font-medium text-ink">
            {ingredient.emoji} {ingredient.name}
          </span>
        </div>
        <Badge variant="sage" size="sm" className="mt-1">
          제철
        </Badge>
      </Link>
    </motion.div>
  );
}

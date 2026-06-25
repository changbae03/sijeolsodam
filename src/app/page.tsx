'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentMonthData } from '@/lib/season';
import { getRecipesByIngredient } from '@/data/recipes';
import { SeasonalIngredient } from '@/data/types';
import { SearchBar } from '@/components/ui';
import IngredientFeatureCard from '@/components/IngredientFeatureCard';
import Logo from '@/components/Logo';

/** 설명을 "지금 ~로 ~를 만들어보세요" 같은 행동 유도형 문장으로 변환. 매칭 레시피가 없으면 원래 설명으로 대체. */
function getActionLine(ingredient: SeasonalIngredient): string {
  const recipe = getRecipesByIngredient(ingredient.name)[0];
  if (recipe) {
    return `지금 가장 맛있는 ${ingredient.name}로 ${recipe.title}를 만들어보세요.`;
  }
  return ingredient.description;
}

export default function HomePage() {
  const monthData = getCurrentMonthData();
  const [searchQuery, setSearchQuery] = useState('');

  const heroIngredient = monthData?.ingredients.find((i) => i.imageUrl);
  const featuredRecipe = heroIngredient ? getRecipesByIngredient(heroIngredient.name)[0] : undefined;

  if (!monthData || !heroIngredient) return null;

  return (
    <main className="min-h-screen bg-cream pb-12">
      {/* ============================================
          1. Search
         ============================================ */}
      <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-5 pt-3 pb-3">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="flex-1">
              <SearchBar
                placeholder="오늘은 무엇이 궁금하신가요?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5">
        {/* ============================================
            1. 오늘의 제철 — 단 하나의 대표 식재료
           ============================================ */}
        <section className="pt-8 mb-12">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="h-px w-8 bg-sage" />
            <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
              오늘의 제철
            </h2>
          </div>

          <IngredientFeatureCard
            ingredient={heroIngredient}
            descriptionOverride={getActionLine(heroIngredient)}
            priceDisplay="line"
          />
        </section>

        {/* ============================================
            2. 오늘의 메뉴 추천 — 그 식재료로 만든 요리 한 가지
           ============================================ */}
        {featuredRecipe && (
          <section className="mb-12">
            <div className="flex items-baseline gap-3 mb-5">
              <span className="h-px w-8 bg-sage" />
              <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
                오늘의 메뉴 추천
              </h2>
            </div>

            <Link href={`/recipe/${featuredRecipe.id}`} className="block group">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-[13px] text-ink-soft font-medium">
                  <span className="text-[16px]">{heroIngredient.emoji}</span>
                  {heroIngredient.name}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
                <span className="text-[13px] text-ink font-semibold">{featuredRecipe.title}</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-cream-warm">
                <Image
                  src={featuredRecipe.heroImage}
                  alt={featuredRecipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-cover img-editorial"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[13px] text-cream leading-snug">
                    지금 가장 맛있는 {heroIngredient.name}로 만들어보세요.
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-cream/80">
                    <span>{featuredRecipe.cookTime}분</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-cream/50" />
                    <span>{featuredRecipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ============================================
            3. CTA — 이번 달 제철 식재료 전체 보기
           ============================================ */}
        <section>
          <Link
            href="/seasonal"
            className="flex items-center justify-between bg-paper border border-border-soft rounded-2xl px-5 py-4 group"
          >
            <span className="text-[14px] text-ink font-medium">
              {monthData.month}월 제철 식재료 전체 보기
            </span>
            <span className="text-terracotta transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}

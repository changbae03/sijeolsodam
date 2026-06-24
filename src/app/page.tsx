'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { getCurrentMonth, getCurrentMonthData } from '@/lib/season';
import { findIngredientByName, formatSeasonMonths } from '@/data/months';
import { getRecipesByMonth, getRecipesByIngredient } from '@/data/recipes';
import { SeasonalIngredient, Recipe } from '@/data/types';
import { getShoppableIngredients } from '@/lib/kamis-mapping';
import { SearchBar, Overline, Badge } from '@/components/ui';
import Logo from '@/components/Logo';

interface PriceInfo {
  name: string;
  emoji: string;
  trendPct: number;
}

const SHOPPABLE = getShoppableIngredients();

/** 설명을 "지금 ~로 ~를 만들어보세요" 같은 행동 유도형 문장으로 변환. 매칭 레시피가 없으면 원래 설명으로 대체. */
function getActionLine(ingredient: SeasonalIngredient): string {
  const recipe = getRecipesByIngredient(ingredient.name)[0];
  if (recipe) {
    return `지금 가장 맛있는 ${ingredient.name}로 ${recipe.title}를 만들어보세요.`;
  }
  return ingredient.description;
}

export default function HomePage() {
  const month = getCurrentMonth();
  const monthData = getCurrentMonthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [bestValue, setBestValue] = useState<PriceInfo[] | null>(null);

  const featuredIngredients = monthData
    ? monthData.ingredients.filter((i) => i.imageUrl).slice(0, 3)
    : [];
  const heroIngredient = featuredIngredients[0];
  const restIngredients = featuredIngredients.slice(1);

  // 대표 식재료로 만든 레시피를 우선으로, 없으면 이번 달 첫 레시피로 추천
  const featuredRecipe: Recipe | undefined = monthData
    ? (heroIngredient && getRecipesByIngredient(heroIngredient.name)[0]) ??
      getRecipesByMonth(month)[0]
    : undefined;

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      SHOPPABLE.map(({ ingredient }) =>
        fetch(`/api/ingredient-price?name=${encodeURIComponent(ingredient.name)}`)
          .then((res) => res.json())
          .then((data) => {
            const latest = data?.comparison?.latest?.price ?? null;
            const monthAgo = data?.comparison?.oneMonthAgo?.price ?? null;
            if (latest == null || !monthAgo || monthAgo <= 0) return null;
            const trendPct = Math.round(((latest - monthAgo) / monthAgo) * 100);
            return { name: ingredient.name, emoji: ingredient.emoji, trendPct };
          })
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      const valid = results.filter((r): r is PriceInfo => r !== null && r.trendPct < 0);
      valid.sort((a, b) => a.trendPct - b.trendPct);
      setBestValue(valid.slice(0, 3));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!monthData) return null;

  return (
    <main className="min-h-screen bg-cream pb-10">
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
            2. Hero message
           ============================================ */}
        <section className="pt-8 pb-10">
          <p className="text-[14px] text-ink-soft mb-2">안녕하세요 👋</p>
          <h1 className="font-display text-[26px] leading-[1.3] tracking-tight text-ink font-medium">
            오늘의 식탁, 계절이 정합니다.
          </h1>
        </section>

        {/* ============================================
            3. 오늘의 제철 — 대표 1개 + 나머지는 컴팩트하게
           ============================================ */}
        {heroIngredient && (
          <section className="mb-12">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="h-px w-8 bg-sage" />
              <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
                오늘의 제철
              </h2>
            </div>

            <HeroIngredientCard ingredient={heroIngredient} />

            {restIngredients.length > 0 && (
              <div className="flex gap-3 mt-4">
                {restIngredients.map((ing) => (
                  <CompactIngredientCard key={ing.name} ingredient={ing} />
                ))}
              </div>
            )}

            <Link
              href="/seasonal"
              className="inline-flex items-center gap-1.5 mt-5 text-[13px] text-ink-soft font-medium"
            >
              제철 전체 보기 →
            </Link>
          </section>
        )}

        {/* ============================================
            4. 오늘의 메뉴 추천 — 식재료 -> 요리 연결을 시각적으로
           ============================================ */}
        {featuredRecipe && heroIngredient && (
          <section className="mb-12">
            <div className="flex items-baseline gap-3 mb-5">
              <span className="h-px w-8 bg-sage" />
              <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
                오늘의 메뉴 추천
              </h2>
            </div>

            <Link href={`/recipe/${featuredRecipe.id}`} className="block group">
              {/* 식재료 -> 요리 연결 캡션 */}
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
            5. 이번 주 가격이 좋은 식재료
           ============================================ */}
        {bestValue && bestValue.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="h-px w-8 bg-sage" />
              <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
                이번 주 가격이 좋은 식재료
              </h2>
            </div>
            <div className="divide-y divide-border-soft/60">
              {bestValue.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-3">
                  <span className="text-[14px] text-ink flex items-center gap-2">
                    <span className="text-[17px]">{item.emoji}</span>
                    {item.name}
                  </span>
                  <Badge variant="sage" size="sm">
                    ▼ {Math.abs(item.trendPct)}%
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================
            6. 이번 달 제철 전체 보기 — 강한 에디토리얼 CTA
           ============================================ */}
        <section className="mb-2">
          <Link href="/seasonal" className="block group">
            <div className="relative bg-ink rounded-[24px] px-6 py-7 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-transparent to-terracotta/10" />
              <div className="relative">
                <Overline color="soft" className="mb-3">
                  {monthData.month}월의 제철 이야기
                </Overline>
                <h3 className="font-display text-[22px] text-cream font-medium leading-[1.35] tracking-tight">
                  {monthData.month}월, 자연이 내어준
                  <br />
                  식재료를 모두 만나보세요
                </h3>

                {/* 이번 달 식재료 미리보기 콜라주 */}
                <div className="flex -space-x-2.5 mt-5">
                  {monthData.ingredients
                    .filter((i) => i.imageUrl)
                    .slice(0, 5)
                    .map((ing) => (
                      <div
                        key={ing.name}
                        className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-ink"
                      >
                        <Image
                          src={ing.imageUrl!}
                          alt={ing.name}
                          fill
                          sizes="44px"
                          className="object-cover img-editorial"
                        />
                      </div>
                    ))}
                  <div className="relative w-11 h-11 rounded-full border-2 border-ink bg-cream/15 flex items-center justify-center">
                    <span className="text-[11px] text-cream font-medium">
                      +{monthData.ingredients.length - 5 > 0 ? monthData.ingredients.length - 5 : 0}
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 mt-6 text-[13px] text-terracotta-light font-medium">
                  <span>이번 달 제철 전체 보기</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   대표 식재료 카드 — 오늘의 제철 섹션의 유일한 큰 카드
   ============================================================ */
function HeroIngredientCard({ ingredient }: { ingredient: SeasonalIngredient }) {
  const found = findIngredientByName(ingredient.name);
  const seasonLabel = found ? formatSeasonMonths(found.months) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/ingredient/${encodeURIComponent(ingredient.name)}`} className="block group">
        {ingredient.imageUrl && (
          <div className="relative w-full aspect-[5/4] rounded-[20px] overflow-hidden bg-cream-warm mb-3 shadow-[0_4px_16px_rgba(44,42,38,0.08)]">
            <Image
              src={ingredient.imageUrl}
              alt={ingredient.name}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover img-editorial transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="px-1">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-display text-[18px] text-ink font-medium tracking-tight">
              {ingredient.emoji} {ingredient.name}
            </h3>
            {seasonLabel && (
              <Badge variant="sage" size="sm">
                제철 {seasonLabel}
              </Badge>
            )}
          </div>
          <p className="text-[12.5px] text-terracotta leading-relaxed line-clamp-1 font-medium">
            {getActionLine(ingredient)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ============================================================
   컴팩트 식재료 카드 — 나머지 제철 재료 (반복 최소화)
   ============================================================ */
function CompactIngredientCard({ ingredient }: { ingredient: SeasonalIngredient }) {
  return (
    <Link
      href={`/ingredient/${encodeURIComponent(ingredient.name)}`}
      className="flex-1 block group"
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-cream-warm mb-2">
        {ingredient.imageUrl ? (
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            fill
            sizes="160px"
            className="object-cover img-editorial transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[26px]">
            {ingredient.emoji}
          </div>
        )}
      </div>
      <p className="text-[12.5px] font-medium text-ink leading-tight">
        {ingredient.emoji} {ingredient.name}
      </p>
    </Link>
  );
}

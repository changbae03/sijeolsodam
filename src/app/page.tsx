'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { getCurrentMonth, getCurrentMonthData } from '@/lib/season';
import { getRecipesByMonth, allRecipes } from '@/data/recipes';
import { SeasonalIngredient } from '@/data/types';
import {
  SearchBar,
  SectionTitle,
  Overline,
  Badge,
  Card,
  BottomNavigation,
} from '@/components/ui';
import IngredientDetailSheet from '@/components/IngredientDetailSheet';
import Logo from '@/components/Logo';

export default function HomePage() {
  const month = getCurrentMonth();
  const monthData = getCurrentMonthData();
  const [selectedIngredient, setSelectedIngredient] = useState<SeasonalIngredient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!monthData) return null;

  const featuredIngredients = monthData.ingredients.filter((i) => i.imageUrl).slice(0, 3);
  const inspiredRecipes = getRecipesByMonth(month).slice(0, 4);
  const popularRecipes = [...allRecipes].sort((a, b) => a.cookTime - b.cookTime).slice(0, 3);

  return (
    <main className="min-h-screen bg-cream pb-28">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-30 bg-cream/85 backdrop-blur-xl">
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
      </div>

      <div className="max-w-md mx-auto px-5">
        {/* ============================== */}
        {/* 1. HERO */}
        {/* ============================== */}
        <section className="pt-16 pb-16">
          <Overline color="terracotta" className="mb-6">
            {monthData.solarTerm} · {monthData.season}
          </Overline>
          <h1 className="font-display text-[38px] leading-[1.2] tracking-tight text-ink font-medium">
            오늘의 식탁,
            <br />
            계절이 정합니다.
          </h1>
          <p className="text-[14.5px] leading-[1.7] text-ink-soft mt-6 max-w-[320px]">
            오늘 가장 좋은 식재료를 먼저 만나보세요.
            <br />
            요리는 그 다음의 이야기입니다.
          </p>
        </section>

        {/* ====================================== */}
        {/* 2. 오늘의 제철 — PRIMARY */}
        {/* ====================================== */}
        <section className="mb-20">
          <SectionTitle
            overline="In Season Today"
            title="오늘의 제철"
            subtitle={`${month}월, 자연이 가장 정성을 들인 식재료들`}
            withDivider
            size="lg"
            className="mb-8"
          />

          <div className="space-y-8">
            {featuredIngredients.map((ingredient, idx) => (
              <motion.button
                key={ingredient.name}
                onClick={() => setSelectedIngredient(ingredient)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.985 }}
                className="w-full block text-left group"
              >
                {ingredient.imageUrl && (
                  <div className="relative w-full aspect-[5/4] rounded-[20px] overflow-hidden bg-cream-warm mb-5">
                    <Image
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 448px"
                      className="object-cover transition-transform duration-500 group-active:scale-[1.02]"
                    />
                    <span className="absolute top-4 left-4 font-display text-[13px] tracking-wider text-cream/90 bg-ink/35 backdrop-blur-md rounded-full px-3 py-1.5">
                      No. 0{idx + 1}
                    </span>
                    <div className="absolute top-4 right-4">
                      <Badge variant="paper" size="sm">제철</Badge>
                    </div>
                  </div>
                )}

                <div className="px-1">
                  <Overline color="soft" className="mb-2">
                    {ingredient.category}
                    {ingredient.origin && ` · ${ingredient.origin}`}
                  </Overline>
                  <h3 className="font-display text-[24px] text-ink font-medium tracking-tight leading-tight">
                    {ingredient.name}
                  </h3>
                  <p className="text-[14px] text-ink-soft leading-relaxed mt-3 max-w-[340px]">
                    {ingredient.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-[12.5px] text-terracotta font-medium">
                    자세히 보기
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ====================================== */}
        {/* 3. 오늘의 추천 요리 */}
        {/* ====================================== */}
        <section className="mb-20 -mx-5">
          <div className="px-5 mb-5">
            <SectionTitle
              overline="Today's Inspiration"
              overlineColor="soft"
              title="제철에서 떠오른 한 끼"
              withDivider
              size="sm"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
            {inspiredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="w-[140px] flex-shrink-0 snap-start"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-cream-warm mb-3">
                  <Image
                    src={recipe.heroImage}
                    alt={recipe.title}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-[13px] text-ink leading-snug line-clamp-2 tracking-tight">
                  {recipe.title}
                </h3>
                <p className="text-[11px] text-ink-soft/70 mt-1">{recipe.cookTime}분</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================================== */}
        {/* 4. 인기 레시피 */}
        {/* ====================================== */}
        <section className="mb-20">
          <SectionTitle
            overline="Most Loved"
            overlineColor="soft"
            title="많이 찾은 레시피"
            size="sm"
            className="mb-4"
          />

          <div className="divide-y divide-border-soft/60">
            {popularRecipes.map((recipe, idx) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="flex items-center gap-4 py-4 group"
              >
                <span className="font-display text-[13px] text-ink-soft/50 w-5 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-warm flex-shrink-0">
                  <Image
                    src={recipe.heroImage}
                    alt={recipe.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13.5px] text-ink leading-tight font-medium line-clamp-1">
                    {recipe.title}
                  </h3>
                  <p className="text-[11px] text-ink-soft/60 mt-1">
                    {recipe.cookTime}분 · {recipe.category}
                  </p>
                </div>
                <span className="text-ink-soft/30 group-active:text-ink-soft transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ====================================== */}
        {/* 5. CTA */}
        {/* ====================================== */}
        <section className="mb-8">
          <Link href="/seasonal" className="block">
            <Card variant="ink" padding="lg" bordered={false} className="text-center relative overflow-hidden rounded-[24px]">
              <div className="absolute inset-0 bg-gradient-to-br from-sage/8 via-transparent to-terracotta/8" />
              <div className="relative">
                <Overline color="soft" className="mb-4 justify-center">
                  Explore the Seasons
                </Overline>
                <h3 className="font-display text-[24px] text-cream font-medium leading-[1.3] tracking-tight">
                  계절의 흐름을 따라
                  <br />
                  일년치 식재료를 만나다
                </h3>
                <p className="text-[12.5px] text-cream/60 mt-4 leading-relaxed max-w-[260px] mx-auto">
                  매달 자연이 가장 좋은 것을 내어줍니다.
                  <br />
                  12달의 이야기를 둘러보세요.
                </p>
                <div className="inline-flex items-center gap-2 mt-6 text-[13px] text-terracotta-light font-medium">
                  <span>전체 둘러보기</span>
                  <span>→</span>
                </div>
              </div>
            </Card>
          </Link>
        </section>
      </div>

      <BottomNavigation
        activeId="home"
        items={[
          { id: 'home', label: '홈', icon: '🏠', onClick: () => {} },
          { id: 'seasonal', label: '제철', icon: '🌿', onClick: () => {} },
          { id: 'recipe', label: '레시피', icon: '🍳', onClick: () => {} },
          { id: 'shop', label: '장보기', icon: '🛒', onClick: () => {} },
          { id: 'my', label: '마이', icon: '👤', onClick: () => {} },
        ]}
      />

      <IngredientDetailSheet
        ingredient={selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
      />
    </main>
  );
}

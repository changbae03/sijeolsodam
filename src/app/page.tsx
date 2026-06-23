'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { getCurrentMonth, getCurrentMonthData } from '@/lib/season';
import { getRecipesByMonth, allRecipes } from '@/data/recipes';
import { SeasonalIngredient } from '@/data/types';
import { SearchBar } from '@/components/ui';
import IngredientDetailSheet from '@/components/IngredientDetailSheet';
import Logo from '@/components/Logo';

export default function HomePage() {
  const month = getCurrentMonth();
  const monthData = getCurrentMonthData();
  const [selectedIngredient, setSelectedIngredient] = useState<SeasonalIngredient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!monthData) return null;

  const featuredIngredients = monthData.ingredients
    .filter((i) => i.imageUrl)
    .slice(0, 3);

  // 오늘의 추천 요리: 컴팩트 가로 스크롤 (제철 식재료에 영감받은 4개)
  const inspiredRecipes = getRecipesByMonth(month).slice(0, 4);

  // 인기 레시피: 컴팩트 리스트 3개만 (작게)
  const popularRecipes = [...allRecipes]
    .sort((a, b) => a.cookTime - b.cookTime)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-cream pb-28">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-30 bg-cream/85 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-5 pt-3.5 pb-3.5">
          <div className="flex items-center gap-2.5">
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
        {/* 1. HERO — Editorial cover */}
        {/* ============================== */}
        <section className="pt-14 pb-16">
          <p className="text-[11px] tracking-[0.25em] uppercase text-terracotta font-semibold mb-5">
            {monthData.solarTerm} · {monthData.season}
          </p>
          <h1 className="font-display text-[38px] leading-[1.2] tracking-tight text-ink font-medium">
            오늘의 식탁,
            <br />
            계절이 정합니다.
          </h1>
          <p className="text-[14.5px] leading-[1.7] text-ink-soft mt-7 max-w-[320px]">
            오늘 가장 좋은 식재료를 먼저 만나보세요.
            <br />
            요리는 그 다음의 이야기입니다.
          </p>
        </section>

        {/* ====================================== */}
        {/* 2. 오늘의 제철 — PRIMARY HERO SECTION */}
        {/* ====================================== */}
        <section className="mb-20">
          <header className="mb-7">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="h-px w-8 bg-sage" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-sage font-semibold">
                In Season Today
              </p>
            </div>
            <h2 className="font-display text-[28px] tracking-tight text-ink font-medium leading-tight">
              오늘의 제철
            </h2>
            <p className="text-[13px] text-ink-soft mt-2.5 leading-relaxed">
              {month}월, 자연이 가장 정성을 들인 식재료들
            </p>
          </header>

          <div className="space-y-7">
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
                {/* Large editorial image */}
                {ingredient.imageUrl && (
                  <div className="relative w-full aspect-[5/4] rounded-[20px] overflow-hidden bg-cream-warm mb-5">
                    <Image
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 448px"
                      className="object-cover transition-transform duration-500 group-active:scale-[1.02]"
                    />
                    {/* Number marker */}
                    <span className="absolute top-4 left-4 font-display text-[14px] tracking-wider text-cream/90 bg-ink/35 backdrop-blur-md rounded-full px-3 py-1.5">
                      No. 0{idx + 1}
                    </span>
                    {/* Season badge */}
                    <span className="absolute top-4 right-4 text-[11px] font-semibold tracking-wider text-ink bg-cream/90 backdrop-blur-md rounded-full px-3 py-1.5">
                      제철
                    </span>
                  </div>
                )}

                {/* Editorial caption */}
                <div className="px-1">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[10.5px] tracking-[0.15em] uppercase text-ink-soft/60 font-medium">
                      {ingredient.category}
                      {ingredient.origin && ` · ${ingredient.origin}`}
                    </span>
                  </div>
                  <h3 className="font-display text-[24px] text-ink font-medium tracking-tight leading-tight">
                    {ingredient.name}
                  </h3>
                  <p className="text-[14px] text-ink-soft leading-relaxed mt-2.5 max-w-[340px]">
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

        {/* ========================================== */}
        {/* 3. 오늘의 추천 요리 — Smaller, supporting */}
        {/* ========================================== */}
        <section className="mb-20 -mx-5">
          <header className="mb-5 px-5">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="h-px w-8 bg-ink-soft/30" />
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink-soft/70 font-semibold">
                Today&apos;s Inspiration
              </p>
            </div>
            <h2 className="font-display text-[20px] tracking-tight text-ink font-medium leading-tight">
              제철에서 떠오른 한 끼
            </h2>
          </header>

          <div className="flex gap-3.5 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
            {inspiredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="w-[140px] flex-shrink-0 snap-start"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-cream-warm mb-2.5">
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
                <p className="text-[11px] text-ink-soft/70 mt-1">
                  {recipe.cookTime}분
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* =================================== */}
        {/* 4. 인기 레시피 — Compact list */}
        {/* =================================== */}
        <section className="mb-20">
          <header className="mb-5">
            <p className="text-[11px] tracking-[0.2em] uppercase text-ink-soft/60 font-semibold">
              Most Loved
            </p>
            <h2 className="font-display text-[17px] tracking-tight text-ink font-medium mt-1">
              많이 찾은 레시피
            </h2>
          </header>

          <div className="divide-y divide-border-soft/60">
            {popularRecipes.map((recipe, idx) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="flex items-center gap-3.5 py-3.5 group"
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

        {/* =================================== */}
        {/* 5. CTA — Explore all seasons */}
        {/* =================================== */}
        <section className="mb-8">
          <Link
            href="/seasonal"
            className="block bg-ink rounded-[28px] p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sage/8 via-transparent to-terracotta/8" />
            <div className="relative">
              <p className="text-[11px] tracking-[0.25em] uppercase text-cream/50 font-semibold mb-4">
                Explore the Seasons
              </p>
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
          </Link>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      <IngredientDetailSheet
        ingredient={selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
      />
    </main>
  );
}

function BottomNav() {
  const items = [
    { id: 'home', label: '홈', icon: '🏠', href: '/' },
    { id: 'seasonal', label: '제철', icon: '🌿', href: '/seasonal' },
    { id: 'recipe', label: '레시피', icon: '🍳', href: '/recipes' },
    { id: 'shop', label: '장보기', icon: '🛒', href: '/shop' },
    { id: 'my', label: '마이', icon: '👤', href: '/my' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-xl border-t border-border-soft">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2.5 px-2 text-ink-soft/70 hover:text-ink transition-colors"
            >
              <span className="text-[18px]">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] min-h-[4px]" />
      </div>
    </nav>
  );
}

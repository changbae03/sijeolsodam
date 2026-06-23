'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { getCurrentMonth, getCurrentMonthData } from '@/lib/season';
import { getRecipesByMonth, allRecipes } from '@/data/recipes';
import { SeasonalIngredient } from '@/data/types';
import { Badge, SearchBar } from '@/components/ui';
import IngredientDetailSheet from '@/components/IngredientDetailSheet';
import RecipeCard from '@/components/RecipeCard';
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

  const todayRecipes = getRecipesByMonth(month).slice(0, 6);

  const popularRecipes = [...allRecipes]
    .sort((a, b) => a.cookTime - b.cookTime)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-cream pb-24">
      {/* 1. Sticky Search Bar */}
      <div className="sticky top-0 z-30 bg-cream/85 backdrop-blur-xl border-b border-border-soft/40">
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
        {/* 2. Hero Section */}
        <section className="pt-10 pb-12">
          <p className="text-[12px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-4">
            {monthData.solarTerm}
          </p>
          <h1 className="font-display text-[34px] leading-[1.25] tracking-tight text-ink font-medium">
            오늘의 식탁,
            <br />
            계절이 정합니다.
          </h1>
          <p className="text-[14px] leading-relaxed text-ink-soft mt-5 max-w-[300px]">
            지금 가장 맛있는 제철 식재료와 추천 요리를 만나보세요.
          </p>
        </section>

        {/* 3. 오늘의 제철 */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-sage font-semibold mb-1.5">
                In Season Today
              </p>
              <h2 className="font-display text-[22px] tracking-tight text-ink font-medium">
                오늘의 제철
              </h2>
            </div>
            <Link
              href="/seasonal"
              className="text-[12px] text-ink-soft/70 hover:text-ink"
            >
              전체보기 →
            </Link>
          </div>

          <div className="space-y-3.5">
            {featuredIngredients.map((ingredient, idx) => (
              <motion.button
                key={ingredient.name}
                onClick={() => setSelectedIngredient(ingredient)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-paper rounded-[20px] overflow-hidden border border-border-soft text-left flex items-stretch"
              >
                {ingredient.imageUrl && (
                  <div className="relative w-[112px] h-[112px] flex-shrink-0">
                    <Image
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 px-4 py-3.5 flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="sage" size="sm">
                      제철
                    </Badge>
                    <span className="text-[10.5px] text-ink-soft/60 tracking-wider">
                      {month}월 · {ingredient.category}
                    </span>
                  </div>
                  <h3 className="font-display text-[17px] text-ink font-medium tracking-tight">
                    {ingredient.name}
                  </h3>
                  <p className="text-[12.5px] text-ink-soft leading-relaxed mt-1 line-clamp-2">
                    {ingredient.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* 4. 오늘의 추천 요리 — Horizontal scroll */}
        <section className="mb-14 -mx-5">
          <div className="flex items-baseline justify-between mb-5 px-5">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-sage font-semibold mb-1.5">
                Chef&apos;s Picks
              </p>
              <h2 className="font-display text-[22px] tracking-tight text-ink font-medium">
                오늘의 추천 요리
              </h2>
            </div>
            <Link
              href={`/season/${month}`}
              className="text-[12px] text-ink-soft/70 hover:text-ink px-5"
            >
              더보기 →
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
            {todayRecipes.map((recipe) => (
              <div key={recipe.id} className="w-[168px] flex-shrink-0 snap-start">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>

        {/* 5. 인기 레시피 — Grid */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-sage font-semibold mb-1.5">
                Most Loved
              </p>
              <h2 className="font-display text-[22px] tracking-tight text-ink font-medium">
                인기 레시피
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popularRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* 6. CTA Section */}
        <section className="mb-12">
          <Link
            href="/seasonal"
            className="block bg-ink rounded-[24px] p-7 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sage/10 to-transparent" />
            <div className="relative">
              <p className="text-[11px] tracking-[0.2em] uppercase text-cream/60 font-semibold mb-3">
                Explore All Seasons
              </p>
              <h3 className="font-display text-[22px] text-cream font-medium leading-snug tracking-tight">
                12달의 제철 식재료,
                <br />
                계절의 흐름을 따라가보세요
              </h3>
              <div className="inline-flex items-center gap-2 mt-5 text-[13px] text-terracotta-light font-medium">
                <span>둘러보기</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </section>
      </div>

      {/* 7. Bottom Navigation */}
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
        {/* iPhone safe area */}
        <div className="h-[env(safe-area-inset-bottom)] min-h-[4px]" />
      </div>
    </nav>
  );
}

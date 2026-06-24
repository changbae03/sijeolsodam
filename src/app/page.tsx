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
  const inspiredRecipes = getRecipesByMonth(month).slice(0, 5);
  const popularRecipes = [...allRecipes].sort((a, b) => a.cookTime - b.cookTime).slice(0, 3);

  return (
    <main className="min-h-screen bg-cream pb-28">
      {/* ============================================
          1. Sticky Search Bar
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
            2. HERO — Editorial cover
           ============================================ */}
        <section className="pt-16 pb-20">
          <Overline color="terracotta" className="mb-6">
            {monthData.solarTerm} · {monthData.season}
          </Overline>
          <h1 className="font-display text-[40px] leading-[1.18] tracking-[-0.02em] text-ink font-medium">
            오늘의 식탁,
            <br />
            계절이 정합니다.
          </h1>
          <p className="text-[14.5px] leading-[1.75] text-ink-soft mt-7 max-w-[300px]">
            지금 가장 맛있는 제철 식재료와
            <br />
            추천 요리를 만나보세요.
          </p>
        </section>

        {/* ============================================
            3. 오늘의 제철 — Featured ingredient cards
           ============================================ */}
        <section className="mb-24">
          <SectionTitle
            overline="In Season Today"
            title="오늘의 제철"
            subtitle={`${month}월, 자연이 가장 정성을 들인 식재료들`}
            withDivider
            size="lg"
            className="mb-10"
          />

          <div className="space-y-10">
            {featuredIngredients.map((ingredient, idx) => (
              <FeaturedIngredientCard
                key={ingredient.name}
                ingredient={ingredient}
                index={idx}
                onClick={() => setSelectedIngredient(ingredient)}
              />
            ))}
          </div>
        </section>

        {/* ============================================
            4. 오늘의 추천 요리 — Horizontal scroll
           ============================================ */}
        <section className="mb-24 -mx-5">
          <div className="px-5 mb-6">
            <SectionTitle
              overline="Today's Inspiration"
              overlineColor="soft"
              title="오늘의 추천 요리"
              subtitle="제철 식재료에서 떠올린 한 끼"
              withDivider
              size="sm"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5 pb-2">
            {inspiredRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.4 }}
                className="w-[150px] flex-shrink-0 snap-start"
              >
                <Link href={`/recipe/${recipe.id}`} className="block group">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-cream-warm mb-3 shadow-[0_1px_3px_rgba(44,42,38,0.04)]">
                    <Image
                      src={recipe.heroImage}
                      alt={recipe.title}
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="font-display text-[13.5px] text-ink leading-snug line-clamp-2 tracking-tight">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-ink-soft/70">
                    <ClockIcon />
                    <span>{recipe.cookTime}분</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============================================
            5. 인기 레시피 — Compact list (절대 페이지를 압도하지 않게)
           ============================================ */}
        <section className="mb-24">
          <SectionTitle
            overline="Most Loved"
            overlineColor="soft"
            title="인기 레시피"
            size="sm"
            className="mb-2"
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

        {/* ============================================
            6. CTA — Explore all seasonal ingredients
           ============================================ */}
        <section className="mb-10">
          <Link href="/seasonal" className="block">
            <Card
              variant="ink"
              padding="lg"
              bordered={false}
              className="text-center relative overflow-hidden rounded-[24px] shadow-[0_8px_24px_rgba(44,42,38,0.12)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sage/8 via-transparent to-terracotta/8" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
              <div className="relative">
                <Overline color="soft" className="mb-4 justify-center">
                  Explore the Seasons
                </Overline>
                <h3 className="font-display text-[24px] text-cream font-medium leading-[1.3] tracking-tight">
                  이번 달 제철 식재료,
                  <br />
                  전부 둘러보기
                </h3>
                <p className="text-[12.5px] text-cream/60 mt-4 leading-relaxed max-w-[260px] mx-auto">
                  매달 자연이 가장 좋은 것을 내어줍니다.
                  <br />
                  12달의 이야기를 차근차근 둘러보세요.
                </p>
                <div className="inline-flex items-center gap-2 mt-7 text-[13px] text-terracotta-light font-medium">
                  <span>이번 달 제철 보기</span>
                  <span>→</span>
                </div>
              </div>
            </Card>
          </Link>
        </section>
      </div>

      {/* ============================================
          7. Bottom Navigation
         ============================================ */}
      <BottomNavigation
        activeId="home"
        items={[
          { id: 'home', label: '홈', icon: '🏠' },
          { id: 'seasonal', label: '제철', icon: '🗓️' },
          { id: 'recipe', label: '레시피', icon: '🍳' },
          { id: 'shop', label: '장보기', icon: '🛒' },
          { id: 'my', label: '마이', icon: '👤' },
        ]}
      />

      <IngredientDetailSheet
        ingredient={selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
      />
    </main>
  );
}

/* ============================================================
   Featured Ingredient Card — 잡지 표지처럼 큰 이미지 + 캡션
   ============================================================ */
function FeaturedIngredientCard({
  ingredient,
  index,
  onClick,
}: {
  ingredient: SeasonalIngredient;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      className="w-full block text-left group"
    >
      {ingredient.imageUrl && (
        <div className="relative w-full aspect-[5/4] rounded-[20px] overflow-hidden bg-cream-warm mb-5 shadow-[0_4px_16px_rgba(44,42,38,0.08)]">
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* No. 카운터 — 큐레이션 톤 */}
          <span className="absolute top-4 left-4 font-display text-[13px] tracking-wider text-cream/95 bg-ink/40 backdrop-blur-md rounded-full px-3 py-1.5">
            No. 0{index + 1}
          </span>
          {/* 제철 배지 */}
          <div className="absolute top-4 right-4">
            <Badge variant="paper" size="sm">
              제철
            </Badge>
          </div>
        </div>
      )}

      <div className="px-1">
        <Overline color="soft" className="mb-2.5">
          {ingredient.category}
          {ingredient.origin && ` · ${ingredient.origin}`}
        </Overline>
        <h3 className="font-display text-[24px] text-ink font-medium tracking-tight leading-tight">
          {ingredient.name}
        </h3>
        <p className="text-[14px] text-ink-soft leading-[1.7] mt-3 max-w-[340px]">
          {ingredient.description}
        </p>
        <span className="inline-flex items-center gap-1.5 mt-5 text-[12.5px] text-terracotta font-medium">
          자세히 보기
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </motion.button>
  );
}

/* ============================================================
   Inline icons — 미니멀 SVG (이모지 대신)
   ============================================================ */
function ClockIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

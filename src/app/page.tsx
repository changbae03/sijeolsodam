'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { getCurrentMonth, getCurrentMonthData } from '@/lib/season';
import { getRecipesByMonth } from '@/data/recipes';
import { SeasonalIngredient } from '@/data/types';
import { getShoppableIngredients } from '@/lib/kamis-mapping';
import { SearchBar, Overline, Badge, Button } from '@/components/ui';
import Logo from '@/components/Logo';

interface PriceInfo {
  name: string;
  emoji: string;
  trendPct: number;
}

const SHOPPABLE = getShoppableIngredients();

export default function HomePage() {
  const month = getCurrentMonth();
  const monthData = getCurrentMonthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [bestValue, setBestValue] = useState<PriceInfo[] | null>(null);

  const featuredIngredients = monthData
    ? monthData.ingredients.filter((i) => i.imageUrl).slice(0, 3)
    : [];

  // 오늘의 제철 식재료 중 하나로 만든 레시피를 한 개만 골라 추천
  const featuredRecipe = monthData
    ? getRecipesByMonth(month).find((r) =>
        featuredIngredients.some(
          (ing) => r.mainIngredient.includes(ing.name) || ing.name.includes(r.mainIngredient)
        )
      ) ?? getRecipesByMonth(month)[0]
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
          1. Search — 최상위 우선순위
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
            2. Hero message — 짧고 명료하게
           ============================================ */}
        <section className="pt-8 pb-10">
          <p className="text-[14px] text-ink-soft mb-2">안녕하세요 👋</p>
          <h1 className="font-display text-[26px] leading-[1.3] tracking-tight text-ink font-medium">
            오늘의 식탁, 계절이 정합니다.
          </h1>
        </section>

        {/* ============================================
            3. 오늘의 제철 — 가장 시각적으로 우세한 섹션
           ============================================ */}
        <section className="mb-12">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="h-px w-8 bg-sage" />
            <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
              오늘의 제철
            </h2>
          </div>

          <div className="space-y-8">
            {featuredIngredients.map((ingredient, idx) => (
              <FeaturedIngredientCard key={ingredient.name} ingredient={ingredient} index={idx} />
            ))}
          </div>

          <Link
            href="/seasonal"
            className="inline-flex items-center gap-1.5 mt-6 text-[13px] text-ink-soft font-medium"
          >
            제철 전체 보기 →
          </Link>
        </section>

        {/* ============================================
            4. 오늘의 메뉴 추천 — 단 하나만
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
              <div className="flex gap-4 bg-paper rounded-2xl border border-border-soft p-3.5">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-cream-warm flex-shrink-0">
                  <Image
                    src={featuredRecipe.heroImage}
                    alt={featuredRecipe.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="font-display text-[16px] text-ink font-medium tracking-tight">
                    🍳 {featuredRecipe.title}
                  </h3>
                  <p className="text-[12.5px] text-ink-soft leading-relaxed mt-1.5 line-clamp-2">
                    &ldquo;지금 가장 맛있는 {featuredRecipe.mainIngredient}로 만들어보세요.&rdquo;
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[12px] text-terracotta font-medium">
                    레시피 보기
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
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
            6. 이번 달 제철 캘린더 — 미니멀 CTA
           ============================================ */}
        <section className="flex items-center justify-between py-5 border-t border-border-soft">
          <div>
            <Overline color="soft" className="mb-1.5">
              {monthData.month}월의 제철 캘린더
            </Overline>
            <p className="text-[14px] text-ink">
              {monthData.month}월에는 이런 식재료가 맛있어요
            </p>
          </div>
          <Link href="/seasonal">
            <Button variant="tertiary" size="sm">
              달력 보기
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   Featured Ingredient Card — 잡지 표지처럼 큰 이미지 + 캡션
   ============================================================ */
function FeaturedIngredientCard({
  ingredient,
  index,
}: {
  ingredient: SeasonalIngredient;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/ingredient/${encodeURIComponent(ingredient.name)}`}
        className="w-full block text-left group"
      >
        {ingredient.imageUrl && (
          <div className="relative w-full aspect-[5/4] rounded-[20px] overflow-hidden bg-cream-warm mb-4 shadow-[0_4px_16px_rgba(44,42,38,0.08)]">
            <Image
              src={ingredient.imageUrl}
              alt={ingredient.name}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute top-4 right-4">
              <Badge variant="paper" size="sm">
                제철
              </Badge>
            </div>
          </div>
        )}
        <div className="px-1 flex items-center justify-between">
          <h3 className="font-display text-[18px] text-ink font-medium tracking-tight">
            {ingredient.emoji} {ingredient.name}
          </h3>
          <span className="text-ink-soft/40 group-hover:text-ink-soft transition-colors">→</span>
        </div>
      </Link>
    </motion.div>
  );
}

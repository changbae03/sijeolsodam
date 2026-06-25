'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getMonthData } from '@/data/months';
import { getCurrentMonth } from '@/lib/season';
import { getKamisMappingByName } from '@/lib/kamis-mapping';
import { IngredientCategory } from '@/data/types';
import { SearchBar } from '@/components/ui';
import MonthStrip from '@/components/MonthStrip';
import IngredientFeatureCard from '@/components/IngredientFeatureCard';
import IngredientGridCard from '@/components/IngredientGridCard';
import Logo from '@/components/Logo';

// PM 결정에 따른 카테고리 칩. '버섯'·'곡물'은 현재 데이터에 아직 없어서
// 선택해도 빈 상태가 뜨지만, 칩 자체는 그대로 노출합니다.
const CATEGORY_CHIPS: ('전체' | IngredientCategory | '버섯' | '곡물')[] = [
  '전체',
  '채소',
  '과일',
  '해산물',
  '버섯',
  '곡물',
];

export default function SeasonalPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORY_CHIPS[number]>('전체');
  const [query, setQuery] = useState('');

  const monthData = getMonthData(selectedMonth);

  const featured = useMemo(
    () => monthData?.ingredients.filter((i) => i.imageUrl).slice(0, 3) ?? [],
    [monthData]
  );

  const filtered = useMemo(() => {
    if (!monthData) return [];
    return monthData.ingredients.filter((ing) => {
      const matchesCategory = activeCategory === '전체' || ing.category === activeCategory;
      const matchesQuery = !query.trim() || ing.name.includes(query.trim());
      return matchesCategory && matchesQuery;
    });
  }, [monthData, activeCategory, query]);

  if (!monthData) return null;

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
                placeholder="제철 식재료 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5">
        {/* ============================================
            2. 이번 달 hero — 미니멀, 텍스트 최소
           ============================================ */}
        <section className="pt-6 pb-7">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <p className="text-[12px] text-terracotta font-medium mb-1.5">
                {monthData.solarTerm}
              </p>
              <h1 className="font-display text-[30px] text-ink font-medium tracking-tight">
                {monthData.month}월 제철
              </h1>
            </div>
            <span className="text-[12.5px] text-ink-soft">{monthData.season}</span>
          </div>
          <MonthStrip selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMonth}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ============================================
                3. 대표 제철 식재료 — 큰 카드 3개
               ============================================ */}
            {featured.length > 0 && (
              <section className="mb-10">
                <div className="space-y-7">
                  {featured.map((ing, idx) => (
                    <IngredientFeatureCard
                      key={ing.name}
                      ingredient={ing}
                      priceDisplay={getKamisMappingByName(ing.name) ? 'badge' : 'none'}
                      animationDelay={idx * 0.06}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ============================================
                4. 카테고리 칩
               ============================================ */}
            <section className="mb-5">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {CATEGORY_CHIPS.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-ink text-cream'
                        : 'bg-paper text-ink-soft border border-border-soft'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* ============================================
                5. 전체 식재료 그리드
               ============================================ */}
            <section>
              {filtered.length === 0 ? (
                <p className="text-[13px] text-ink-soft/70 text-center py-16">
                  이번 달엔 아직 {activeCategory} 식재료가 없어요.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filtered.map((ing) => (
                    <IngredientGridCard
                      key={ing.name}
                      ingredient={ing}
                      hasPriceData={Boolean(getKamisMappingByName(ing.name))}
                    />
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

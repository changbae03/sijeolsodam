'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getMonthData } from '@/data/months';
import { getCurrentMonth } from '@/lib/season';
import { getKamisMappingByName } from '@/lib/kamis-mapping';
import { IngredientCategory } from '@/data/types';
import { SearchBar } from '@/components/ui';
import MonthStrip from '@/components/MonthStrip';
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

/**
 * "이번 달"(오늘 기준)에만 보여줄 풍부한 에디토리얼 노트.
 * 절기/계절, 대표 카테고리, 산지 하이라이트, 전체 가짓수를 한 문단으로 엮음.
 * 다른 달을 둘러볼 때는 이 노트를 굳이 보여주지 않음(현재 달에만 특별하게).
 */
function buildCurrentMonthNote(monthData: ReturnType<typeof getMonthData>): string | null {
  if (!monthData || monthData.ingredients.length === 0) return null;

  const sentences: string[] = [];

  sentences.push(`${monthData.solarTerm}, ${monthData.season}의 한가운데예요.`);

  const counts = monthData.ingredients.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
  const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (topEntry) {
    sentences.push(`이 달엔 ${topEntry[0]}가 ${topEntry[1]}가지나 제철을 맞았어요.`);
  }

  const withOrigin = monthData.ingredients.find((i) => i.origin);
  if (withOrigin) {
    sentences.push(`${withOrigin.origin}에서 온 ${withOrigin.name}도 놓치면 아쉬워요.`);
  }

  sentences.push(`총 ${monthData.ingredients.length}가지 제철 식재료를 지금 만나보세요.`);

  return sentences.join(' ');
}

export default function SeasonalPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORY_CHIPS[number]>('전체');
  const [query, setQuery] = useState('');

  const monthData = getMonthData(selectedMonth);

  const filtered = useMemo(() => {
    if (!monthData) return [];
    return monthData.ingredients.filter((ing) => {
      const matchesCategory = activeCategory === '전체' || ing.category === activeCategory;
      const matchesQuery = !query.trim() || ing.name.includes(query.trim());
      return matchesCategory && matchesQuery;
    });
  }, [monthData, activeCategory, query]);

  const isCurrentMonth = selectedMonth === getCurrentMonth();

  // 풍부한 노트는 "이번 달"(오늘 기준)일 때만 보여줌. 다른 달엔 굳이 안 보여줌.
  const editorialNote = useMemo(
    () => (isCurrentMonth ? buildCurrentMonthNote(monthData) : null),
    [isCurrentMonth, monthData]
  );

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
            2. 에디토리얼 월 헤더 + 한 줄 노트
           ============================================ */}
        <section className="pt-5 pb-4">
          <div className="flex items-baseline justify-between mb-2">
            <h1 className="font-display text-[24px] text-ink font-medium tracking-tight">
              {monthData.month}월 제철
            </h1>
            <span className="text-[12px] text-terracotta font-medium">{monthData.solarTerm}</span>
          </div>
          {editorialNote && (
            <div className="bg-cream-warm rounded-2xl px-4 py-3.5 mt-2">
              <p className="font-display text-[13.5px] text-ink leading-relaxed tracking-tight">
                🌿 {editorialNote}
              </p>
            </div>
          )}
        </section>

        {/* ============================================
            3. 가로 월 선택기
           ============================================ */}
        <section className="mb-6">
          <MonthStrip selectedMonth={selectedMonth} onSelectMonth={setSelectedMonth} />
        </section>

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
            5. 단일 식재료 그리드 (대표 섹션 없음, 중복 없음)
           ============================================ */}
        <AnimatePresence mode="wait">
          <motion.section
            key={`${selectedMonth}-${activeCategory}-${query}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}

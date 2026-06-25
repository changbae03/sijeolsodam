'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getMonthData } from '@/data/months';
import { getCurrentMonth } from '@/lib/season';
import { getKamisMappingByName } from '@/lib/kamis-mapping';
import { IngredientCategory, SeasonalIngredient } from '@/data/types';
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

type GridItem =
  | { type: 'ingredient'; ingredient: SeasonalIngredient }
  | { type: 'note'; text: string };

/** 그리드 중간에 끼워 넣을 가벼운 에디토리얼 한 줄. 데이터에서 자연스럽게 뽑아냄. */
// 매달 같은 문구가 반복되지 않도록 템플릿을 여러 개 두고 월 기반으로 골라 씀
const ORIGIN_NOTE_TEMPLATES = [
  (origin: string, name: string) => `${origin}에서 온 ${name}, 지금이 한창 물오른 시기예요.`,
  (origin: string, name: string) => `${origin} ${name}가 올해도 제 맛을 내고 있어요.`,
  (origin: string, name: string) => `${origin}산 ${name}, 놓치면 아쉬운 제철이에요.`,
  (origin: string, name: string) => `${origin}에서 갓 올라온 ${name}을 만나보세요.`,
];

const CATEGORY_NOTE_TEMPLATES = [
  (month: number, category: string) => `${month}월엔 ${category}가 유독 풍성한 계절이에요.`,
  (month: number, category: string) => `${month}월 식탁엔 ${category}를 빼놓을 수 없어요.`,
  (month: number, category: string) => `${category}가 가장 다채로워지는 ${month}월입니다.`,
];

function buildEditorialNote(month: number, items: SeasonalIngredient[]): string | null {
  if (items.length === 0) return null;

  const withOrigin = items.find((i) => i.origin);
  if (withOrigin) {
    const template = ORIGIN_NOTE_TEMPLATES[month % ORIGIN_NOTE_TEMPLATES.length];
    return template(withOrigin.origin!, withOrigin.name);
  }

  const counts = items.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!topCategory) return null;
  const template = CATEGORY_NOTE_TEMPLATES[month % CATEGORY_NOTE_TEMPLATES.length];
  return template(month, topCategory);
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

  // 식재료 카드 사이에 에디토리얼 노트를 한 번 끼워 넣음 (6번째 카드 뒤)
  const gridItems = useMemo<GridItem[]>(() => {
    const items: GridItem[] = filtered.map((ing) => ({ type: 'ingredient', ingredient: ing }));
    if (filtered.length > 6) {
      const note = buildEditorialNote(selectedMonth, filtered);
      if (note) items.splice(6, 0, { type: 'note', text: note });
    }
    return items;
  }, [filtered, selectedMonth]);

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
            2. 에디토리얼 월 헤더
           ============================================ */}
        <section className="pt-5 pb-4">
          <div className="flex items-baseline justify-between mb-3.5">
            <h1 className="font-display text-[24px] text-ink font-medium tracking-tight">
              {monthData.month}월 제철
            </h1>
            <span className="text-[12px] text-terracotta font-medium">{monthData.solarTerm}</span>
          </div>
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
            {gridItems.length === 0 ? (
              <p className="text-[13px] text-ink-soft/70 text-center py-16">
                이번 달엔 아직 {activeCategory} 식재료가 없어요.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {gridItems.map((item, idx) =>
                  item.type === 'note' ? (
                    <div
                      key={`note-${idx}`}
                      className="col-span-2 bg-cream-warm rounded-2xl px-5 py-4 flex items-start gap-2.5"
                    >
                      <span className="text-[15px] leading-none mt-0.5">🌿</span>
                      <p className="font-display text-[13.5px] text-ink leading-relaxed tracking-tight">
                        {item.text}
                      </p>
                    </div>
                  ) : (
                    <IngredientGridCard
                      key={item.ingredient.name}
                      ingredient={item.ingredient}
                      hasPriceData={Boolean(getKamisMappingByName(item.ingredient.name))}
                    />
                  )
                )}
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}

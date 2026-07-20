'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getMonthData, searchIngredientsAcrossMonths } from '@/data/months';
import { getCurrentMonth } from '@/lib/season';
import { getKamisMappingByName } from '@/lib/kamis-mapping';
import { IngredientCategory } from '@/data/types';
import { SearchBar } from '@/components/ui';
import Logo from '@/components/Logo';
import MonthStrip from '@/components/MonthStrip';
import IngredientGridCard from '@/components/IngredientGridCard';
import { SOLAR_TERMS } from '@/data/solar-terms';
import { GRAIN_URI } from '@/components/SeasonHero';

// PM 결정에 따른 카테고리 칩. '버섯'·'곡물'은 현재 데이터에 아직 없어서
// 선택해도 빈 상태가 뜨지만, 칩 자체는 그대로 노출합니다.
// 6개 카테고리 칩 — 버섯·곡물도 이제 실제 데이터가 있는 카테고리
const CATEGORY_CHIPS: ('전체' | IngredientCategory)[] = ['전체', '채소', '과일', '해산물', '버섯', '곡물'];

/**
 * "이번 달"(오늘 기준)에만 보여줄 풍부한 에디토리얼 노트.
 * 절기/계절, 대표 카테고리, 산지 하이라이트, 전체 가짓수를 한 문단으로 엮음.
 * 다른 달을 둘러볼 때는 이 노트를 굳이 보여주지 않음(현재 달에만 특별하게).
 */
/** 받침 여부로 '이/가', '을/를' 같은 조사를 자동으로 골라줌 */
function hasFinalConsonant(word: string): boolean {
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return false; // 한글 음절이 아니면 받침 없는 걸로 취급
  return code % 28 !== 0;
}
function withParticle(word: string, withConsonant: string, withoutConsonant: string): string {
  return word + (hasFinalConsonant(word) ? withConsonant : withoutConsonant);
}

/** 1~12 정도의 작은 수는 "다섯 가지"처럼 순우리말 수사로 — 숫자보다 에디토리얼 톤에 어울림 */
const KOREAN_COUNT = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두'];
function toKoreanCount(n: number): string {
  return KOREAN_COUNT[n] ?? `${n}`;
}

function buildCurrentMonthNote(monthData: ReturnType<typeof getMonthData>): string | null {
  if (!monthData || monthData.ingredients.length === 0) return null;

  const counts = monthData.ingredients.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});
  const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const withOrigin = monthData.ingredients.find((i) => i.origin);

  const parts: string[] = [`${monthData.solarTerm}, ${monthData.season}의 한가운데예요.`];

  if (topEntry) {
    const [topCategory, topCount] = topEntry;
    let clause = `이 달엔 ${withParticle(topCategory, '이', '가')} ${toKoreanCount(topCount)} 가지나 제철을 맞았`;
    if (withOrigin) {
      clause += `고, ${withOrigin.origin}에서 올라온 ${withOrigin.name}도 놓치면 아쉬워요.`;
    } else {
      clause += `어요.`;
    }
    parts.push(clause);
  } else if (withOrigin) {
    parts.push(`${withOrigin.origin}에서 올라온 ${withOrigin.name}을 놓치지 마세요.`);
  }

  parts.push(
    `지금 만나볼 수 있는 제철 식재료는 모두 ${toKoreanCount(monthData.ingredients.length)} 가지예요.`
  );

  return parts.join(' ');
}

export default function SeasonalPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORY_CHIPS[number]>('전체');
  const [query, setQuery] = useState('');

  const monthData = getMonthData(selectedMonth);

  const isSearching = query.trim().length > 0;

  const filtered = useMemo(() => {
    // 검색어가 있으면 "지금 보고 있는 달"에 갇히지 않고 12개월 전체에서 찾음
    const source = isSearching
      ? searchIngredientsAcrossMonths(query)
      : monthData?.ingredients ?? [];

    return source.filter(
      (ing) => activeCategory === '전체' || ing.category === activeCategory
    );
  }, [monthData, activeCategory, query, isSearching]);

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
            <Logo size="sm" className="shrink-0" />
            <div className="flex-1">
              <SearchBar
                placeholder="식재료를 검색해보세요"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-5">
        {/* ============================================
            2. 절기 시즌 밴드 — 달을 넘기면 그 달 절기의 시즌 컬러로 바뀜
               (홈 절기 히어로와 같은 컬러 시스템의 확장)
           ============================================ */}
        <section className="pt-5 pb-4">
          {(() => {
            const monthTerms = SOLAR_TERMS.filter((t) => t.month === monthData.month);
            const theme = monthTerms[0]?.theme ?? { deep: '#1E4632', mid: '#2E6B45', warm: '#E9B84E' };
            const note = editorialNote ?? monthData.headline;
            return (
              <div
                className="relative overflow-hidden rounded-[28px] px-6 py-6 text-cream"
                style={{
                  background: `radial-gradient(120% 100% at 88% -12%, ${theme.warm}4D, transparent 55%), linear-gradient(165deg, ${theme.mid} 0%, ${theme.deep} 70%)`,
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ backgroundImage: GRAIN_URI }}
                />
                <div className="relative">
                  <p className="text-[11px] tracking-[0.16em] text-white/60 font-medium mb-2">
                    열두 달 제철
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <h1 className="font-season text-[42px] leading-none font-semibold">
                      {monthData.month}월
                    </h1>
                    <p className="font-season text-[13.5px] text-white/75 pb-1 whitespace-nowrap">
                      {monthTerms.map((t, i) => (
                        <span key={t.name}>
                          {i > 0 && <span className="mx-1.5 text-white/40">·</span>}
                          {t.name} <span className="text-white/50">{t.hanja}</span>
                        </span>
                      ))}
                    </p>
                  </div>
                  {note && (
                    <p className="mt-3.5 text-[13.5px] leading-[1.7] text-white/85">{note}</p>
                  )}
                </div>
              </div>
            );
          })()}
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
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
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
            {isSearching && (
              <p className="text-[13px] text-ink-soft/60 mb-3">
                전체 12개월에서 찾은 결과예요 ({filtered.length}개)
              </p>
            )}
            {filtered.length === 0 ? (
              <p className="text-[14px] text-ink-soft/70 text-center py-16">
                {isSearching
                  ? `'${query.trim()}'으로 찾은 식재료가 없어요.`
                  : `이번 달엔 아직 ${activeCategory} 식재료가 없어요.`}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filtered.map((ing) => (
                  <IngredientGridCard
                  key={ing.name}
                  ingredient={ing}
                  month={monthData.month}
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

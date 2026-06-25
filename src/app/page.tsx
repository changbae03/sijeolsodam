'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentMonthData } from '@/lib/season';
import { getRecipesByIngredient } from '@/data/recipes';
import { findBestValueInSeason } from '@/lib/price-insight';
import { SeasonalIngredient } from '@/data/types';
import { SearchBar } from '@/components/ui';
import IngredientFeatureCard from '@/components/IngredientFeatureCard';
import Logo from '@/components/Logo';

/** 설명을 "지금 ~로 ~를 만들어보세요" 같은 행동 유도형 문장으로 변환. 매칭 레시피가 없으면 원래 설명으로 대체. */
function getActionLine(ingredient: SeasonalIngredient): string {
  const recipe = getRecipesByIngredient(ingredient.name)[0];
  if (recipe) {
    return `지금 가장 맛있는 ${ingredient.name}로 ${recipe.title}를 만들어보세요.`;
  }
  return ingredient.description;
}

const CARD_WIDTH = 280; // px — 캐러셀 카드 너비
const CARD_GAP = 16; // px — gap-4

export default function HomePage() {
  const monthData = getCurrentMonthData();
  const [searchQuery, setSearchQuery] = useState('');

  const defaultHero = monthData?.ingredients.find((i) => i.imageUrl);
  const [bestPick, setBestPick] = useState<SeasonalIngredient | undefined>(defaultHero);
  // 제철이면서 가격도 좋아서(이번 주 추천 컨셉) 선택된 경우만 true — 캐러셀 0번 카드에만 적용
  const [isWeeklyPick, setIsWeeklyPick] = useState(false);

  useEffect(() => {
    if (!monthData) return;
    const candidates = monthData.ingredients.filter((i) => i.imageUrl);
    let cancelled = false;
    findBestValueInSeason(candidates).then((best) => {
      if (!cancelled && best) {
        setBestPick(best);
        setIsWeeklyPick(true);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- monthData는 달이 바뀌지 않는 한 동일 참조
  }, []);

  // 캐러셀에 보여줄 식재료들: 대표(best pick) 먼저, 그 다음 이 달의 다른 식재료들
  const carouselIngredients = monthData
    ? [
        ...(bestPick ? [bestPick] : []),
        ...monthData.ingredients.filter((i) => i.imageUrl && i.name !== bestPick?.name),
      ].slice(0, 6)
    : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 위치로 현재 카드 인덱스를 계산 — 스와이프하면 아래 추천 메뉴도 같이 바뀜
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(Math.max(0, Math.min(index, carouselIngredients.length - 1)));
  };

  const activeIngredient = carouselIngredients[activeIndex] ?? bestPick;
  const activeRecipe = activeIngredient ? getRecipesByIngredient(activeIngredient.name)[0] : undefined;

  if (!monthData || !activeIngredient) return null;

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
                placeholder="오늘은 무엇이 궁금하신가요?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ============================================
          1. 오늘의 제철 / 이번 주 추천 — 스와이프 캐러셀
             첫 카드만 제철+가격 모두 좋으면 "이번 주 추천"으로 승격
         ============================================ */}
      <section className="max-w-md mx-auto pt-8 mb-2">
        <div className="px-5">
          <div className="flex items-baseline gap-3 mb-6">
            <span className="h-px w-8 bg-sage" />
            <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
              {activeIndex === 0 && isWeeklyPick ? '이번 주 추천' : '오늘의 제철'}
            </h2>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-5 pb-1"
        >
          {carouselIngredients.map((ing) => (
            <div key={ing.name} className="flex-shrink-0 snap-center" style={{ width: CARD_WIDTH }}>
              <IngredientFeatureCard
                ingredient={ing}
                descriptionOverride={ing.name === bestPick?.name ? getActionLine(ing) : undefined}
                priceDisplay="line"
              />
            </div>
          ))}
        </div>

        {/* 점 인디케이터 — 스와이프 가능함을 알려줌 */}
        {carouselIngredients.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {carouselIngredients.map((ing, idx) => (
              <span
                key={ing.name}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeIndex ? 'w-5 bg-sage' : 'w-1.5 bg-border-soft'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="max-w-md mx-auto px-5">
        {/* ============================================
            2. 오늘의 메뉴 추천 — 캐러셀에서 고른 식재료에 맞춰 같이 바뀜
           ============================================ */}
        {activeRecipe && (
          <section className="mt-10 mb-12">
            <div className="flex items-baseline gap-3 mb-5">
              <span className="h-px w-8 bg-sage" />
              <h2 className="font-display text-[20px] tracking-tight text-ink font-medium">
                오늘의 메뉴 추천
              </h2>
            </div>

            <Link href={`/recipe/${activeRecipe.id}`} className="block group">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-[13px] text-ink-soft font-medium">
                  <span className="text-[16px]">{activeIngredient.emoji}</span>
                  {activeIngredient.name}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
                <span className="text-[13px] text-ink font-semibold">{activeRecipe.title}</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-cream-warm">
                <Image
                  src={activeRecipe.heroImage}
                  alt={activeRecipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-cover img-editorial"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[13px] text-cream leading-snug">
                    지금 가장 맛있는 {activeIngredient.name}로 만들어보세요.
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-cream/80">
                    <span>{activeRecipe.cookTime}분</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-cream/50" />
                    <span>{activeRecipe.difficulty}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ============================================
            3. CTA — 이번 달 제철 식재료 전체 보기
           ============================================ */}
        <section>
          <Link
            href="/seasonal"
            className="flex items-center justify-between bg-paper border border-border-soft rounded-2xl px-5 py-4 group"
          >
            <span className="text-[14px] text-ink font-medium">
              {monthData.month}월 제철 식재료 전체 보기
            </span>
            <span className="text-terracotta transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}

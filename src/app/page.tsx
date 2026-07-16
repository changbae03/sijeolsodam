'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentMonthData } from '@/lib/season';
import { getRecipesByIngredient, getRecipesByMonth } from '@/data/recipes';
import { findBestValueInSeason } from '@/lib/price-insight';
import { SeasonalIngredient } from '@/data/types';
import { getCurrentSolarTerm } from '@/data/solar-terms';
import SeasonHero from '@/components/SeasonHero';
import IngredientCoverCard from '@/components/IngredientCoverCard';
import HomeAgentHero from '@/components/HomeAgentHero';
import WelcomeBanner from '@/components/WelcomeBanner';

const CARD_WIDTH = 250; // px — 캐러셀 커버 카드 너비 (3:4)
const CARD_GAP = 14; // px — gap-3.5

/** 홈 전용 섹션 헤더 — 컬러 아이브로 + 볼드 산스 타이틀. (공용 SectionHeader의 이모지 칩 스타일 대신 에디토리얼 위계) */
function HomeSectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">{eyebrow}</p>
      <h2 className="text-[21px] font-bold tracking-[-0.02em] text-ink leading-tight">{title}</h2>
    </div>
  );
}

export default function HomePage() {
  const monthData = getCurrentMonthData();
  const { current: currentTerm } = getCurrentSolarTerm();

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

  // 셰프 컬렉션 배너 — 이달의 chef 레벨 레시피 중 첫 번째
  const chefRecipe = monthData
    ? getRecipesByMonth(monthData.month).find((r) => r.level === 'chef')
    : undefined;

  if (!monthData || !activeIngredient) return null;

  return (
    <main className="min-h-screen bg-cream pb-12">
      {/* ============================================
          1. 절기 히어로 — 매거진 표지. 워드마크·아이콘도 히어로 안에 있음
         ============================================ */}
      <SeasonHero featuredName={bestPick?.name} />

      {/* ============================================
          2. 소담이 — 히어로에 걸치는 플로팅 글래스 카드
         ============================================ */}
      <section className="relative z-10 max-w-md mx-auto px-4 -mt-11">
        <div
          className="rounded-3xl border border-white/70 bg-white/[0.88] px-4 pt-4 pb-3 backdrop-blur-xl"
          style={{ boxShadow: '0 18px 40px rgba(20, 48, 31, 0.14)' }}
        >
          <HomeAgentHero />
        </div>
      </section>

      {/* ============================================
          3. 오늘의 제철 / 이번 주 추천 — 3:4 커버 카드 캐러셀
             첫 카드만 제철+가격 모두 좋으면 "이번 주 추천"으로 승격
         ============================================ */}
      <section className="max-w-md mx-auto pt-9 mb-2">
        <div className="px-5 mb-5">
          <HomeSectionHeader
            eyebrow={activeIndex === 0 && isWeeklyPick ? '가격도 착해요' : '이달의 제철'}
            title={activeIndex === 0 && isWeeklyPick ? '이번 주 추천' : '지금이 한복판'}
          />
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3.5 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory px-5 pb-1"
          style={{ touchAction: 'pan-x' }}
        >
          {carouselIngredients.map((ing, idx) => (
            <div key={ing.name} className="flex-shrink-0 snap-center" style={{ width: CARD_WIDTH }}>
              <IngredientCoverCard
                ingredient={ing}
                badge={idx === 0 && isWeeklyPick ? '가격도 착해요' : '지금 제철'}
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
            4. 오늘의 메뉴 추천 — 캐러셀에서 고른 식재료에 맞춰 같이 바뀜
           ============================================ */}
        {activeRecipe && (
          <section className="mt-10">
            <div className="mb-5">
              <HomeSectionHeader eyebrow="오늘 뭐 먹지" title="오늘의 메뉴 추천" />
            </div>

            <Link href={`/recipe/${activeRecipe.id}`} className="block group">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 text-[14px] text-ink-soft font-medium">
                  <span className="text-[17px]">{activeIngredient.emoji}</span>
                  {activeIngredient.name}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
                <span className="text-[14px] text-ink font-semibold">{activeRecipe.title}</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-cream-warm">
                <Image
                  src={activeRecipe.heroImage}
                  alt={activeRecipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-cover img-editorial"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/0 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[14px] text-cream leading-snug">
                    지금 가장 맛있는 {activeIngredient.name}로 만들어보세요.
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-cream/80">
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
            5. 개인화 인사이트 — 시간대·취향 기반 추천 스트립
           ============================================ */}
        <section className="mt-10">
          <WelcomeBanner />
        </section>

        {/* ============================================
            6. 셰프 컬렉션 — 다크 배너, 절기 한자 워터마크
           ============================================ */}
        {chefRecipe && (
          <section className="mt-6">
            <Link
              href={`/recipe/${chefRecipe.id}`}
              className="relative block overflow-hidden rounded-3xl px-6 py-6 text-cream"
              style={{ background: 'linear-gradient(150deg, #23211E, #121110 70%)' }}
            >
              <span
                aria-hidden="true"
                className="font-season absolute -right-2 -top-6 text-[104px] font-bold tracking-[-0.04em] text-white/[0.05] leading-none select-none"
              >
                {currentTerm.hanja}
              </span>
              <p className="relative text-[11px] font-semibold tracking-[0.16em] text-[#E9B84E] mb-2.5">
                CHEF COLLECTION
              </p>
              <h3 className="relative text-[20px] font-bold tracking-[-0.01em] leading-[1.45]">
                {chefRecipe.title}
              </h3>
              <p className="relative mt-2 text-[13px] leading-[1.55] text-white/60 line-clamp-2">
                {chefRecipe.subtitle}
              </p>
            </Link>
          </section>
        )}

        {/* ============================================
            7. CTA — 이번 달 제철 식재료 전체 보기
           ============================================ */}
        <section className="mt-6">
          <Link
            href="/seasonal"
            className="flex items-center justify-between bg-paper border border-border-soft rounded-2xl px-5 py-4 group"
          >
            <span className="text-[15px] text-ink font-medium">
              {monthData.month}월 제철 식재료 전체 보기
            </span>
            <span className="text-terracotta transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}

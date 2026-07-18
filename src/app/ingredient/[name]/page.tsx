'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { findIngredientByName, formatSeasonMonths } from '@/data/months';
import { getRecipesByIngredient } from '@/data/recipes';
import { getCurrentMonth } from '@/lib/season';
import PriceTrendSection from '@/components/PriceTrendSection';
import { Card } from '@/components/ui';
import RecipeCard from '@/components/RecipeCard';
import { SeasonalIngredient, Recipe, RecipeLevel } from '@/data/types';

const LEVEL_META: Record<RecipeLevel, { label: string; lead: string }> = {
  home: { label: '데일리 홈쿡', lead: '처음이라면 여기서부터 — 빠르고 쉬운 일상 요리' },
  weekend: { label: '주말 요리', lead: '시간 여유가 있을 때 도전해보는 한 단계 더 깊은 요리' },
  world: { label: '세계 요리', lead: '이 재료로 즐기는 세계 각국의 정통 요리' },
  chef: { label: '셰프 컬렉션', lead: '레스토랑급 기법과 플레이팅으로 완성하는 요리' },
};
const LEVEL_ORDER: RecipeLevel[] = ['home', 'weekend', 'world', 'chef'];

/** 특정 식재료와 함께 쓰면 좋은 양념·재료. 데이터에 없는 항목이라 큐레이션으로 제공. */
const PAIRING_OVERRIDES: Record<string, string[]> = {
  감자: ['양파', '마늘', '버터', '로즈마리'],
  고구마: ['버터', '계핏가루', '꿀', '호두'],
  배추: ['대파', '마늘', '고춧가루', '액젓'],
  무: ['대파', '마늘', '참기름', '깨'],
};

const PAIRING_DEFAULTS: Record<SeasonalIngredient['category'], string[]> = {
  채소: ['양파', '마늘', '대파', '참기름'],
  과일: ['꿀', '레몬', '민트', '요거트'],
  해산물: ['마늘', '레몬', '버터', '파슬리'],
  버섯: ['마늘', '버터', '올리브오일', '파슬리'],
  곡물: ['참기름', '들기름', '깨', '소금'],
  기타: ['소금', '후추', '올리브오일', '레몬'],
};

function getPairingIngredients(ingredient: SeasonalIngredient): string[] {
  const bare = ingredient.name.replace(/^햇|^새/, ''); // 햇감자 -> 감자처럼 접두어 제거 후 매칭
  return PAIRING_OVERRIDES[ingredient.name] ?? PAIRING_OVERRIDES[bare] ?? PAIRING_DEFAULTS[ingredient.category];
}

export default function IngredientDetailPage() {
  const params = useParams<{ name: string }>();
  const router = useRouter();
  const name = decodeURIComponent(params.name);

  const found = findIngredientByName(name);


  if (!found) {
    return (
      <main className="max-w-md mx-auto px-5 pt-20 text-center">
        <p className="text-[15px] text-ink-soft">
          &ldquo;{name}&rdquo; 식재료 정보를 찾을 수 없어요.
        </p>
        <Link href="/seasonal" className="inline-block mt-4 text-[14px] text-terracotta font-medium">
          제철 달력으로 돌아가기 →
        </Link>
      </main>
    );
  }

  const { ingredient, months } = found;
  const recipes = getRecipesByIngredient(ingredient.name);

  const recipesByLevel = LEVEL_ORDER.reduce<Record<RecipeLevel, Recipe[]>>(
    (acc, level) => {
      acc[level] = recipes.filter((r) => r.level === level);
      return acc;
    },
    { home: [], weekend: [], world: [], chef: [] }
  );

  // "OO월이 가장 맛있는 시기입니다" — 지금 달이 제철이면 그대로, 아니면 제철 중 첫 달을 기준으로
  const currentMonth = getCurrentMonth();
  const peakMonth = months.includes(currentMonth) ? currentMonth : months[0];

  const pairings = getPairingIngredients(ingredient);

  return (
    <main className="min-h-screen bg-cream pb-32">
      {/* ============================================
          1. Hero image
         ============================================ */}
      <div className="relative w-full aspect-[4/3] bg-cream-warm">
        {ingredient.imageUrl ? (
          <Image
            src={ingredient.imageUrl}
            alt={ingredient.name}
            fill
            sizes="(max-width: 768px) 100vw, 448px"
            priority
            className="object-cover img-editorial"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[88px] leading-none opacity-80">{ingredient.emoji}</span>
          </div>
        )}
        <button
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-paper/90 backdrop-blur-md flex items-center justify-center shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div className="max-w-md mx-auto px-5">
        {/* ============================================
            2. 이름 + 제철 배지
           ============================================ */}
        <section className="pt-6 pb-1">
          <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">
            {formatSeasonMonths(months)} 제철
          </p>
          <h1 className="text-[27px] text-ink font-bold tracking-[-0.02em] leading-tight">
            {ingredient.name}
          </h1>
          {ingredient.origin && (
            <p className="flex items-center gap-1 text-[13px] text-ink-soft/70 mt-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {ingredient.origin}
            </p>
          )}
        </section>

        {/* ============================================
            3. 에디토리얼 소개 — 더 강한 한 줄
           ============================================ */}
        <section className="pb-8">
          <p className="text-[16px] text-ink leading-[1.7] tracking-tight">
            <span className="font-medium">{peakMonth}월이 가장 맛있는 시기입니다.</span>
            <br />
            {ingredient.description}
            {recipes[0] && ` ${recipes[0].title}에 특히 잘 어울려요.`}
          </p>
        </section>

        {/* ============================================
            4. 이 재료로 만들 수 있는 요리 — 난이도 4단계 컬렉션
               데일리 홈쿡 -> 주말 요리 -> 세계 요리 -> 셰프 컬렉션 순으로
               자연스럽게 더 도전해보고 싶어지도록 배치
           ============================================ */}
        {recipes.length > 0 && (
          <section className="mb-10 -mx-5">
            <div className="px-5 mb-1">
              <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">레시피</p>
              <h2 className="text-[21px] font-bold tracking-[-0.02em] text-ink leading-tight">
                이 재료로 만들 수 있는 요리
              </h2>
            </div>

            {LEVEL_ORDER.map((level, levelIdx) => {
              const levelRecipes = recipesByLevel[level];
              if (levelRecipes.length === 0) return null;
              const meta = LEVEL_META[level];
              const isFirst = levelIdx === 0;

              return (
                <div key={level} className={isFirst ? 'mt-4' : 'mt-8'}>
                  <div className="px-5 mb-3 flex items-center gap-2">
                    <span
                      className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                        level === 'chef'
                          ? 'bg-ink text-cream'
                          : level === 'world'
                            ? 'bg-terracotta/10 text-terracotta'
                            : 'bg-sage/10 text-sage'
                      }`}
                    >
                      {meta.label}
                    </span>
                    {!isFirst && (
                      <span className="text-[12px] text-ink-soft/50">→ 한 단계 더 도전</span>
                    )}
                  </div>
                  <p className="px-5 text-[13px] text-ink-soft/70 mb-3 -mt-1.5">{meta.lead}</p>

                  <div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
                    {levelRecipes.map((recipe) => (
                      <div key={recipe.id} className="w-[200px] flex-shrink-0 snap-start">
                        <RecipeCard recipe={recipe} />
                        {recipe.cuisineContext && (
                          <p className="text-[12px] text-ink-soft/60 mt-1.5 px-0.5">
                            {recipe.cuisineContext.country} 요리
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* ============================================
            5. 보관 팁
           ============================================ */}
        {ingredient.tip && (
          <section className="mb-8">
            <SectionHeader title="보관 팁" />
            <p className="text-[14.5px] text-ink leading-relaxed mt-3">{ingredient.tip}</p>
          </section>
        )}

        {/* ============================================
            5-2. 가격 — 평결 + 비교 + 12개월 추이 + 도매시장
           ============================================ */}
        <PriceTrendSection name={ingredient.name} />

        {/* ============================================
            6. 영양 요약
           ============================================ */}
        {ingredient.nutrition && (
          <section className="mb-8">
            <SectionHeader title="영양 요약" />
            <Card padding="md" className="mt-3">
              <p className="text-[14.5px] text-ink leading-relaxed">{ingredient.nutrition}</p>
            </Card>
          </section>
        )}

        {/* ============================================
            7. 함께 쓰면 좋은 재료 — 탐색이 아니라 요리를 돕는 정보
           ============================================ */}
        {pairings.length > 0 && (
          <section className="mb-4">
            <SectionHeader title="함께 쓰면 좋은 재료" />
            <div className="flex flex-wrap gap-2 mt-3.5">
              {pairings.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border-soft bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink-soft"
                >
                  {p}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ============================================
          Primary CTA — 화면 하단 고정
         ============================================ */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-5 pb-3 pt-4 bg-gradient-to-t from-cream via-cream/95 to-transparent">
        <div className="max-w-md mx-auto">
          <Link
            href="/shop"
            className="flex h-[54px] w-full items-center justify-center rounded-2xl bg-ink text-[15.5px] font-semibold text-cream transition-transform active:scale-[0.98]"
          >
            이 재료로 요리 준비하기
          </Link>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink">{title}</h2>
  );
}

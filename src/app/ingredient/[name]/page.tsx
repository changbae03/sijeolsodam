'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { findIngredientByName, formatSeasonMonths, resolveIngredientForMonth } from '@/data/months';
import { getRecipesByIngredient } from '@/data/recipes';
import { getCurrentMonth } from '@/lib/season';
import PriceTrendSection from '@/components/PriceTrendSection';
import OriginMap from '@/components/OriginMap';
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

  const { months } = found;

  // 같은 재료라도 달마다 설명이 다르므로(꽃게: 봄 암꽃게 / 가을 수꽃게)
  // 지금 보는 시점에 해당하는 달의 정보를 쓴다. peakMonth 계산은 아래에 있어
  // 여기서 동일한 규칙(현재 달이 제철이면 그 달, 아니면 가장 가까운 제철 달)을 적용.
  const viewMonth = (() => {
    const now = getCurrentMonth();
    if (months.includes(now)) return now;
    return months.reduce((best, m) => {
      const dist = (m - now + 12) % 12;
      const bestDist = (best - now + 12) % 12;
      return dist < bestDist ? m : best;
    }, months[0]);
  })();
  const ingredient = resolveIngredientForMonth(found, viewMonth);
  const recipes = getRecipesByIngredient(ingredient.name);

  const recipesByLevel = LEVEL_ORDER.reduce<Record<RecipeLevel, Recipe[]>>(
    (acc, level) => {
      acc[level] = recipes.filter((r) => r.level === level);
      return acc;
    },
    { home: [], weekend: [], world: [], chef: [] }
  );

  // "OO월이 가장 맛있는 시기입니다" — 위에서 고른 기준 달과 동일하게 표기
  const peakMonth = viewMonth;

  const pairings = getPairingIngredients(ingredient);

  return (
    <main className="min-h-screen bg-cream pb-24">
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
            5-3. 산지 지도
           ============================================ */}
        {ingredient.origin && <OriginMap origin={ingredient.origin} name={ingredient.name} />}

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
            7. 궁합 — 왜 잘 맞는지, 무엇을 피할지
           ============================================ */}
        {(ingredient.pairings?.length || ingredient.avoidPairings?.length) ? (
          <section className="mb-8">
            <SectionHeader title="궁합" />
            {ingredient.pairings && ingredient.pairings.length > 0 && (
              <div className="mt-3.5">
                <p className="text-[12.5px] font-semibold text-sage-dark mb-2">잘 맞아요</p>
                <div className="rounded-2xl border border-border-soft bg-paper divide-y divide-border-soft/70">
                  {ingredient.pairings.map((p) => (
                    <div key={p.name} className="flex items-baseline gap-3 px-4 py-3">
                      <span className="text-[14px] font-semibold text-ink shrink-0">{p.name}</span>
                      <span className="text-[13px] text-ink-soft leading-snug">{p.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {ingredient.avoidPairings && ingredient.avoidPairings.length > 0 && (
              <div className="mt-4">
                <p className="text-[12.5px] font-semibold text-terracotta mb-2">이건 피하는 게 좋아요</p>
                <div className="rounded-2xl border border-border-soft bg-paper divide-y divide-border-soft/70">
                  {ingredient.avoidPairings.map((p) => (
                    <div key={p.name} className="flex items-baseline gap-3 px-4 py-3">
                      <span className="text-[14px] font-semibold text-ink shrink-0">{p.name}</span>
                      <span className="text-[13px] text-ink-soft leading-snug">{p.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          pairings.length > 0 && (
            <section className="mb-8">
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
          )
        )}
      </div>

      {/* 커머스(장보기) 유입 CTA는 커뮤니티 집중을 위해 비활성화.
          되살릴 때는 아래 블록을 복구하고 /shop 링크를 노출하면 됨. */}
    </main>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink">{title}</h2>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { findIngredientByName, formatSeasonMonths } from '@/data/months';
import { getRecipesByIngredient } from '@/data/recipes';
import { getCurrentMonth } from '@/lib/season';
import { fetchPriceInsight, PriceInsight } from '@/lib/price-insight';
import { Badge, Button, Card } from '@/components/ui';
import RecipeCard from '@/components/RecipeCard';
import { SeasonalIngredient } from '@/data/types';

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

  const [priceInsight, setPriceInsight] = useState<PriceInsight | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 식재료가 바뀔 때 이전 가격 정보를 정리
    setPriceInsight(null);
    fetchPriceInsight(name).then((result) => {
      if (!cancelled) setPriceInsight(result);
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!found) {
    return (
      <main className="max-w-md mx-auto px-5 pt-20 text-center">
        <p className="text-[14px] text-ink-soft">
          &ldquo;{name}&rdquo; 식재료 정보를 찾을 수 없어요.
        </p>
        <Link href="/seasonal" className="inline-block mt-4 text-[13px] text-terracotta font-medium">
          제철 달력으로 돌아가기 →
        </Link>
      </main>
    );
  }

  const { ingredient, months } = found;
  const recipes = getRecipesByIngredient(ingredient.name);

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
          <div className="flex items-center gap-2.5">
            <span className="text-[28px] leading-none">{ingredient.emoji}</span>
            <h1 className="font-display text-[26px] text-ink font-medium tracking-tight">
              {ingredient.name}
            </h1>
            <Badge variant="sage" size="sm">
              제철 {formatSeasonMonths(months)}
            </Badge>
          </div>
        </section>

        {/* ============================================
            3. 에디토리얼 소개 — 더 강한 한 줄
           ============================================ */}
        <section className="pb-8">
          <p className="text-[15px] text-ink leading-[1.7] tracking-tight">
            <span className="font-medium">{peakMonth}월이 가장 맛있는 시기입니다.</span>
            <br />
            {ingredient.description}
            {recipes[0] && ` ${recipes[0].title}에 특히 잘 어울려요.`}
          </p>
        </section>

        {/* ============================================
            4. 이 재료로 만들 수 있는 요리 — 최우선, 가장 비주얼하게
           ============================================ */}
        {recipes.length > 0 && (
          <section className="mb-10 -mx-5">
            <div className="px-5 mb-4">
              <SectionHeader emoji="🍳" title="이 재료로 만들 수 있는 요리" />
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
              {recipes.slice(0, 3).map((recipe) => (
                <div key={recipe.id} className="w-[200px] flex-shrink-0 snap-start">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================
            5. 보관 팁
           ============================================ */}
        {ingredient.tip && (
          <section className="mb-8">
            <SectionHeader emoji="📦" title="보관 팁" />
            <p className="text-[13.5px] text-ink leading-relaxed mt-3">{ingredient.tip}</p>
          </section>
        )}

        {/* ============================================
            5-2. 가격 정보 — 컴팩트, 차트 없음
           ============================================ */}
        {priceInsight && (
          <section className="mb-8">
            <SectionHeader emoji="💰" title="가격 정보" />
            <Card padding="md" className="mt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-ink-soft">현재 평균가</span>
                <span className="text-[16px] text-ink font-semibold tabular-nums">
                  {priceInsight.currentPrice.toLocaleString()}원/kg
                </span>
              </div>
              {priceInsight.vsLastWeekPct !== null && (
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-[12px] text-ink-soft">지난주 대비</span>
                  <span
                    className={`text-[13px] font-medium ${
                      priceInsight.vsLastWeekPct < 0 ? 'text-sage' : 'text-terracotta'
                    }`}
                  >
                    {priceInsight.vsLastWeekPct > 0 ? '+' : ''}
                    {priceInsight.vsLastWeekPct}%
                  </span>
                </div>
              )}
              {priceInsight.vsLastMonthPct !== null && (
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-[12px] text-ink-soft">지난달 대비</span>
                  <span
                    className={`text-[13px] font-medium ${
                      priceInsight.vsLastMonthPct < 0 ? 'text-sage' : 'text-terracotta'
                    }`}
                  >
                    {priceInsight.vsLastMonthPct > 0 ? '+' : ''}
                    {priceInsight.vsLastMonthPct}%
                  </span>
                </div>
              )}
              <p className="text-[13px] text-ink font-medium mt-3">{priceInsight.recommendation}</p>
            </Card>
          </section>
        )}

        {/* ============================================
            6. 영양 요약
           ============================================ */}
        {ingredient.nutrition && (
          <section className="mb-8">
            <SectionHeader emoji="🌿" title="영양 요약" />
            <Card padding="md" className="mt-3">
              <p className="text-[13.5px] text-ink leading-relaxed">{ingredient.nutrition}</p>
            </Card>
          </section>
        )}

        {/* ============================================
            7. 함께 쓰면 좋은 재료 — 탐색이 아니라 요리를 돕는 정보
           ============================================ */}
        {pairings.length > 0 && (
          <section className="mb-4">
            <SectionHeader emoji="🧂" title="함께 쓰면 좋은 재료" />
            <div className="flex flex-wrap gap-2 mt-3.5">
              {pairings.map((p) => (
                <Badge key={p} variant="cream" size="md">
                  {p}
                </Badge>
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
          <Link href="/shop">
            <Button variant="primary" size="lg" fullWidth>
              🍳 이 재료로 요리 준비하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h2 className="text-[15px] font-semibold text-ink flex items-center gap-1.5">
      <span>{emoji}</span>
      {title}
    </h2>
  );
}

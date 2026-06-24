'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { findIngredientByName, formatSeasonMonths } from '@/data/months';
import { getRecipesByIngredient } from '@/data/recipes';
import { getCurrentMonth } from '@/lib/season';
import { Badge, Button, Card } from '@/components/ui';

interface PriceProfileResponse {
  available: boolean;
  comparison?: {
    latest: { date: string; price: number } | null;
    oneMonthAgo: { date: string; price: number } | null;
  } | null;
}

export default function IngredientDetailPage() {
  const params = useParams<{ name: string }>();
  const router = useRouter();
  const name = decodeURIComponent(params.name);

  const found = findIngredientByName(name);

  const [priceProfile, setPriceProfile] = useState<PriceProfileResponse | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- name이 바뀔 때 이전 가격 정보를 정리하고 새로 불러오는 안전한 패턴
    setPriceProfile(null);
    setPriceLoading(true);

    fetch(`/api/ingredient-price?name=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPriceProfile(data);
      })
      .catch(() => {
        if (!cancelled) setPriceProfile({ available: false });
      })
      .finally(() => {
        if (!cancelled) setPriceLoading(false);
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
  const recipes = getRecipesByIngredient(ingredient.name).slice(0, 3);

  // "OO월이 가장 맛있는 시기입니다" — 지금 달이 제철이면 그대로, 아니면 제철 중 첫 달을 기준으로
  const currentMonth = getCurrentMonth();
  const peakMonth = months.includes(currentMonth) ? currentMonth : months[0];

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
            3. 에디토리얼 소개 — 왜 지금 좋은지
           ============================================ */}
        <section className="pb-7">
          <p className="text-[15px] text-ink leading-[1.7] tracking-tight">
            <span className="font-medium">{peakMonth}월이 가장 맛있는 시기입니다.</span>
            <br />
            {ingredient.description}
          </p>
        </section>

        <Divider />

        {/* ============================================
            4. 오늘 추천 메뉴 — 높은 우선순위, 의사결정 중심
           ============================================ */}
        {recipes.length > 0 && (
          <section className="py-7">
            <SectionHeader emoji="🍽️" title="오늘 추천 메뉴" />
            <div className="space-y-2.5 mt-4">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.id}`}
                  className="flex items-center gap-3 bg-paper border border-border-soft rounded-2xl px-4 py-3 group"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-warm flex-shrink-0">
                    <Image
                      src={recipe.heroImage}
                      alt={recipe.title}
                      fill
                      sizes="48px"
                      className="object-cover img-editorial"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-ink font-medium leading-tight">{recipe.title}</p>
                    <p className="text-[11px] text-ink-soft/60 mt-0.5">
                      {recipe.cookTime}분 · {recipe.difficulty}
                    </p>
                  </div>
                  <span className="text-ink-soft/30 group-active:text-ink-soft transition-colors">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Divider />

        {/* ============================================
            5. 가격 인사이트 — "지금 사도 좋을까요?"
           ============================================ */}
        <section className="py-7">
          <SectionHeader emoji="💰" title="지금 사도 좋을까요?" />
          <div className="mt-4">
            <PriceInsightCard loading={priceLoading} profile={priceProfile} />
          </div>
        </section>

        {/* ============================================
            6. 보관 팁 — 1~2줄만
           ============================================ */}
        {ingredient.tip && (
          <>
            <Divider />
            <section className="py-7">
              <SectionHeader emoji="💡" title="보관 팁" />
              <p className="text-[13.5px] text-ink leading-relaxed mt-3">{ingredient.tip}</p>
            </section>
          </>
        )}
      </div>

      {/* ============================================
          7. Primary CTA
         ============================================ */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-5 pb-3 pt-4 bg-gradient-to-t from-cream via-cream/95 to-transparent">
        <div className="max-w-md mx-auto">
          <Link href="/shop">
            <Button variant="primary" size="lg" fullWidth>
              🛒 이 재료로 장보기 시작하기
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

function Divider() {
  return <div className="h-px bg-border-soft" />;
}

/* ============================================================
   가격 인사이트 카드 — 숫자보다 "지금 사도 될지" 판단을 우선
   ============================================================ */
function PriceInsightCard({
  loading,
  profile,
}: {
  loading: boolean;
  profile: PriceProfileResponse | null;
}) {
  if (loading) {
    return (
      <Card padding="lg" className="text-center text-[12.5px] text-ink-soft/70">
        시세 정보를 불러오는 중이에요...
      </Card>
    );
  }

  const latest = profile?.comparison?.latest;
  if (!profile?.available || !latest) {
    return (
      <Card padding="lg" className="text-center text-[12.5px] text-ink-soft/70">
        이 식재료는 아직 시세 정보를 제공하지 않아요.
      </Card>
    );
  }

  const monthAgo = profile.comparison?.oneMonthAgo ?? null;
  const trendPct =
    monthAgo && monthAgo.price > 0
      ? Math.round(((latest.price - monthAgo.price) / monthAgo.price) * 100)
      : null;

  let statusDot = '⚪';
  let statusText = '평소와 비슷한 가격이에요.';
  let trendLine = '';

  if (trendPct !== null) {
    if (trendPct <= -3) {
      statusDot = '🟢';
      statusText = '지금 구매하기 좋은 시기입니다.';
      trendLine = `최근 30일 평균보다 ${Math.abs(trendPct)}% 저렴해요.`;
    } else if (trendPct >= 3) {
      statusDot = '🟠';
      statusText = '조금 기다렸다 사는 것도 괜찮아요.';
      trendLine = `최근 30일 평균보다 ${trendPct}% 비싸요.`;
    } else {
      trendLine = '최근 30일과 비슷한 가격대예요.';
    }
  }

  return (
    <Card padding="lg">
      <p className="text-[12px] text-ink-soft">
        현재 평균 <span className="font-semibold text-ink">{latest.price.toLocaleString()}원/kg</span>
      </p>
      {trendLine && <p className="text-[12.5px] text-ink-soft mt-1.5">{trendLine}</p>}
      <p className="text-[14px] text-ink font-medium mt-3 flex items-center gap-1.5">
        <span>{statusDot}</span>
        {statusText}
      </p>
    </Card>
  );
}

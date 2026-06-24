'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { findIngredientByName, formatSeasonMonths } from '@/data/months';
import { getRecipesByIngredient } from '@/data/recipes';
import { Badge, Button, Card, Overline } from '@/components/ui';
import RecipeCard from '@/components/RecipeCard';

interface PriceProfileResponse {
  available: boolean;
  displayName?: string;
  comparison?: {
    latest: { date: string; price: number } | null;
    oneWeekAgo: { date: string; price: number } | null;
    oneMonthAgo: { date: string; price: number } | null;
    oneYearAgo: { date: string; price: number } | null;
  } | null;
  normalYear?: { average: number | null } | null;
  wholesale?: { county: string; market: string | null; date: string; price: number }[] | null;
  monthlyTrend?: { yearMonth: string; avgPrice: number | null }[] | null;
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
  const recipes = getRecipesByIngredient(ingredient.name);

  return (
    <main className="min-h-screen bg-cream pb-32">
      {/* ============================================
          1. Hero image — 화면 끝까지 꽉 채운 큰 이미지
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
        {/* 뒤로가기 */}
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
            2~3. 이름 + 제철 배지 + 한 줄 설명
           ============================================ */}
        <section className="pt-6 pb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="text-[28px] leading-none">{ingredient.emoji}</span>
            <h1 className="font-display text-[26px] text-ink font-medium tracking-tight">
              {ingredient.name}
            </h1>
            <Badge variant="sage" size="sm">
              제철 {formatSeasonMonths(months)}
            </Badge>
          </div>
          <p className="font-display text-[16px] text-ink-soft leading-[1.6] tracking-tight italic">
            &ldquo;{ingredient.description}&rdquo;
          </p>
        </section>

        {/* ============================================
            4. 시세 동향 카드
           ============================================ */}
        <section className="mb-10">
          <Overline color="soft" className="mb-3">
            Price Watch
          </Overline>
          <PriceTrendCard loading={priceLoading} profile={priceProfile} />
        </section>

        {/* ============================================
            5. 영양 하이라이트
           ============================================ */}
        {ingredient.nutrition && (
          <section className="mb-10">
            <Overline color="soft" className="mb-3">
              Nutrition
            </Overline>
            <HighlightCard icon="🌿" text={ingredient.nutrition} />
          </section>
        )}

        {/* ============================================
            6. 보관 팁
           ============================================ */}
        {ingredient.tip && (
          <section className="mb-10">
            <Overline color="soft" className="mb-3">
              Storage
            </Overline>
            <HighlightCard icon="📦" text={ingredient.tip} />
          </section>
        )}

        {/* ============================================
            7. 준비 팁 (고르는 법 + 어울리는 조리법)
           ============================================ */}
        {(ingredient.howToChoose || ingredient.goesWellWith) && (
          <section className="mb-10 space-y-3">
            <Overline color="soft" className="mb-3">
              Preparation
            </Overline>
            {ingredient.howToChoose && <HighlightCard icon="👀" text={ingredient.howToChoose} />}
            {ingredient.goesWellWith && <HighlightCard icon="🍳" text={ingredient.goesWellWith} />}
          </section>
        )}

        {/* ============================================
            8. 추천 레시피 — 가로 스크롤
           ============================================ */}
        {recipes.length > 0 && (
          <section className="mb-10 -mx-5">
            <div className="px-5 mb-4">
              <Overline color="sage">
                {ingredient.name}로 만든 요리 {recipes.length}개
              </Overline>
            </div>
            <div className="flex gap-3.5 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="w-[150px] flex-shrink-0 snap-start">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ============================================
          9. Primary CTA — 화면 하단 고정
         ============================================ */}
      <div className="fixed bottom-16 left-0 right-0 z-30 px-5 pb-3 pt-4 bg-gradient-to-t from-cream via-cream/95 to-transparent">
        <div className="max-w-md mx-auto">
          <Link href="/shop">
            <Button variant="primary" size="lg" fullWidth>
              이 재료로 장보기 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   작은 정보 카드 — 긴 문단 대신 짧고 명료하게
   ============================================================ */
function HighlightCard({ icon, text }: { icon: string; text: string }) {
  return (
    <Card padding="md" className="flex items-start gap-3">
      <span className="text-[18px] shrink-0 mt-0.5">{icon}</span>
      <p className="text-[13.5px] text-ink leading-relaxed">{text}</p>
    </Card>
  );
}

/* ============================================================
   시세 동향 카드 — 현재가 / 30일 추이 / 평년 대비
   ============================================================ */
function PriceTrendCard({
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

  if (!profile || !profile.available || !profile.comparison?.latest) {
    return (
      <Card padding="lg" className="text-center text-[12.5px] text-ink-soft/70">
        이 식재료는 아직 시세 정보를 제공하지 않아요.
      </Card>
    );
  }

  const { comparison, normalYear } = profile;
  const latest = comparison.latest!;
  const fmt = (n: number) => n.toLocaleString() + '원';

  // 30일 추이 (한 달 전 대비)
  const monthAgo = comparison.oneMonthAgo;
  const trend =
    monthAgo && monthAgo.price > 0
      ? Math.round(((latest.price - monthAgo.price) / monthAgo.price) * 100)
      : null;

  // 평년 대비
  const avg = normalYear?.average ?? null;
  const vsAverage = avg ? Math.round(((latest.price - avg) / avg) * 100) : null;

  return (
    <Card padding="lg">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[12px] text-ink-soft">오늘의 평균 시세 (서울 소매가)</span>
        <span className="text-[10.5px] text-ink-soft/50">{latest.date.slice(5)} 기준</span>
      </div>
      <p className="font-display text-[30px] text-ink font-medium tracking-tight tabular-nums mb-4">
        {fmt(latest.price)}
      </p>

      <div className="flex gap-2.5">
        {trend !== null && <TrendChip label="30일 추이" value={trend} />}
        {vsAverage !== null && <TrendChip label="평년 대비" value={vsAverage} />}
      </div>

      <p className="text-[10px] text-ink-soft/50 leading-relaxed mt-4">
        자료: KAMIS 농산물유통정보
      </p>
    </Card>
  );
}

function TrendChip({ label, value }: { label: string; value: number }) {
  const isUp = value > 0;
  const isFlat = value === 0;
  const color = isFlat ? 'text-ink-soft' : isUp ? 'text-terracotta' : 'text-sage';

  return (
    <div className="flex-1 bg-cream-warm rounded-xl px-3 py-2.5">
      <p className="text-[10.5px] text-ink-soft/70 mb-0.5">{label}</p>
      <p className={`text-[14px] font-semibold tabular-nums ${color}`}>
        {isFlat ? '변동 없음' : `${isUp ? '▲' : '▼'} ${Math.abs(value)}%`}
      </p>
    </div>
  );
}

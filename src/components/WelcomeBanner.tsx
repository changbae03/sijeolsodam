'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { josa } from '@/lib/korean';

interface PersonalizeData {
  loggedIn: boolean;
  greeting: string;
  todayIngredient: {
    name: string;
    emoji: string;
    description: string;
    origin?: string;
    tip?: string;
    nutrition?: string;
  } | null;
  topIngredient: string | null;
  recommendedRecipe: { id: string; title: string; subtitle: string } | null;
  weatherNote: string | null;
  priceNote: string | null;
  timeSuggestion: {
    slot: 'dawnQuick' | 'preDinner';
    message: string;
    recipe: { id: string; title: string; subtitle: string; heroImage: string } | null;
  } | null;
}

/** 원산지·보관팁·영양 정보를 모두 더해 "눈여겨볼 재료" 한 줄을 훨씬 풍성하게 만든다. */
function buildIngredientLine(ing: NonNullable<PersonalizeData['todayIngredient']>): string {
  const parts = [ing.description];
  if (ing.origin) parts.push(`${ing.origin}에서 온 제철 재료예요.`);
  if (ing.nutrition) parts.push(ing.nutrition);
  if (ing.tip) parts.push(`💡 ${ing.tip}`);
  return parts.join(' ');
}

/** 배너 안의 각 인사이트를 아이콘 배지 + 라벨 + 본문으로 구성된 한 줄짜리 항목으로 보여준다.
 * 이렇게 카테고리별로 아이콘·라벨·색을 다르게 줘야, "오늘의 제철"과 "취향 저격 추천"처럼
 * 성격이 다른 정보가 비슷한 문단으로 뭉쳐 보이지 않고 한눈에 구분된다. */
function InsightRow({
  icon,
  iconBg,
  label,
  labelColor,
  children,
  href,
}: {
  icon: string;
  iconBg: string;
  label: string;
  labelColor: string;
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-2.5 py-2">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] ${iconBg}`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[10.5px] font-bold tracking-wide ${labelColor}`}>{label}</p>
        <p className="text-[13.5px] text-ink-soft leading-snug mt-0.5">{children}</p>
      </div>
      {href && <span className="text-ink-soft/30 shrink-0 mt-2">›</span>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block -mx-1 px-1 rounded-lg transition-colors hover:bg-ink/[0.03]">
        {content}
      </Link>
    );
  }
  return content;
}

/**
 * 예전엔 철학 소개 문단 + 기능 4개 그리드가 있었지만,
 * 이제 소담이 대화창이 홈의 메인이라 이 배너는 개인화 인사이트만 슬림하게 보여주는 보조 스트립으로 축소.
 */
export default function WelcomeBanner() {
  const { user } = useAuth();
  const [data, setData] = useState<PersonalizeData | null>(null);

  useEffect(() => {
    function loadPersonalize(coords?: { lat: number; lon: number }) {
      const params = coords ? `?lat=${coords.lat}&lon=${coords.lon}` : '';
      fetch(`/api/personalize${params}`)
        .then((res) => res.json())
        .then(setData)
        .catch(() => setData(null));
    }

    if (typeof window !== 'undefined' && navigator.geolocation) {
      const timer = setTimeout(() => loadPersonalize(), 1500);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          loadPersonalize({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          clearTimeout(timer);
          loadPersonalize();
        },
        { timeout: 1500, maximumAge: 600000 }
      );
    } else {
      loadPersonalize();
    }
  }, []);

  if (!data) return null;

  const rows: React.ReactNode[] = [];

  if (data.weatherNote) {
    rows.push(
      <InsightRow key="weather" icon="☁️" iconBg="bg-ink/[0.05]" label="오늘 날씨" labelColor="text-ink-soft/70">
        {data.weatherNote}
      </InsightRow>
    );
  }

  if (data.timeSuggestion) {
    rows.push(
      <InsightRow
        key="time"
        icon={data.timeSuggestion.slot === 'dawnQuick' ? '🌅' : '🍽️'}
        iconBg="bg-terracotta/10"
        label={data.timeSuggestion.slot === 'dawnQuick' ? '지금 이 시간엔' : '저녁 메뉴 고민된다면'}
        labelColor="text-terracotta"
        href={data.timeSuggestion.recipe ? `/recipe/${data.timeSuggestion.recipe.id}` : undefined}
      >
        {data.timeSuggestion.message}
        {data.timeSuggestion.recipe && (
          <>
            {' '}
            <span className="text-ink font-medium">{data.timeSuggestion.recipe.title}</span>
            {josa(data.timeSuggestion.recipe.title, '은/는')} 어때요?
            <span className="block text-[12.5px] text-ink-soft/70 mt-0.5">
              {data.timeSuggestion.recipe.subtitle}
            </span>
          </>
        )}
      </InsightRow>
    );
  }

  if (data.todayIngredient) {
    rows.push(
      <InsightRow
        key="ingredient"
        icon={data.todayIngredient.emoji}
        iconBg="bg-sage/10"
        label="오늘의 제철"
        labelColor="text-sage"
        href={`/ingredient/${encodeURIComponent(data.todayIngredient.name)}`}
      >
        <span className="text-ink font-medium">{data.todayIngredient.name}</span>
        {'. '}
        {buildIngredientLine(data.todayIngredient)}
        {data.priceNote && <span className="text-terracotta"> {data.priceNote}</span>}
      </InsightRow>
    );
  } else if (data.priceNote) {
    rows.push(
      <InsightRow key="price" icon="📉" iconBg="bg-terracotta/10" label="장보기 타이밍" labelColor="text-terracotta">
        {data.priceNote}
      </InsightRow>
    );
  }

  if (data.loggedIn && data.topIngredient && data.recommendedRecipe) {
    rows.push(
      <InsightRow
        key="personal"
        icon="✨"
        iconBg="bg-terracotta/10"
        label="취향 저격 추천"
        labelColor="text-terracotta"
        href={`/recipe/${data.recommendedRecipe.id}`}
      >
        <span className="text-ink font-medium">{data.topIngredient}</span> 즐겨 찾으시던데,{' '}
        <span className="text-terracotta font-medium">{data.recommendedRecipe.title}</span>
        {josa(data.recommendedRecipe.title, '은/는')} 어떠세요?
        <span className="block text-[12.5px] text-ink-soft/70 mt-0.5">
          {data.recommendedRecipe.subtitle}
        </span>
      </InsightRow>
    );
  }

  return (
    <div className="rounded-2xl bg-cream-warm/50 border border-border-soft/70 px-4 py-3">
      <p className="text-[14px] text-ink font-bold">
        {data.greeting}
        {data.loggedIn && user?.name ? `, ${user.name}님` : ''}
      </p>

      {rows.length > 0 && <div className="mt-1 divide-y divide-border-soft/50">{rows}</div>}

      {!data.loggedIn && (
        <Link
          href="/login"
          className="text-[13px] text-terracotta font-medium mt-2 pt-2 border-t border-border-soft/50 inline-block"
        >
          로그인하면 취향에 맞는 추천을 받아볼 수 있어요 ›
        </Link>
      )}
    </div>
  );
}

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

/** 인사이트 행 앞의 라인 아이콘 — 이모지 칩 대신 스트로크 아이콘으로 새 홈 톤에 맞춤 */
function RowIcon({ kind }: { kind: 'weather' | 'time' | 'ingredient' | 'price' | 'personal' }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (kind) {
    case 'weather':
      return (
        <svg {...common}>
          <path d="M17.5 19a4.5 4.5 0 0 0 .4-8.98A7 7 0 1 0 6 17.7" />
          <path d="M9 19h8.5" />
        </svg>
      );
    case 'time':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
        </svg>
      );
    case 'ingredient':
      return (
        <svg {...common}>
          <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" />
          <path d="M5 19c3-6 7-9 10-10" />
        </svg>
      );
    case 'price':
      return (
        <svg {...common}>
          <path d="M3 7l6 6 4-4 8 8" />
          <path d="M21 12v5h-5" />
        </svg>
      );
    case 'personal':
      return (
        <svg {...common}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
          <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
        </svg>
      );
  }
}

/** 배너 안의 각 인사이트를 아이콘 배지 + 라벨 + 본문으로 구성된 한 줄짜리 항목으로 보여준다.
 * 아이콘 칩은 무채색으로 눌러 통일하고, 카테고리 구분은 라벨 컬러만 맡는다 —
 * 새 홈의 "UI는 조용하게, 컬러는 최소한만" 원칙을 따른 것. */
function InsightRow({
  icon,
  label,
  labelColor,
  children,
  href,
}: {
  icon: 'weather' | 'time' | 'ingredient' | 'price' | 'personal';
  label: string;
  labelColor: string;
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 py-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/[0.04] text-ink-soft">
        <RowIcon kind={icon} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-[11.5px] font-semibold tracking-[0.04em] ${labelColor}`}>{label}</p>
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
      <InsightRow key="weather" icon="weather" label="오늘 날씨" labelColor="text-ink-soft/70">
        {data.weatherNote}
      </InsightRow>
    );
  }

  if (data.timeSuggestion) {
    rows.push(
      <InsightRow
        key="time"
        icon="time"
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
        icon="ingredient"
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
      <InsightRow key="price" icon="price" label="장보기 타이밍" labelColor="text-terracotta">
        {data.priceNote}
      </InsightRow>
    );
  }

  if (data.loggedIn && data.topIngredient && data.recommendedRecipe) {
    rows.push(
      <InsightRow
        key="personal"
        icon="personal"
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
    <div
      className="rounded-3xl bg-paper border border-border-soft px-5 py-4"
      style={{ boxShadow: '0 8px 24px rgba(44, 42, 38, 0.05)' }}
    >
      <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-0.5">
        {data.loggedIn && user?.name ? `${user.name}님을 위한 오늘` : '오늘의 소담'}
      </p>
      <p className="text-[17px] text-ink font-bold tracking-[-0.01em]">{data.greeting}</p>

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

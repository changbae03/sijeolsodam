'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

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
  recommendedRecipe: { id: string; title: string } | null;
  weatherNote: string | null;
  priceNote: string | null;
}

/** 원산지·보관팁·영양 정보를 더해 "눈여겨볼 재료" 한 줄을 훨씬 풍성하게 만든다. */
function buildIngredientLine(ing: NonNullable<PersonalizeData['todayIngredient']>): string {
  const parts = [ing.description];
  if (ing.origin) parts.push(`${ing.origin}에서 온 제철 재료예요.`);
  const extra = ing.tip ?? ing.nutrition;
  if (extra) parts.push(extra);
  return parts.join(' ');
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

  return (
    <div className="rounded-2xl bg-cream-warm/50 border border-border-soft/70 px-4 py-3.5">
      {data.loggedIn ? (
        <>
          <p className="text-[14px] text-ink font-medium">
            {data.greeting}
            {user?.name ? `, ${user.name}님` : ''}
          </p>
          {data.weatherNote && <p className="text-[13.5px] text-ink-soft mt-1.5">{data.weatherNote}</p>}
          {data.todayIngredient && (
            <p className="text-[13.5px] text-ink-soft mt-1.5">
              오늘 눈여겨볼 재료는{' '}
              <Link
                href={`/ingredient/${encodeURIComponent(data.todayIngredient.name)}`}
                className="text-sage font-medium"
              >
                {data.todayIngredient.emoji} {data.todayIngredient.name}
              </Link>
              예요. {buildIngredientLine(data.todayIngredient)}
            </p>
          )}
          {data.priceNote && <p className="text-[13.5px] text-terracotta mt-1.5">{data.priceNote}</p>}
          {data.topIngredient && data.recommendedRecipe && (
            <Link
              href={`/recipe/${data.recommendedRecipe.id}`}
              className="flex items-center gap-1.5 text-[13.5px] text-ink-soft mt-2 pt-2 border-t border-border-soft/70"
            >
              <span className="text-[14px]">🍳</span>
              <span>
                <span className="text-ink font-medium">{data.topIngredient}</span> 즐겨 찾으시던데,{' '}
                <span className="text-terracotta font-medium">{data.recommendedRecipe.title}</span> 어때요?
              </span>
              <span className="text-ink-soft/40 ml-auto shrink-0">›</span>
            </Link>
          )}
        </>
      ) : (
        <>
          {data.weatherNote && <p className="text-[13.5px] text-ink-soft">{data.weatherNote}</p>}
          {data.todayIngredient && (
            <p className="text-[13.5px] text-ink-soft mt-1.5">
              오늘 눈여겨볼 재료는{' '}
              <Link
                href={`/ingredient/${encodeURIComponent(data.todayIngredient.name)}`}
                className="text-sage font-medium"
              >
                {data.todayIngredient.emoji} {data.todayIngredient.name}
              </Link>
              예요. {buildIngredientLine(data.todayIngredient)}
            </p>
          )}
          {data.priceNote && <p className="text-[13.5px] text-terracotta mt-1.5">{data.priceNote}</p>}
          <Link href="/login" className="text-[13px] text-terracotta font-medium mt-1.5 inline-block">
            로그인하면 취향에 맞는 추천을 받아볼 수 있어요 ›
          </Link>
        </>
      )}
    </div>
  );
}

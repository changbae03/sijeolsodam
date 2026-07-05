'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { useAuth } from '@/lib/auth-context';

interface PersonalizeData {
  loggedIn: boolean;
  greeting: string;
  todayIngredient: { name: string; emoji: string } | null;
  topIngredient: string | null;
  recommendedRecipe: { id: string; title: string } | null;
  weatherNote: string | null;
}

const FEATURES = [
  { icon: '🗓️', title: '지금 뭐가 맛있을까' },
  { icon: '🍳', title: '제철 재료로 만드는 요리' },
  { icon: '💬', title: '무엇이든 물어보는 소담이' },
  { icon: '👥', title: '함께 나누는 이야기' },
] as const;

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

    // 위치 권한이 없거나 거부되어도 개인화 자체는 계속 동작해야 하므로,
    // 짧은 타임아웃을 두고 실패하면 위치 없이 바로 불러온다.
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

  return (
    <div>
      <SectionHeader eyebrow="시절소담 이야기" title="제철의 마음을 담았어요" icon="🌿" />

      <p className="mt-3 text-[12.5px] text-ink-soft leading-relaxed">
        24절기를 따라 흘러가는 계절처럼, 그때그때 가장 맛있고 넉넉한 제철 재료를
        소중히 여기고 있어요.
      </p>

      {/* 개인화 영역 — 즐겨찾기·최근 본 레시피·날씨가 쌓일수록 점점 더 잘 맞아요 */}
      <div className="mt-4 rounded-2xl bg-cream-warm/50 border border-border-soft/70 px-4 py-3.5">
        {data?.loggedIn ? (
          <>
            <p className="text-[13px] text-ink font-medium">
              {data.greeting}{user?.name ? `, ${user.name}님` : ''}
            </p>
            {data.weatherNote && (
              <p className="text-[12.5px] text-ink-soft mt-1.5">{data.weatherNote}</p>
            )}
            {data.todayIngredient && (
              <p className="text-[12.5px] text-ink-soft mt-1.5">
                오늘 눈여겨볼 재료는{' '}
                <Link
                  href={`/ingredient/${encodeURIComponent(data.todayIngredient.name)}`}
                  className="text-sage font-medium"
                >
                  {data.todayIngredient.emoji} {data.todayIngredient.name}
                </Link>
                예요.
              </p>
            )}
            {data.topIngredient && data.recommendedRecipe && (
              <Link
                href={`/recipe/${data.recommendedRecipe.id}`}
                className="flex items-center gap-1.5 text-[12.5px] text-ink-soft mt-2 pt-2 border-t border-border-soft/70"
              >
                <span className="text-[13px]">🍳</span>
                <span>
                  <span className="text-ink font-medium">{data.topIngredient}</span> 즐겨 찾으시던데,{' '}
                  <span className="text-terracotta font-medium">{data.recommendedRecipe.title}</span>{' '}
                  어때요?
                </span>
                <span className="text-ink-soft/40 ml-auto shrink-0">›</span>
              </Link>
            )}
          </>
        ) : (
          <>
            {data?.weatherNote && (
              <p className="text-[12.5px] text-ink-soft">{data.weatherNote}</p>
            )}
            {data?.todayIngredient && (
              <p className="text-[12.5px] text-ink-soft mt-1.5">
                오늘 눈여겨볼 재료는{' '}
                <Link
                  href={`/ingredient/${encodeURIComponent(data.todayIngredient.name)}`}
                  className="text-sage font-medium"
                >
                  {data.todayIngredient.emoji} {data.todayIngredient.name}
                </Link>
                예요.
              </p>
            )}
            <Link
              href="/login"
              className="text-[12px] text-terracotta font-medium mt-1.5 inline-block"
            >
              로그인하면 취향에 맞는 추천을 받아볼 수 있어요 ›
            </Link>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-2 rounded-xl bg-cream-warm/40 px-2.5 py-2.5"
          >
            <span className="text-[15px] shrink-0">{f.icon}</span>
            <span className="text-[11.5px] text-ink-soft leading-tight">{f.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

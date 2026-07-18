'use client';

import { useEffect, useState } from 'react';

/** /api/ingredient-price 응답 형태 (fetchFullPriceProfile + available 플래그) */
interface PriceProfile {
  available: boolean;
  displayName?: string;
  comparison?: {
    unit: string;
    latest: { date: string; price: number } | null;
    oneWeekAgo: { date: string; price: number } | null;
    oneMonthAgo: { date: string; price: number } | null;
    oneYearAgo: { date: string; price: number } | null;
  } | null;
  normalYear?: { avgPrice: number; yearsUsed: number } | null;
  wholesale?: { county: string; market: string | null; date: string; price: number }[] | null;
  monthlyTrend?: { yearMonth: string; avgPrice: number | null }[] | null;
}

function pct(current: number, base: number): number {
  return Math.round(((current - base) / base) * 100);
}

/**
 * 가격 신호 판정.
 * 핵심 기준은 평년가 대비(구조적으로 싼지)이고, 전주 대비(방향)를 보조로 쓴다.
 */
function buildVerdict(profile: PriceProfile): {
  tone: 'good' | 'bad' | 'neutral';
  headline: string;
  detail: string;
} | null {
  const latest = profile.comparison?.latest;
  if (!latest) return null;

  const vsNormal = profile.normalYear?.avgPrice ? pct(latest.price, profile.normalYear.avgPrice) : null;
  const vsWeek = profile.comparison?.oneWeekAgo ? pct(latest.price, profile.comparison.oneWeekAgo.price) : null;

  const direction =
    vsWeek === null ? '' : vsWeek <= -3 ? '지난주부터 내리는 중이에요' : vsWeek >= 3 ? '지난주부터 오르는 중이에요' : '최근 일주일은 보합세예요';

  if (vsNormal !== null && vsNormal <= -10) {
    return {
      tone: 'good',
      headline: '지금이 사기 좋은 때예요',
      detail: `평년보다 ${Math.abs(vsNormal)}% 저렴${direction ? `하고, ${direction}` : '해요'}.`,
    };
  }
  if (vsNormal !== null && vsNormal >= 10) {
    return {
      tone: 'bad',
      headline: '평년보다 비싼 편이에요',
      detail: `평년 대비 ${vsNormal}% 높${direction ? `고, ${direction}` : '아요'}.`,
    };
  }
  if (vsWeek !== null && vsWeek <= -5) {
    return { tone: 'good', headline: '가격이 내리는 중이에요', detail: `지난주보다 ${Math.abs(vsWeek)}% 싸졌어요.` };
  }
  if (vsWeek !== null && vsWeek >= 5) {
    return { tone: 'bad', headline: '가격이 오르는 중이에요', detail: `지난주보다 ${vsWeek}% 올랐어요.` };
  }
  return {
    tone: 'neutral',
    headline: '평년과 비슷한 수준이에요',
    detail: direction ? `${direction}.` : '가격이 안정적인 편이에요.',
  };
}

/** 최근 12개월 월평균 가격 스파크라인 (SVG) */
function Sparkline({ points }: { points: { yearMonth: string; avgPrice: number | null }[] }) {
  const valid = points.filter((p): p is { yearMonth: string; avgPrice: number } => p.avgPrice !== null).slice(-12);
  if (valid.length < 4) return null;

  const W = 320;
  const H = 72;
  const PAD = 6;
  const prices = valid.map((p) => p.avgPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const coords = valid.map((p, i) => {
    const x = PAD + (i / (valid.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (p.avgPrice - min) / range) * (H - PAD * 2);
    return { x, y };
  });
  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const last = coords[coords.length - 1];
  const firstLabel = valid[0].yearMonth.slice(2).replace('-', '.');
  const lastLabel = valid[valid.length - 1].yearMonth.slice(2).replace('-', '.');

  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[72px]" role="img" aria-label="최근 12개월 가격 추이">
        <path d={path} fill="none" stroke="var(--color-sage-dark, #5C7355)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="3.5" fill="var(--color-sage-dark, #5C7355)" />
      </svg>
      <div className="flex justify-between text-[10.5px] text-ink-soft/50 mt-1 tabular-nums">
        <span>{firstLabel}</span>
        <span>최저 {min.toLocaleString()} · 최고 {max.toLocaleString()}원</span>
        <span>{lastLabel}</span>
      </div>
    </div>
  );
}

/** 비교 항목 하나 (전주/전월/전년/평년 대비) */
function CompareCell({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl bg-cream-warm/60 px-2.5 py-2 text-center">
      <p className="text-[10.5px] text-ink-soft/70">{label}</p>
      <p
        className={`text-[13.5px] font-semibold tabular-nums mt-0.5 ${
          value === null ? 'text-ink-soft/40' : value < 0 ? 'text-sage-dark' : value > 0 ? 'text-terracotta' : 'text-ink-soft'
        }`}
      >
        {value === null ? '–' : `${value > 0 ? '+' : ''}${value}%`}
      </p>
    </div>
  );
}

/**
 * 식재료 상세의 가격 섹션.
 * "숫자 나열"이 아니라 판단을 먼저 준다: 지금 사도 되는지(평년 대비) + 방향(전주 대비),
 * 그 아래 근거(비교 그리드·12개월 추이·도매시장별 가격)를 붙이는 구조.
 */
export default function PriceTrendSection({ name }: { name: string }) {
  const [profile, setProfile] = useState<PriceProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    setProfile(null);
    fetch(`/api/ingredient-price?name=${encodeURIComponent(name)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setProfile({ available: false });
      });
    return () => {
      cancelled = true;
    };
  }, [name]);

  // 로딩 중이거나 KAMIS 미취급 품목(해산물 다수)이면 섹션 자체를 숨김
  if (!profile?.available || !profile.comparison?.latest) return null;

  const { comparison, normalYear, wholesale, monthlyTrend } = profile;
  const latest = comparison.latest!;
  const verdict = buildVerdict(profile);

  const vsWeek = comparison.oneWeekAgo ? pct(latest.price, comparison.oneWeekAgo.price) : null;
  const vsMonth = comparison.oneMonthAgo ? pct(latest.price, comparison.oneMonthAgo.price) : null;
  const vsYear = comparison.oneYearAgo ? pct(latest.price, comparison.oneYearAgo.price) : null;
  const vsNormal = normalYear?.avgPrice ? pct(latest.price, normalYear.avgPrice) : null;

  const toneStyles = {
    good: 'bg-sage-dark text-cream',
    bad: 'bg-terracotta text-cream',
    neutral: 'bg-ink/[0.06] text-ink',
  } as const;

  return (
    <section className="mb-8">
      <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink">가격, 지금 어때요</h2>

      <div className="mt-3 rounded-2xl border border-border-soft bg-paper overflow-hidden">
        {/* 평결 */}
        {verdict && (
          <div className={`px-4 py-3.5 ${toneStyles[verdict.tone]}`}>
            <p className="text-[15px] font-bold tracking-[-0.01em]">{verdict.headline}</p>
            <p className={`text-[12.5px] mt-0.5 ${verdict.tone === 'neutral' ? 'text-ink-soft' : 'text-white/85'}`}>
              {verdict.detail}
            </p>
          </div>
        )}

        <div className="px-4 py-4">
          {/* 현재가 */}
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] text-ink-soft">
              현재 소매가 <span className="text-ink-soft/50">({comparison.unit})</span>
            </span>
            <span className="text-[19px] text-ink font-bold tabular-nums tracking-[-0.01em]">
              {latest.price.toLocaleString()}원
            </span>
          </div>

          {/* 비교 그리드 */}
          <div className="grid grid-cols-4 gap-1.5 mt-3.5">
            <CompareCell label="전주 대비" value={vsWeek} />
            <CompareCell label="전월 대비" value={vsMonth} />
            <CompareCell label="작년 대비" value={vsYear} />
            <CompareCell label="평년 대비" value={vsNormal} />
          </div>

          {/* 12개월 추이 */}
          {monthlyTrend && <Sparkline points={monthlyTrend} />}

          {/* 도매시장별 오늘 가격 */}
          {wholesale && wholesale.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-border-soft/60">
              <p className="text-[11.5px] font-semibold text-ink-soft mb-2">전국 도매시장 경락가</p>
              <div className="space-y-1.5">
                {wholesale.slice(0, 3).map((w) => (
                  <div key={w.county} className="flex items-baseline justify-between">
                    <span className="text-[12.5px] text-ink-soft">
                      {w.county}
                      {w.market ? ` · ${w.market}` : ''}
                    </span>
                    <span className="text-[12.5px] text-ink font-medium tabular-nums">
                      {w.price.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[10.5px] text-ink-soft/45 mt-3.5">
            KAMIS 농산물유통정보 · 서울 소매가 기준 · 조사일 {latest.date}
          </p>
        </div>
      </div>
    </section>
  );
}

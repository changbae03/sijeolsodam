'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface PriceAnalysis {
  displayName: string;
  latestPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  rank: number | null;
  totalDays: number;
  isAtLowestInPeriod: boolean;
}

export default function PriceAlertSection({ month }: { month: number }) {
  const [results, setResults] = useState<PriceAnalysis[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 월 변경 시 이전 결과를 초기화하고 새로 fetch하는 안전한 패턴
    setResults(null);
    setUnavailable(false);

    fetch(`/api/price-alert?month=${month}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.results || data.results.length === 0) {
          setUnavailable(true);
        } else {
          setResults(data.results);
        }
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });

    return () => {
      cancelled = true;
    };
  }, [month]);

  if (unavailable) return null;
  if (!results) return null;

  return (
    <section className="mb-7">
      <h2 className="font-display text-[17px] text-ink mb-1">이번 달 가격 소식</h2>
      <p className="text-[13px] text-ink-soft mb-3">
        최근 30일 서울 소매가 기준이에요 · 자료: KAMIS 농산물유통정보
      </p>
      <div className="space-y-2">
        {results.map((r, idx) => (
          <motion.div
            key={r.displayName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="bg-paper rounded-2xl border border-border-soft px-4 py-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-medium text-ink">{r.displayName}</span>
              {r.latestPrice !== null && (
                <span className="text-[15px] text-ink-soft tabular-nums">
                  {r.latestPrice.toLocaleString()}원/kg
                </span>
              )}
            </div>
            {r.minPrice !== null && r.maxPrice !== null && (
              <div className="mt-2">
                <PriceRangeBar min={r.minPrice} max={r.maxPrice} current={r.latestPrice} />
                {r.isAtLowestInPeriod ? (
                  <p className="text-[13px] text-terracotta mt-1.5">
                    최근 30일 중 가장 저렴한 가격이에요
                  </p>
                ) : (
                  <p className="text-[13px] text-ink-soft/80 mt-1.5">
                    최근 30일 평균 {r.avgPrice?.toLocaleString()}원 · 최저{' '}
                    {r.minPrice.toLocaleString()}원 ~ 최고 {r.maxPrice.toLocaleString()}원
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PriceRangeBar({
  min,
  max,
  current,
}: {
  min: number;
  max: number;
  current: number | null;
}) {
  if (current === null || max === min) return null;
  const position = ((current - min) / (max - min)) * 100;

  return (
    <div className="relative h-1.5 rounded-full bg-border-soft overflow-hidden">
      <div
        className="absolute top-0 h-full w-1 bg-terracotta rounded-full"
        style={{ left: `calc(${position}% - 2px)` }}
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { fetchPriceInsight, PriceInsight } from '@/lib/price-insight';
import { Badge } from '@/components/ui';

interface PriceBadgeProps {
  name: string;
  /** 'badge': 작은 배지 칩 (제철 탭 카드용) · 'line': 카드 하단 한 줄 문장 (홈용) */
  variant?: 'badge' | 'line';
}

const toneToBadgeVariant = {
  cheap: 'sage',
  expensive: 'terracotta',
  stable: 'cream',
} as const;

/**
 * 식재료 이름으로 가격 정보를 가져와 짧은 배지 또는 한 줄로 보여줍니다.
 * 데이터가 없으면(KAMIS 미연동 품목) 아무것도 표시하지 않습니다 — 빈 배지로 채우지 않음.
 * 차트/그래프는 절대 쓰지 않습니다.
 */
export default function PriceBadge({ name, variant = 'badge' }: PriceBadgeProps) {
  const [insight, setInsight] = useState<PriceInsight | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPriceInsight(name).then((result) => {
      if (!cancelled) setInsight(result);
    });
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (!insight) return null;

  if (variant === 'line') {
    // 홈: 눈에 띄게 저렴할 때만 한 줄 문장으로 (그렇지 않으면 굳이 보여주지 않음)
    if (insight.tone !== 'cheap' || insight.vsLastWeekPct === null) return null;
    return (
      <p className="text-[12px] text-sage-dark mt-1.5">
        지난주보다 {Math.abs(insight.vsLastWeekPct)}% 저렴해 지금 장보기 좋습니다.
      </p>
    );
  }

  return (
    <Badge variant={toneToBadgeVariant[insight.tone]} size="sm">
      {insight.badge}
    </Badge>
  );
}

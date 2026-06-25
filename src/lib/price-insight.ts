/**
 * 가격 인사이트 공용 모듈
 *
 * 시세 정보는 "보조 기능"입니다. 차트나 대시보드가 아니라,
 * 사람이 읽는 짧은 문장(배지, 한 줄 추천)으로만 노출합니다.
 * 홈/제철 탭/식재료 상세가 모두 이 모듈을 통해 같은 기준으로 계산합니다.
 */

export interface PriceInsight {
  /** 오늘 평균가 (원/kg 등 KAMIS 단위 그대로) */
  currentPrice: number;
  /** 지난주 대비 변동률(%). 양수=비싸짐, 음수=저렴해짐. 데이터 없으면 null */
  vsLastWeekPct: number | null;
  /** 지난달 대비 변동률(%) */
  vsLastMonthPct: number | null;
  /** 카드에 붙이는 짧은 배지 문구 */
  badge: string;
  /** 배지 색감 톤 */
  tone: 'cheap' | 'expensive' | 'stable';
  /** 식재료 상세용 한 줄 추천 */
  recommendation: string;
}

interface RawPriceResponse {
  available: boolean;
  comparison?: {
    latest: { price: number } | null;
    oneWeekAgo: { price: number } | null;
    oneMonthAgo: { price: number } | null;
  } | null;
}

function pctChange(latest: number, base: number | null): number | null {
  if (!base || base <= 0) return null;
  return Math.round(((latest - base) / base) * 100);
}

/** 변동률을 사람이 읽는 배지 문구로 변환 (차트/숫자 그래프 없이) */
function buildBadge(vsLastWeekPct: number | null): { badge: string; tone: PriceInsight['tone'] } {
  if (vsLastWeekPct === null) return { badge: '가격 안정', tone: 'stable' };
  if (vsLastWeekPct <= -3) return { badge: `지난주 대비 ${Math.abs(vsLastWeekPct)}% 저렴`, tone: 'cheap' };
  if (vsLastWeekPct >= 3) return { badge: '최근 가격 상승', tone: 'expensive' };
  return { badge: '가격 안정', tone: 'stable' };
}

function buildRecommendation(vsLastWeekPct: number | null, vsLastMonthPct: number | null): string {
  const ref = vsLastWeekPct ?? vsLastMonthPct;
  if (ref === null) return '평소와 비슷한 가격대예요.';
  if (ref <= -3) return '지금 구매하기 좋은 시기입니다.';
  if (ref >= 3) return '조금 기다렸다 사는 것도 괜찮아요.';
  return '평소와 비슷한 가격대예요.';
}

/** 식재료 이름으로 가격 인사이트를 가져옴. 데이터가 없으면 null. */
export async function fetchPriceInsight(name: string): Promise<PriceInsight | null> {
  try {
    const res = await fetch(`/api/ingredient-price?name=${encodeURIComponent(name)}`);
    const data: RawPriceResponse = await res.json();

    const latest = data?.comparison?.latest?.price;
    if (!data.available || latest == null) return null;

    const vsLastWeekPct = pctChange(latest, data.comparison?.oneWeekAgo?.price ?? null);
    const vsLastMonthPct = pctChange(latest, data.comparison?.oneMonthAgo?.price ?? null);
    const { badge, tone } = buildBadge(vsLastWeekPct);

    return {
      currentPrice: latest,
      vsLastWeekPct,
      vsLastMonthPct,
      badge,
      tone,
      recommendation: buildRecommendation(vsLastWeekPct, vsLastMonthPct),
    };
  } catch {
    return null;
  }
}

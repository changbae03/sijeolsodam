import { KamisItemMapping } from './kamis-mapping';

const KAMIS_BASE_URL = 'http://www.kamis.or.kr/service/price/xml.do';

/** 01: 소매, 02: 도매 (KAMIS 공식 코드. 흔히 헷갈리는 부분이라 명시적으로 둠) */
const PRODUCT_CLS = {
  RETAIL: '01',
  WHOLESALE: '02',
} as const;

/** 도매(경락) 데이터를 제공하는 KAMIS 공식 지역코드. 이 5곳 외 지역은 도매 데이터가 없음 */
export const WHOLESALE_COUNTY_CODES: { code: string; name: string }[] = [
  { code: '1101', name: '서울' },
  { code: '2100', name: '부산' },
  { code: '2200', name: '대구' },
  { code: '2401', name: '광주' },
  { code: '2501', name: '대전' },
];

interface KamisRawItem {
  itemname?: string | string[];
  kindname?: string | string[];
  countyname: string;
  marketname?: string | string[];
  yyyy: string;
  regday: string; // "MM/dd"
  price: string; // "1,234" 또는 "-"
}

interface KamisPeriodResponse {
  data?: {
    item?: KamisRawItem[];
    error_code?: string;
  };
}

export interface DailyPricePoint {
  date: string; // YYYY-MM-DD
  price: number | null;
  county: string;
  market: string | null;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toKamisDate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function parsePrice(raw: string): number | null {
  if (!raw || raw === '-' || raw.trim() === '') return null;
  const cleaned = raw.replace(/,/g, '').trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * KAMIS periodProductList를 호출해 일별 가격 배열을 받아옵니다.
 * county를 지정하면 그 지역만, 생략하면 "평균"(전국 평균) 행을 포함한 여러 행이 옵니다.
 * 실패 시 null (throw하지 않음 — 가격 정보는 부가 기능이라 화면을 깨면 안 됨).
 */
async function fetchPeriodPrices(params: {
  item: KamisItemMapping;
  startDay: Date;
  endDay: Date;
  productCls: '01' | '02';
  county?: string;
}): Promise<DailyPricePoint[] | null> {
  const certKey = process.env.KAMIS_CERT_KEY;
  const certId = process.env.KAMIS_CERT_ID;
  if (!certKey || !certId) return null;

  const { item, startDay, endDay, productCls, county } = params;

  const qs = new URLSearchParams({
    action: 'periodProductList',
    p_productclscode: productCls,
    p_startday: toKamisDate(startDay),
    p_endday: toKamisDate(endDay),
    p_itemcategorycode: item.itemCategoryCode,
    p_itemcode: item.itemCode,
    p_kindcode: item.kindCode,
    p_productrankcode: item.productRankCode || '04',
    p_convert_kg_yn: 'Y',
    p_cert_key: certKey,
    p_cert_id: certId,
    p_returntype: 'json',
  });
  if (county) qs.set('p_countycode', county);

  try {
    const res = await fetch(`${KAMIS_BASE_URL}?${qs.toString()}`, {
      next: { revalidate: 60 * 60 * 12 }, // 12시간 캐시 (일별 데이터라 자주 바뀌지 않음)
    });
    if (!res.ok) return null;

    const json: KamisPeriodResponse = await res.json();
    const rows = json?.data?.item;
    if (!Array.isArray(rows) || rows.length === 0) return null;

    return rows.map((r) => ({
      date: `${r.yyyy}-${r.regday.replace('/', '-')}`,
      price: parsePrice(r.price),
      county: r.countyname,
      market: Array.isArray(r.marketname) ? null : r.marketname || null,
    }));
  } catch (error) {
    console.error('[KAMIS] periodProductList error:', error);
    return null;
  }
}

/** 날짜 배열에서 targetDate와 가장 가까운 가격을 찾음 */
function findClosest(points: DailyPricePoint[], targetDate: Date): DailyPricePoint | null {
  const target = targetDate.getTime();
  let best: DailyPricePoint | null = null;
  let bestDiff = Infinity;
  for (const p of points) {
    if (p.price === null) continue;
    const diff = Math.abs(new Date(p.date).getTime() - target);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = p;
    }
  }
  return best;
}

export interface PriceComparison {
  displayName: string;
  unit: string;
  /** 가장 최근 조사일 가격 (보통 1~2일 지연) */
  latest: { date: string; price: number } | null;
  oneWeekAgo: { date: string; price: number } | null;
  oneMonthAgo: { date: string; price: number } | null;
  oneYearAgo: { date: string; price: number } | null;
}

/**
 * 전일(최근조사일)/1주일전/1개월전/1년전 가격 비교.
 * 서울 소매가 기준 (KAMIS 표준 기준 지역).
 */
export async function fetchPriceComparison(
  item: KamisItemMapping
): Promise<PriceComparison | null> {
  const today = new Date();
  const points = await fetchPeriodPrices({
    item,
    startDay: addDays(today, -380),
    endDay: today,
    productCls: PRODUCT_CLS.RETAIL,
    county: '1101', // 서울
  });
  if (!points) return null;

  const withPrice = points.filter((p) => p.price !== null);
  if (withPrice.length === 0) return null;

  const latestPoint = withPrice.reduce((a, b) => (a.date > b.date ? a : b));
  const latestDate = new Date(latestPoint.date);

  const week = findClosest(withPrice, addDays(latestDate, -7));
  const month = findClosest(withPrice, addDays(latestDate, -30));
  const year = findClosest(withPrice, addDays(latestDate, -365));

  return {
    displayName: item.displayName,
    unit: 'kg',
    latest:
      latestPoint.price !== null ? { date: latestPoint.date, price: latestPoint.price } : null,
    oneWeekAgo: week ? { date: week.date, price: week.price! } : null,
    oneMonthAgo: month ? { date: month.date, price: month.price! } : null,
    oneYearAgo: year ? { date: year.date, price: year.price! } : null,
  };
}

export interface NormalYearAverage {
  /** 최근 5개년 중 최고·최저를 제외한 3개년 평균값 */
  average: number | null;
  /** 계산에 사용된 연도별 가격 (참고용) */
  yearlyPrices: { year: number; price: number | null }[];
}

/**
 * 평년가: 최근 5개년, 오늘과 같은 월/일 기준 가격에서 최고·최저를 제외한 평균.
 * 해당 정확한 날짜에 데이터가 없으면(공휴일 등) ±3일 내 가장 가까운 값을 사용.
 */
export async function fetchNormalYearAverage(
  item: KamisItemMapping,
  referenceDate: Date = new Date()
): Promise<NormalYearAverage | null> {
  const certKey = process.env.KAMIS_CERT_KEY;
  if (!certKey) return null;

  const currentYear = referenceDate.getFullYear();
  const yearsToCheck = [1, 2, 3, 4, 5].map((n) => currentYear - n);

  const results = await Promise.all(
    yearsToCheck.map(async (year) => {
      const target = new Date(year, referenceDate.getMonth(), referenceDate.getDate());
      const points = await fetchPeriodPrices({
        item,
        startDay: addDays(target, -3),
        endDay: addDays(target, 3),
        productCls: PRODUCT_CLS.RETAIL,
        county: '1101',
      });
      if (!points) return { year, price: null };
      const closest = findClosest(points.filter((p) => p.price !== null), target);
      return { year, price: closest?.price ?? null };
    })
  );

  const validPrices = results.map((r) => r.price).filter((p): p is number => p !== null);

  if (validPrices.length < 3) {
    // 5개년 중 3개 미만이면 평년가 계산이 의미 없음
    return { average: null, yearlyPrices: results };
  }

  const sorted = [...validPrices].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1); // 최고/최저 1개씩 제외
  const average = Math.round(trimmed.reduce((a, b) => a + b, 0) / trimmed.length);

  return { average, yearlyPrices: results };
}

export interface WholesaleMarketPrice {
  county: string;
  market: string | null;
  date: string;
  price: number;
}

/**
 * 전국 주요 도매시장별 당일(최근) 도매 경락가격.
 * KAMIS 도매 데이터는 서울/부산/대구/광주/대전 5개 지역만 제공됨.
 */
export async function fetchWholesaleMarketsToday(
  item: KamisItemMapping
): Promise<WholesaleMarketPrice[] | null> {
  const today = new Date();

  const perCounty = await Promise.all(
    WHOLESALE_COUNTY_CODES.map(async ({ code }) => {
      const points = await fetchPeriodPrices({
        item,
        startDay: addDays(today, -5), // 주말/공휴일 대비 여유
        endDay: today,
        productCls: PRODUCT_CLS.WHOLESALE,
        county: code,
      });
      if (!points) return null;
      const withPrice = points.filter((p) => p.price !== null);
      if (withPrice.length === 0) return null;
      const latest = withPrice.reduce((a, b) => (a.date > b.date ? a : b));
      return {
        county: latest.county,
        market: latest.market,
        date: latest.date,
        price: latest.price!,
      };
    })
  );

  const results = perCounty.filter((r): r is WholesaleMarketPrice => r !== null);
  return results.length > 0 ? results : null;
}

export interface MonthlyTrendPoint {
  yearMonth: string; // YYYY-MM
  avgPrice: number | null;
}

/**
 * 품목별 월별 가격 흐름 (장기 추이). 서울 소매가 기준.
 * KAMIS 일별 데이터를 받아와 월별 평균으로 직접 집계함
 * (월별/연도별 전용 API는 응답 스펙이 문서화가 부족해 안정성을 위해 일별 데이터 집계 방식 사용).
 */
export async function fetchMonthlyTrend(
  item: KamisItemMapping,
  years = 3
): Promise<MonthlyTrendPoint[] | null> {
  const today = new Date();
  const points = await fetchPeriodPrices({
    item,
    startDay: addDays(today, -365 * years),
    endDay: today,
    productCls: PRODUCT_CLS.RETAIL,
    county: '1101',
  });
  if (!points) return null;

  const buckets = new Map<string, number[]>();
  for (const p of points) {
    if (p.price === null) continue;
    const ym = p.date.slice(0, 7); // YYYY-MM
    if (!buckets.has(ym)) buckets.set(ym, []);
    buckets.get(ym)!.push(p.price);
  }

  const result: MonthlyTrendPoint[] = Array.from(buckets.entries())
    .map(([yearMonth, prices]) => ({
      yearMonth,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));

  return result.length > 0 ? result : null;
}

export interface PriceAnalysis {
  displayName: string;
  latestPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  rank: number | null;
  totalDays: number;
  isAtLowestInPeriod: boolean;
}

/**
 * 최근 N일(기본 30일) 서울 소매가 추이 분석.
 * /api/price-alert (이번 달 가격 소식 섹션)에서 사용.
 */
export async function fetchKamisPriceAnalysis(
  item: KamisItemMapping,
  days = 30
): Promise<PriceAnalysis | null> {
  const today = new Date();
  const points = await fetchPeriodPrices({
    item,
    startDay: addDays(today, -days),
    endDay: today,
    productCls: PRODUCT_CLS.RETAIL,
    county: '1101',
  });
  if (!points) return null;

  const prices = points.map((p) => p.price).filter((p): p is number => p !== null);
  if (prices.length === 0) return null;

  const latestPrice = prices[prices.length - 1];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const sorted = [...prices].sort((a, b) => a - b);
  const rank = sorted.indexOf(latestPrice);

  return {
    displayName: item.displayName,
    latestPrice,
    minPrice,
    maxPrice,
    avgPrice,
    rank,
    totalDays: prices.length,
    isAtLowestInPeriod: latestPrice === minPrice,
  };
}

/**
 * 한 품목에 대한 모든 가격 정보를 한 번에 조회 (상세 화면용).
 * 일부가 실패해도 가능한 것만 채워서 반환함.
 */
export async function fetchFullPriceProfile(item: KamisItemMapping) {
  const [comparison, normalYear, wholesale, monthlyTrend] = await Promise.all([
    fetchPriceComparison(item),
    fetchNormalYearAverage(item),
    fetchWholesaleMarketsToday(item),
    fetchMonthlyTrend(item),
  ]);

  return { comparison, normalYear, wholesale, monthlyTrend };
}

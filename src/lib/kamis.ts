import { KamisItemMapping } from './kamis-mapping';

const KAMIS_BASE_URL = 'http://www.kamis.or.kr/service/price/xml.do';

interface KamisPriceRow {
  itemname: string;
  regday: string; // MM/dd 형식으로 내려옴
  price: string; // 쉼표 포함 문자열, "-"면 데이터 없음
}

interface PriceAnalysis {
  displayName: string;
  /** 오늘(최근) 가격 */
  latestPrice: number | null;
  /** 최근 30일 중 최저가 */
  minPrice: number | null;
  /** 최근 30일 중 최고가 */
  maxPrice: number | null;
  /** 최근 30일 평균가 */
  avgPrice: number | null;
  /** 오늘 가격이 30일 중 몇 번째로 싼지 (0 = 최저가) */
  rank: number | null;
  totalDays: number;
  isAtLowestInPeriod: boolean;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parsePrice(raw: string): number | null {
  if (!raw || raw === '-' || raw.trim() === '') return null;
  const cleaned = raw.replace(/,/g, '').trim();
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * KAMIS periodProductList(기간별 품목 가격) API를 호출해
 * 최근 30일 소매가 추이를 분석합니다.
 *
 * 인증 실패, 데이터 없음 등의 경우 null을 반환하며 throw하지 않습니다.
 * (가격 정보는 부가 기능이므로 실패해도 화면 전체가 깨지면 안 됩니다)
 */
export async function fetchKamisPriceAnalysis(
  item: KamisItemMapping,
  days = 30
): Promise<PriceAnalysis | null> {
  const certKey = process.env.KAMIS_CERT_KEY;
  const certId = process.env.KAMIS_CERT_ID;

  if (!certKey || !certId) {
    return null;
  }

  const endDay = new Date();
  const startDay = new Date();
  startDay.setDate(startDay.getDate() - days);

  const params = new URLSearchParams({
    action: 'periodProductList',
    p_productclscode: '02', // 02: 소매
    p_startday: formatDate(startDay),
    p_endday: formatDate(endDay),
    p_itemcategorycode: item.itemCategoryCode,
    p_itemcode: item.itemCode,
    p_kindcode: item.kindCode,
    p_productrankcode: item.productRankCode || '04',
    p_countrycode: '1101', // 서울
    p_convert_kg_yn: 'Y',
    p_cert_key: certKey,
    p_cert_id: certId,
    p_returntype: 'json',
  });

  try {
    const res = await fetch(`${KAMIS_BASE_URL}?${params.toString()}`, {
      // 가격 데이터는 자주 안 바뀌므로 캐싱
      next: { revalidate: 60 * 60 * 6 }, // 6시간
    });

    if (!res.ok) return null;

    const data = await res.json();
    const rows: KamisPriceRow[] = data?.data?.item ?? [];

    if (!Array.isArray(rows) || rows.length === 0) return null;

    const prices = rows
      .map((r) => parsePrice(r.price))
      .filter((p): p is number => p !== null);

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
  } catch (error) {
    console.error('KAMIS API error:', error);
    return null;
  }
}

export type { PriceAnalysis };

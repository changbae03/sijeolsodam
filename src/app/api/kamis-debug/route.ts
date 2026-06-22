import { NextResponse } from 'next/server';
import { kamisItemMappings } from '@/lib/kamis-mapping';

const KAMIS_BASE_URL = 'http://www.kamis.or.kr/service/price/xml.do';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
function fmt(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

async function testCombo(
  itemCategoryCode: string,
  itemCode: string,
  kindCode: string,
  certKey: string,
  certId: string
) {
  const today = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 10);

  const qs = new URLSearchParams({
    action: 'periodProductList',
    p_productclscode: '01', // 소매
    p_startday: fmt(start),
    p_endday: fmt(today),
    p_itemcategorycode: itemCategoryCode,
    p_itemcode: itemCode,
    p_kindcode: kindCode,
    p_productrankcode: '04',
    p_countycode: '1101',
    p_convert_kg_yn: 'Y',
    p_cert_key: certKey,
    p_cert_id: certId,
    p_returntype: 'json',
  });

  try {
    const res = await fetch(`${KAMIS_BASE_URL}?${qs.toString()}`, { cache: 'no-store' });
    const json = await res.json();
    const rows = json?.data?.item;
    if (!Array.isArray(rows) || rows.length === 0) {
      return { ok: false, errorCode: json?.data?.error_code ?? json?.error_code ?? 'EMPTY' };
    }
    const withPrice = rows.filter((r: { price?: string }) => r.price && r.price !== '-');
    if (withPrice.length === 0) {
      return { ok: false, errorCode: 'NO_PRICE_IN_RANGE', rowCount: rows.length };
    }
    const sample = withPrice[withPrice.length - 1];
    return {
      ok: true,
      sampleDate: `${sample.yyyy}-${sample.regday}`,
      samplePrice: sample.price,
      itemNameFromKamis: sample.itemname,
      kindNameFromKamis: sample.kindname,
    };
  } catch (e) {
    return { ok: false, errorCode: 'FETCH_ERROR', detail: String(e) };
  }
}

export async function GET() {
  const certKey = process.env.KAMIS_CERT_KEY;
  const certId = process.env.KAMIS_CERT_ID;

  if (!certKey || !certId) {
    return NextResponse.json({ error: 'KAMIS_CERT_KEY/KAMIS_CERT_ID가 설정되어 있지 않습니다.' });
  }

  const candidateKindCodes = ['00', '01', '02', '03', '04', '05'];

  const results = await Promise.all(
    kamisItemMappings.map(async (item) => {
      const currentResult = await testCombo(
        item.itemCategoryCode,
        item.itemCode,
        item.kindCode,
        certKey,
        certId
      );

      let workingAlternatives: { kindCode: string; result: Awaited<ReturnType<typeof testCombo>> }[] = [];
      if (!currentResult.ok) {
        const altResults = await Promise.all(
          candidateKindCodes
            .filter((k) => k !== item.kindCode)
            .map(async (k) => ({
              kindCode: k,
              result: await testCombo(item.itemCategoryCode, item.itemCode, k, certKey, certId),
            }))
        );
        workingAlternatives = altResults.filter((r) => r.result.ok);
      }

      return {
        displayName: item.displayName,
        itemCategoryCode: item.itemCategoryCode,
        itemCode: item.itemCode,
        currentKindCode: item.kindCode,
        currentResult,
        workingAlternativeKindCodes: workingAlternatives,
      };
    })
  );

  return NextResponse.json({ results }, { headers: { 'Cache-Control': 'no-store' } });
}

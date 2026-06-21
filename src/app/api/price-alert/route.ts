import { NextRequest, NextResponse } from 'next/server';
import { getKamisMappingForMonth } from '@/lib/kamis-mapping';
import { fetchKamisPriceAnalysis } from '@/lib/kamis';

export async function GET(request: NextRequest) {
  const monthParam = request.nextUrl.searchParams.get('month');
  const month = monthParam ? Number(monthParam) : new Date().getMonth() + 1;

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: '유효하지 않은 월입니다.' }, { status: 400 });
  }

  const items = getKamisMappingForMonth(month);

  if (items.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const results = await Promise.all(
    items.map(async (item) => {
      const analysis = await fetchKamisPriceAnalysis(item);
      return analysis;
    })
  );

  const validResults = results.filter((r) => r !== null);

  return NextResponse.json({ results: validResults });
}

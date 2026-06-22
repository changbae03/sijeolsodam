import { NextRequest, NextResponse } from 'next/server';
import { getKamisMappingByName } from '@/lib/kamis-mapping';
import { fetchFullPriceProfile } from '@/lib/kamis';

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'name 파라미터가 필요합니다.' }, { status: 400 });
  }

  const mapping = getKamisMappingByName(name);

  if (!mapping) {
    // 해산물 등 KAMIS가 다루지 않는 품목, 혹은 매핑이 아직 없는 품목
    return NextResponse.json({ available: false });
  }

  const profile = await fetchFullPriceProfile(mapping);

  return NextResponse.json({
    available: true,
    displayName: mapping.displayName,
    ...profile,
  });
}

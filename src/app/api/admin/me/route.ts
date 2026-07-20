import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin';

/**
 * 관리자 여부만 확인하는 가벼운 엔드포인트.
 * 대시보드 데이터를 부르지 않고도 UI에서 운영 메뉴 노출을 결정할 수 있게 한다.
 * (실제 권한 검사는 각 관리자 API에서 다시 하므로 이 응답은 표시용일 뿐이다)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({ isAdmin: isAdminRequest(request) });
}

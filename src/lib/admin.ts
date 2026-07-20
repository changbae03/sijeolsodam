import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

/**
 * 관리자 판별.
 *
 * 별도 권한 테이블 대신 환경변수 허용 목록(ADMIN_EMAILS)을 쓴다.
 * 운영자가 한두 명인 단계에서는 이 방식이 가장 단순하고, DB가 뚫려도
 * 권한이 함께 넘어가지 않는다는 장점이 있다.
 *   Vercel 환경변수 예: ADMIN_EMAILS=me@example.com,other@example.com
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminRequest(request: NextRequest): boolean {
  const user = getUserFromRequest(request);
  if (!user) return false;
  const allowed = getAdminEmails();
  if (allowed.length === 0) return false; // 미설정 시 아무도 관리자가 아니다 (안전한 기본값)
  return allowed.includes(user.email.toLowerCase());
}

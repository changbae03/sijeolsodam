import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const payload = getUserFromRequest(request);

  if (!payload) {
    return NextResponse.json({ user: null });
  }

  try {
    let result;
    try {
      result = await sql`
        SELECT id, email, name, avatar_url, bio, onboarded_at FROM users WHERE id = ${payload.userId}
      `;
    } catch {
      // onboarded_at 컬럼이 아직 없는 초기 DB면 생성 후 재시도 (지연 마이그레이션)
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMP`;
      result = await sql`
        SELECT id, email, name, avatar_url, bio, onboarded_at FROM users WHERE id = ${payload.userId}
      `;
    }

    if (result.length === 0) {
      return NextResponse.json({ user: null });
    }

    const u = result[0];
    return NextResponse.json({
      user: {
        id: u.id,
        email: u.email,
        name: u.name,
        avatarUrl: u.avatar_url,
        bio: u.bio,
        onboardedAt: u.onboarded_at,
      },
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ user: null });
  }
}

export async function DELETE() {
  // 로그아웃: 쿠키 제거
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}

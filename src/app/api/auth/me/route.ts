import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const payload = getUserFromRequest(request);

  if (!payload) {
    return NextResponse.json({ user: null });
  }

  try {
    const result = await sql`
      SELECT id, email, name FROM users WHERE id = ${payload.userId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: result[0] });
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

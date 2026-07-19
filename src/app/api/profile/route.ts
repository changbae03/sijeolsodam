import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/** 닉네임 변경. 커뮤니티에 표시되는 이름이라 길이·중복 정도만 가볍게 검증한다. */
export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { name } = (await request.json()) as { name?: string };
    const trimmed = (name ?? '').trim();

    if (trimmed.length < 2 || trimmed.length > 12) {
      return NextResponse.json({ error: '닉네임은 2~12자로 지어주세요.' }, { status: 400 });
    }
    if (/[<>/\\]/.test(trimmed)) {
      return NextResponse.json({ error: '사용할 수 없는 문자가 있어요.' }, { status: 400 });
    }

    const taken = (await sql`
      SELECT 1 FROM users WHERE name = ${trimmed} AND id <> ${user.userId} LIMIT 1
    `) as unknown[];
    if (taken.length > 0) {
      return NextResponse.json({ error: '이미 쓰고 있는 닉네임이에요.' }, { status: 409 });
    }

    await sql`UPDATE users SET name = ${trimmed} WHERE id = ${user.userId}`;
    return NextResponse.json({ name: trimmed });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: '닉네임을 바꾸지 못했어요.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/** 프로필 컬럼 지연 마이그레이션 (멱등) */
async function ensureProfileColumns() {
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarded_at TIMESTAMP`;
}

/**
 * 프로필 수정 — 닉네임·프로필 사진·한 줄 소개.
 * 전달된 필드만 바꾼다(부분 수정).
 */
export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    await ensureProfileColumns();
    const { name, avatarUrl, bio, onboarded } = (await request.json()) as {
      name?: string;
      avatarUrl?: string | null;
      bio?: string;
      onboarded?: boolean;
    };

    if (name !== undefined) {
      const trimmed = name.trim();
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
    }

    if (avatarUrl !== undefined) {
      await sql`UPDATE users SET avatar_url = ${avatarUrl} WHERE id = ${user.userId}`;
    }

    if (bio !== undefined) {
      const trimmedBio = bio.trim().slice(0, 60);
      await sql`UPDATE users SET bio = ${trimmedBio} WHERE id = ${user.userId}`;
    }

    if (onboarded === true) {
      // 이미 값이 있으면 덮어쓰지 않음 (최초 완료 시각 유지)
      await sql`UPDATE users SET onboarded_at = NOW() WHERE id = ${user.userId} AND onboarded_at IS NULL`;
    }

    const rows = (await sql`
      SELECT id, email, name, avatar_url, bio FROM users WHERE id = ${user.userId}
    `) as { id: number; email: string; name: string | null; avatar_url: string | null; bio: string | null }[];
    const me = rows[0];
    return NextResponse.json({
      name: me?.name,
      avatarUrl: me?.avatar_url,
      bio: me?.bio,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: '닉네임을 바꾸지 못했어요.' }, { status: 500 });
  }
}

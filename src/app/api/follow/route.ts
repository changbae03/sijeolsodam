import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/**
 * 팔로우.
 *
 * GET    /api/follow?userId=  -> { followers, following, isFollowing }
 * POST   /api/follow          -> 팔로우 (body: { userId })
 * DELETE /api/follow?userId=  -> 언팔로우
 */

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS follows (
      id SERIAL PRIMARY KEY,
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (follower_id, following_id)
    )
  `;
}

export async function GET(request: NextRequest) {
  const target = Number(request.nextUrl.searchParams.get('userId'));
  if (!target) {
    return NextResponse.json({ error: 'userId가 필요해요.' }, { status: 400 });
  }

  try {
    await ensureTable();
    const viewer = getUserFromRequest(request);

    const counts = (await sql`
      SELECT
        (SELECT COUNT(*)::int FROM follows WHERE following_id = ${target}) AS followers,
        (SELECT COUNT(*)::int FROM follows WHERE follower_id = ${target}) AS following
    `) as { followers: number; following: number }[];

    let isFollowing = false;
    if (viewer && viewer.userId !== target) {
      const rows = (await sql`
        SELECT 1 FROM follows
        WHERE follower_id = ${viewer.userId} AND following_id = ${target}
        LIMIT 1
      `) as unknown[];
      isFollowing = rows.length > 0;
    }

    return NextResponse.json({
      followers: counts[0]?.followers ?? 0,
      following: counts[0]?.following ?? 0,
      isFollowing,
    });
  } catch (error) {
    console.error('Get follow error:', error);
    return NextResponse.json({ followers: 0, following: 0, isFollowing: false });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { userId } = (await request.json()) as { userId?: number };
    const target = Number(userId);
    if (!target) {
      return NextResponse.json({ error: 'userId가 필요해요.' }, { status: 400 });
    }
    if (target === user.userId) {
      return NextResponse.json({ error: '자기 자신은 팔로우할 수 없어요.' }, { status: 400 });
    }

    await ensureTable();
    await sql`
      INSERT INTO follows (follower_id, following_id)
      VALUES (${user.userId}, ${target})
      ON CONFLICT (follower_id, following_id) DO NOTHING
    `;
    return NextResponse.json({ isFollowing: true });
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json({ error: '팔로우하지 못했어요.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const target = Number(request.nextUrl.searchParams.get('userId'));
    if (!target) {
      return NextResponse.json({ error: 'userId가 필요해요.' }, { status: 400 });
    }

    await ensureTable();
    await sql`
      DELETE FROM follows
      WHERE follower_id = ${user.userId} AND following_id = ${target}
    `;
    return NextResponse.json({ isFollowing: false });
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ error: '언팔로우하지 못했어요.' }, { status: 500 });
  }
}

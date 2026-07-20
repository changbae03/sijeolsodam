import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/**
 * "만들었어요" 기록.
 *
 * 즐겨찾기(= 하고 싶다)와 다른 축의 신호로, 혼자 써도 요리 기록이 되고
 * 사람이 늘면 그대로 "N명이 만들었어요"라는 사회적 증거가 된다.
 *
 * GET  /api/cooked?recipeId=...  -> { count, cooked }  (count는 임계치 미만이면 0으로 숨김)
 * POST /api/cooked               -> 기록 추가 (같은 레시피 중복 기록은 무시)
 */

/** 이 수 미만이면 카운트를 노출하지 않는다. "0명이 만들었어요"는 안 보여주는 게 낫다. */
const DISPLAY_THRESHOLD = 3;

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS cooked_records (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      recipe_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, recipe_id)
    )
  `;
}

export async function GET(request: NextRequest) {
  const mine = request.nextUrl.searchParams.get('mine');

  // 마이페이지용: 내가 만들었다고 기록한 레시피 목록 (최신순)
  if (mine) {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ recipeIds: [] });
    try {
      await ensureTable();
      const rows = (await sql`
        SELECT recipe_id
        FROM cooked_records
        WHERE user_id = ${user.userId}
        ORDER BY created_at DESC
        LIMIT 50
      `) as { recipe_id: string }[];
      return NextResponse.json({ recipeIds: rows.map((r) => r.recipe_id) });
    } catch (error) {
      console.error('Get my cooked error:', error);
      return NextResponse.json({ recipeIds: [] });
    }
  }

  const recipeId = request.nextUrl.searchParams.get('recipeId');
  if (!recipeId) {
    return NextResponse.json({ error: 'recipeId가 필요해요.' }, { status: 400 });
  }

  try {
    await ensureTable();
    const user = getUserFromRequest(request);

    const rows = (await sql`
      SELECT COUNT(*)::int AS count
      FROM cooked_records
      WHERE recipe_id = ${recipeId}
    `) as { count: number }[];
    const total = rows[0]?.count ?? 0;

    let cooked = false;
    if (user) {
      const mine = (await sql`
        SELECT 1 FROM cooked_records
        WHERE recipe_id = ${recipeId} AND user_id = ${user.userId}
        LIMIT 1
      `) as unknown[];
      cooked = mine.length > 0;
    }

    return NextResponse.json({
      // 임계치 미만이면 숨김 — 초기의 '0명' 노출이 앱을 비어 보이게 만든다
      count: total >= DISPLAY_THRESHOLD ? total : 0,
      cooked,
    });
  } catch (error) {
    console.error('Get cooked error:', error);
    return NextResponse.json({ count: 0, cooked: false });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { recipeId } = (await request.json()) as { recipeId?: string };
    if (!recipeId) {
      return NextResponse.json({ error: 'recipeId가 필요해요.' }, { status: 400 });
    }

    await ensureTable();
    await sql`
      INSERT INTO cooked_records (user_id, recipe_id)
      VALUES (${user.userId}, ${recipeId})
      ON CONFLICT (user_id, recipe_id) DO NOTHING
    `;

    return NextResponse.json({ cooked: true });
  } catch (error) {
    console.error('Post cooked error:', error);
    return NextResponse.json({ error: '기록하지 못했어요.' }, { status: 500 });
  }
}

/** 만들었어요 취소 — 잘못 눌렀을 때 되돌릴 수 있어야 한다 */
export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  const recipeId = request.nextUrl.searchParams.get('recipeId');
  if (!recipeId) {
    return NextResponse.json({ error: 'recipeId가 필요해요.' }, { status: 400 });
  }

  try {
    await ensureTable();
    await sql`
      DELETE FROM cooked_records
      WHERE user_id = ${user.userId} AND recipe_id = ${recipeId}
    `;
    return NextResponse.json({ cooked: false });
  } catch (error) {
    console.error('Delete cooked error:', error);
    return NextResponse.json({ error: '취소하지 못했어요.' }, { status: 500 });
  }
}

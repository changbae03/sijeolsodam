import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/**
 * 마이페이지용 조회 요약.
 * - recipeIds: 최근에 본 레시피 (중복 제거, 최신순 12개)
 * - totalViewed: 지금까지 둘러본 레시피 수 (중복 제거)
 * - topIngredients: 자주 찾은 재료 상위 6개
 */
export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const recent = (await sql`
      SELECT recipe_id, MAX(created_at) AS last_viewed
      FROM recipe_views
      WHERE user_id = ${user.userId}
      GROUP BY recipe_id
      ORDER BY last_viewed DESC
      LIMIT 12
    `) as { recipe_id: string }[];

    const total = (await sql`
      SELECT COUNT(DISTINCT recipe_id) AS count
      FROM recipe_views
      WHERE user_id = ${user.userId}
    `) as { count: string | number }[];

    const top = (await sql`
      SELECT main_ingredient, COUNT(*) AS views
      FROM recipe_views
      WHERE user_id = ${user.userId} AND main_ingredient IS NOT NULL
      GROUP BY main_ingredient
      ORDER BY views DESC
      LIMIT 6
    `) as { main_ingredient: string }[];

    return NextResponse.json({
      recipeIds: recent.map((r) => r.recipe_id),
      totalViewed: Number(total[0]?.count ?? 0),
      topIngredients: top.map((t) => t.main_ingredient),
    });
  } catch (error) {
    console.error('Get recipe views error:', error);
    return NextResponse.json({ error: '조회 기록을 불러오지 못했어요.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  // 로그인 안 한 방문자는 조용히 무시 (에러 아님) — 개인화는 로그인 유저 대상 기능이라서.
  if (!user) {
    return NextResponse.json({ logged: false });
  }

  try {
    const { recipeId, mainIngredient } = (await request.json()) as {
      recipeId?: string;
      mainIngredient?: string;
    };
    if (!recipeId) {
      return NextResponse.json({ error: '레시피 정보가 없어요.' }, { status: 400 });
    }

    await sql`
      INSERT INTO recipe_views (user_id, recipe_id, main_ingredient)
      VALUES (${user.userId}, ${recipeId}, ${mainIngredient ?? null})
    `;

    return NextResponse.json({ logged: true });
  } catch (error) {
    console.error('Log recipe view error:', error);
    // 조회 기록 저장은 부가 기능이라 실패해도 사용자 경험을 막지 않도록 200으로 조용히 응답
    return NextResponse.json({ logged: false });
  }
}

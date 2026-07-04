import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

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

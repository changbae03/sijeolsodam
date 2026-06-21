import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const result = await sql`
      SELECT recipe_id FROM favorites WHERE user_id = ${user.userId} ORDER BY created_at DESC
    `;
    return NextResponse.json({ recipeIds: result.map((r) => r.recipe_id) });
  } catch (error) {
    console.error('Get favorites error:', error);
    return NextResponse.json({ error: '즐겨찾기를 불러오지 못했어요.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { recipeId } = await request.json();
    if (!recipeId) {
      return NextResponse.json({ error: '레시피 ID가 필요해요.' }, { status: 400 });
    }

    await sql`
      INSERT INTO favorites (user_id, recipe_id)
      VALUES (${user.userId}, ${recipeId})
      ON CONFLICT (user_id, recipe_id) DO NOTHING
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json({ error: '즐겨찾기 추가에 실패했어요.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { recipeId } = await request.json();
    if (!recipeId) {
      return NextResponse.json({ error: '레시피 ID가 필요해요.' }, { status: 400 });
    }

    await sql`
      DELETE FROM favorites WHERE user_id = ${user.userId} AND recipe_id = ${recipeId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json({ error: '즐겨찾기 삭제에 실패했어요.' }, { status: 500 });
  }
}

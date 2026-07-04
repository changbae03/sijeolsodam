import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

const PAGE_SIZE = 30;

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        ur.id, ur.title, ur.main_ingredient, ur.description,
        ur.ingredients_text, ur.steps_text, ur.image_url, ur.created_at,
        u.name AS author_name
      FROM user_recipes ur
      JOIN users u ON u.id = ur.user_id
      ORDER BY ur.created_at DESC
      LIMIT ${PAGE_SIZE}
    `;

    return NextResponse.json({
      recipes: rows.map((r) => ({
        id: r.id,
        title: r.title,
        mainIngredient: r.main_ingredient,
        description: r.description,
        ingredientsText: r.ingredients_text,
        stepsText: r.steps_text,
        imageUrl: r.image_url,
        createdAt: r.created_at,
        authorName: r.author_name || '이웃',
      })),
    });
  } catch (error) {
    console.error('Get user recipes error:', error);
    return NextResponse.json({ error: '레시피를 불러오지 못했어요.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { title, mainIngredient, description, ingredientsText, stepsText, imageUrl } =
      (await request.json()) as {
        title?: string;
        mainIngredient?: string;
        description?: string;
        ingredientsText?: string;
        stepsText?: string;
        imageUrl?: string;
      };

    const cleanTitle = (title ?? '').trim();
    const cleanIngredients = (ingredientsText ?? '').trim();
    const cleanSteps = (stepsText ?? '').trim();

    if (!cleanTitle || !cleanIngredients || !cleanSteps) {
      return NextResponse.json(
        { error: '레시피 이름, 재료, 만드는 순서는 꼭 채워주세요.' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO user_recipes (user_id, title, main_ingredient, description, ingredients_text, steps_text, image_url)
      VALUES (
        ${user.userId},
        ${cleanTitle.slice(0, 200)},
        ${(mainIngredient ?? '').trim().slice(0, 50) || null},
        ${(description ?? '').trim().slice(0, 1000) || null},
        ${cleanIngredients.slice(0, 3000)},
        ${cleanSteps.slice(0, 5000)},
        ${imageUrl ?? null}
      )
      RETURNING id, created_at
    `;

    return NextResponse.json({ success: true, id: result[0].id, createdAt: result[0].created_at });
  } catch (error) {
    console.error('Create user recipe error:', error);
    return NextResponse.json({ error: '레시피를 올리지 못했어요.' }, { status: 500 });
  }
}

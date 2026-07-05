import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT id, message, reply, matched_ingredient, created_at
      FROM agent_queries
      WHERE user_id = ${user.userId} AND reply IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({
      queries: rows.map((r) => ({
        id: r.id,
        message: r.message,
        reply: r.reply,
        matchedIngredient: r.matched_ingredient,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('Get agent queries error:', error);
    return NextResponse.json({ error: '대화 내역을 불러오지 못했어요.' }, { status: 500 });
  }
}

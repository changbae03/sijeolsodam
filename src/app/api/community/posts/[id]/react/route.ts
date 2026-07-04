import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: '잘못된 게시물이에요.' }, { status: 400 });
  }

  try {
    const existing = await sql`
      SELECT id FROM post_reactions WHERE post_id = ${postId} AND user_id = ${user.userId}
    `;

    let reacted: boolean;
    if (existing.length > 0) {
      await sql`DELETE FROM post_reactions WHERE post_id = ${postId} AND user_id = ${user.userId}`;
      reacted = false;
    } else {
      await sql`
        INSERT INTO post_reactions (post_id, user_id) VALUES (${postId}, ${user.userId})
        ON CONFLICT (post_id, user_id) DO NOTHING
      `;
      reacted = true;
    }

    const countRows = await sql`SELECT COUNT(*)::int AS count FROM post_reactions WHERE post_id = ${postId}`;

    return NextResponse.json({ reacted, reactionCount: countRows[0].count });
  } catch (error) {
    console.error('Toggle reaction error:', error);
    return NextResponse.json({ error: '반응을 남기지 못했어요.' }, { status: 500 });
  }
}

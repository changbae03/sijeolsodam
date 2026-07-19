import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/**
 * 내가 쓴 게시물 수정·삭제.
 * 두 동작 모두 작성자 본인만 가능하며, 소유권은 SQL 조건(user_id)으로 강제한다.
 */

async function assertOwner(postId: number, userId: number): Promise<boolean> {
  const rows = (await sql`
    SELECT 1 FROM posts WHERE id = ${postId} AND user_id = ${userId} LIMIT 1
  `) as unknown[];
  return rows.length > 0;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (!postId) {
    return NextResponse.json({ error: '잘못된 요청이에요.' }, { status: 400 });
  }

  try {
    if (!(await assertOwner(postId, user.userId))) {
      return NextResponse.json({ error: '내가 쓴 글만 수정할 수 있어요.' }, { status: 403 });
    }

    const { caption, hashtags } = (await request.json()) as {
      caption?: string;
      hashtags?: string[];
    };

    const nextCaption = (caption ?? '').trim().slice(0, 500);
    const nextHashtags = Array.isArray(hashtags)
      ? hashtags.map((h) => h.trim().replace(/^#/, '')).filter(Boolean).slice(0, 10)
      : [];

    await sql`
      UPDATE posts
      SET caption = ${nextCaption}, hashtags = ${nextHashtags}
      WHERE id = ${postId} AND user_id = ${user.userId}
    `;

    return NextResponse.json({ caption: nextCaption, hashtags: nextHashtags });
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json({ error: '글을 수정하지 못했어요.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  const { id } = await params;
  const postId = Number(id);
  if (!postId) {
    return NextResponse.json({ error: '잘못된 요청이에요.' }, { status: 400 });
  }

  try {
    if (!(await assertOwner(postId, user.userId))) {
      return NextResponse.json({ error: '내가 쓴 글만 삭제할 수 있어요.' }, { status: 403 });
    }

    // 자식 데이터부터 정리 (댓글·반응이 남아 고아가 되지 않게)
    await sql`DELETE FROM post_reactions WHERE post_id = ${postId}`;
    await sql`DELETE FROM post_comments WHERE post_id = ${postId}`;
    await sql`DELETE FROM posts WHERE id = ${postId} AND user_id = ${user.userId}`;

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: '글을 삭제하지 못했어요.' }, { status: 500 });
  }
}

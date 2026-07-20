import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) {
    return NextResponse.json({ error: '잘못된 게시물이에요.' }, { status: 400 });
  }

  try {
    const rows = await sql`
      SELECT c.id, c.body, c.created_at, u.id AS author_id, u.name AS author_name
      FROM post_comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ${postId}
      ORDER BY c.created_at ASC
      LIMIT 100
    `;

    return NextResponse.json({
      comments: rows.map((r) => ({
        id: r.id,
        body: r.body,
        createdAt: r.created_at,
        authorId: r.author_id,
        authorName: r.author_name || '이웃',
      })),
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ error: '댓글을 불러오지 못했어요.' }, { status: 500 });
  }
}

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
    const { body } = (await request.json()) as { body?: string };
    const trimmed = (body ?? '').trim();
    if (!trimmed) {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }
    if (trimmed.length > 500) {
      return NextResponse.json({ error: '댓글은 500자 이내로 남겨주세요.' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO post_comments (post_id, user_id, body)
      VALUES (${postId}, ${user.userId}, ${trimmed})
      RETURNING id, created_at
    `;

    return NextResponse.json({
      id: result[0].id,
      body: trimmed,
      createdAt: result[0].created_at,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: '댓글을 남기지 못했어요.' }, { status: 500 });
  }
}

/** 내 댓글 수정 — 소유권은 SQL 조건으로 강제 */
export async function PATCH(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { commentId, body } = (await request.json()) as { commentId?: number; body?: string };
    const text = (body ?? '').trim();
    if (!commentId || text.length === 0) {
      return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
    }

    const rows = (await sql`
      UPDATE post_comments
      SET body = ${text.slice(0, 500)}
      WHERE id = ${commentId} AND user_id = ${user.userId}
      RETURNING id, body
    `) as { id: number; body: string }[];

    if (rows.length === 0) {
      return NextResponse.json({ error: '내가 쓴 댓글만 수정할 수 있어요.' }, { status: 403 });
    }
    return NextResponse.json({ id: rows[0].id, body: rows[0].body });
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json({ error: '댓글을 수정하지 못했어요.' }, { status: 500 });
  }
}

/** 내 댓글 삭제 */
export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  const commentId = Number(request.nextUrl.searchParams.get('commentId'));
  if (!commentId) {
    return NextResponse.json({ error: 'commentId가 필요해요.' }, { status: 400 });
  }

  try {
    const rows = (await sql`
      DELETE FROM post_comments
      WHERE id = ${commentId} AND user_id = ${user.userId}
      RETURNING id
    `) as { id: number }[];

    if (rows.length === 0) {
      return NextResponse.json({ error: '내가 쓴 댓글만 삭제할 수 있어요.' }, { status: 403 });
    }
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: '댓글을 삭제하지 못했어요.' }, { status: 500 });
  }
}

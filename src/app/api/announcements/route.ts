import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin';

/**
 * 공지사항.
 *
 * 커뮤니티가 열리면 "점검 안내", "이런 기능이 생겼어요" 같은 이야기를
 * 운영자가 전할 자리가 필요하다. 게시물과 섞이면 묻히므로 피드 맨 위에 고정한다.
 *
 * GET    /api/announcements        -> 노출 중인 공지 (모두)
 * POST   /api/announcements        -> 공지 등록 (관리자)
 * DELETE /api/announcements?id=    -> 공지 내리기 (관리자)
 */

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = (await sql`
      SELECT id, title, body, created_at
      FROM announcements
      ORDER BY created_at DESC
      LIMIT 5
    `) as { id: number; title: string; body: string | null; created_at: string }[];

    return NextResponse.json({
      announcements: rows.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    return NextResponse.json({ announcements: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: '권한이 없어요.' }, { status: 403 });
  }

  try {
    const { title, body } = (await request.json()) as { title?: string; body?: string };
    const t = (title ?? '').trim();
    if (t.length === 0) {
      return NextResponse.json({ error: '제목을 입력해주세요.' }, { status: 400 });
    }

    await ensureTable();
    const rows = (await sql`
      INSERT INTO announcements (title, body)
      VALUES (${t.slice(0, 100)}, ${(body ?? '').trim().slice(0, 1000) || null})
      RETURNING id, title, body, created_at
    `) as { id: number; title: string; body: string | null; created_at: string }[];

    const a = rows[0];
    return NextResponse.json({
      announcement: { id: a.id, title: a.title, body: a.body, createdAt: a.created_at },
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: '공지를 등록하지 못했어요.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: '권한이 없어요.' }, { status: 403 });
  }

  const id = Number(request.nextUrl.searchParams.get('id'));
  if (!id) {
    return NextResponse.json({ error: 'id가 필요해요.' }, { status: 400 });
  }

  try {
    await ensureTable();
    await sql`DELETE FROM announcements WHERE id = ${id}`;
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: '삭제하지 못했어요.' }, { status: 500 });
  }
}

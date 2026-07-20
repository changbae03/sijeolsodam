import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin';
import { ensureInquiryTable } from '@/app/api/inquiries/route';

/**
 * 운영자용 문의 처리.
 *
 * GET   /api/admin/inquiries -> 전체 문의 (미답변 먼저)
 * PATCH /api/admin/inquiries -> 답변 등록 { id, reply }
 */

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: '권한이 없어요.' }, { status: 403 });
  }

  try {
    await ensureInquiryTable();
    const rows = (await sql`
      SELECT i.id, i.body, i.reply, i.replied_at, i.created_at,
             u.id AS user_id, u.name AS user_name, u.email AS user_email
      FROM inquiries i
      JOIN users u ON u.id = i.user_id
      ORDER BY (i.reply IS NULL) DESC, i.created_at DESC
      LIMIT 100
    `) as {
      id: number;
      body: string;
      reply: string | null;
      replied_at: string | null;
      created_at: string;
      user_id: number;
      user_name: string | null;
      user_email: string;
    }[];

    return NextResponse.json({
      inquiries: rows.map((r) => ({
        id: r.id,
        body: r.body,
        reply: r.reply,
        repliedAt: r.replied_at,
        createdAt: r.created_at,
        userId: r.user_id,
        userName: r.user_name,
        userEmail: r.user_email,
      })),
    });
  } catch (error) {
    console.error('Admin inquiries error:', error);
    return NextResponse.json({ inquiries: [] });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: '권한이 없어요.' }, { status: 403 });
  }

  try {
    const { id, reply } = (await request.json()) as { id?: number; reply?: string };
    const text = (reply ?? '').trim();
    if (!id || text.length === 0) {
      return NextResponse.json({ error: '답변 내용을 입력해주세요.' }, { status: 400 });
    }

    await ensureInquiryTable();
    await sql`
      UPDATE inquiries
      SET reply = ${text.slice(0, 2000)}, replied_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ replied: true });
  } catch (error) {
    console.error('Reply inquiry error:', error);
    return NextResponse.json({ error: '답변을 저장하지 못했어요.' }, { status: 500 });
  }
}

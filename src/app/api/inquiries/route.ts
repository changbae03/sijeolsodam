import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/**
 * 앱 안에서 주고받는 문의.
 *
 * 메일로 받으면 사용자는 답이 왔는지 앱을 떠나서 확인해야 하고, 운영자는
 * 어떤 계정의 문의인지 매번 대조해야 한다. 문의와 답변을 앱 안에 두면
 * 양쪽 모두 맥락이 붙은 채로 이어진다.
 *
 * GET  /api/inquiries -> 내 문의 목록 (답변 포함)
 * POST /api/inquiries -> 문의 등록
 */

export async function ensureInquiryTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      body TEXT NOT NULL,
      reply TEXT,
      replied_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    await ensureInquiryTable();
    const rows = (await sql`
      SELECT id, body, reply, replied_at, created_at
      FROM inquiries
      WHERE user_id = ${user.userId}
      ORDER BY created_at DESC
      LIMIT 30
    `) as {
      id: number;
      body: string;
      reply: string | null;
      replied_at: string | null;
      created_at: string;
    }[];

    return NextResponse.json({
      inquiries: rows.map((r) => ({
        id: r.id,
        body: r.body,
        reply: r.reply,
        repliedAt: r.replied_at,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    return NextResponse.json({ inquiries: [] });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { body } = (await request.json()) as { body?: string };
    const text = (body ?? '').trim();
    if (text.length < 5) {
      return NextResponse.json({ error: '문의 내용을 조금만 더 적어주세요.' }, { status: 400 });
    }
    if (text.length > 1000) {
      return NextResponse.json({ error: '1000자 이내로 적어주세요.' }, { status: 400 });
    }

    await ensureInquiryTable();
    const rows = (await sql`
      INSERT INTO inquiries (user_id, body)
      VALUES (${user.userId}, ${text})
      RETURNING id, body, created_at
    `) as { id: number; body: string; created_at: string }[];

    const created = rows[0];
    return NextResponse.json({
      inquiry: {
        id: created.id,
        body: created.body,
        reply: null,
        repliedAt: null,
        createdAt: created.created_at,
      },
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    return NextResponse.json({ error: '문의를 보내지 못했어요.' }, { status: 500 });
  }
}

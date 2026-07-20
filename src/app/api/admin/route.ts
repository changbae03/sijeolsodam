import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAdminRequest } from '@/lib/admin';

/**
 * 운영 대시보드 API.
 *
 * GET    /api/admin            -> 지표 + 최근 게시물·가입자
 * DELETE /api/admin?postId=... -> 게시물 강제 삭제 (신고·부적절 콘텐츠 대응)
 *
 * 권한은 ADMIN_EMAILS 허용 목록으로만 부여한다.
 */

/** 집계 쿼리는 테이블이 아직 없을 수 있어(지연 생성) 개별적으로 감싼다 */
async function safeCount(run: () => Promise<Record<string, unknown>[]>): Promise<number> {
  try {
    const rows = await run();
    return Number(rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: '권한이 없어요.' }, { status: 403 });
  }

  try {
    const [users, posts, comments, reactions, favorites, cooked, newUsers7d, newPosts7d] =
      await Promise.all([
        safeCount(() => sql`SELECT COUNT(*)::int AS count FROM users`),
        safeCount(() => sql`SELECT COUNT(*)::int AS count FROM posts`),
        safeCount(() => sql`SELECT COUNT(*)::int AS count FROM post_comments`),
        safeCount(() => sql`SELECT COUNT(*)::int AS count FROM post_reactions`),
        safeCount(() => sql`SELECT COUNT(*)::int AS count FROM favorites`),
        safeCount(() => sql`SELECT COUNT(*)::int AS count FROM cooked_records`),
        safeCount(
          () =>
            sql`SELECT COUNT(*)::int AS count FROM users WHERE created_at > NOW() - INTERVAL '7 days'`
        ),
        safeCount(
          () =>
            sql`SELECT COUNT(*)::int AS count FROM posts WHERE created_at > NOW() - INTERVAL '7 days'`
        ),
      ]);

    // 가장 많이 본 레시피 (조회 기록 기반) — 어떤 콘텐츠가 실제로 쓰이는지
    let topRecipes: { recipeId: string; views: number }[] = [];
    try {
      const rows = (await sql`
        SELECT recipe_id, COUNT(*)::int AS views
        FROM recipe_views
        GROUP BY recipe_id
        ORDER BY views DESC
        LIMIT 10
      `) as { recipe_id: string; views: number }[];
      topRecipes = rows.map((r) => ({ recipeId: r.recipe_id, views: r.views }));
    } catch {
      topRecipes = [];
    }

    let recentPosts: unknown[] = [];
    try {
      recentPosts = (await sql`
        SELECT p.id, p.image_url, p.caption, p.created_at, u.id AS author_id, u.name AS author_name, u.email AS author_email
        FROM posts p
        JOIN users u ON u.id = p.user_id
        ORDER BY p.created_at DESC
        LIMIT 20
      `) as unknown[];
    } catch {
      recentPosts = [];
    }

    let recentUsers: unknown[] = [];
    try {
      recentUsers = (await sql`
        SELECT id, email, name, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 20
      `) as unknown[];
    } catch {
      recentUsers = [];
    }

    return NextResponse.json({
      stats: { users, posts, comments, reactions, favorites, cooked, newUsers7d, newPosts7d },
      topRecipes,
      recentPosts,
      recentUsers,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return NextResponse.json({ error: '대시보드를 불러오지 못했어요.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: '권한이 없어요.' }, { status: 403 });
  }

  const postId = Number(request.nextUrl.searchParams.get('postId'));
  if (!postId) {
    return NextResponse.json({ error: 'postId가 필요해요.' }, { status: 400 });
  }

  try {
    await sql`DELETE FROM post_reactions WHERE post_id = ${postId}`;
    await sql`DELETE FROM post_comments WHERE post_id = ${postId}`;
    await sql`DELETE FROM posts WHERE id = ${postId}`;
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Admin delete post error:', error);
    return NextResponse.json({ error: '삭제하지 못했어요.' }, { status: 500 });
  }
}

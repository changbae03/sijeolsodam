import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

/** 목록에 보여줄 게시물 최대 개수 */
const PAGE_SIZE = 30;

/** 여러 장·동영상 지원을 위한 컬럼을 필요 시 추가 (멱등) */
async function ensureMediaColumns() {
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_urls TEXT[]`;
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type TEXT`;
}

export async function GET(request: NextRequest) {
  const viewer = getUserFromRequest(request);

  // ?userId= 가 있으면 그 사람의 게시물만 (프로필 페이지용)
  const authorFilter = Number(request.nextUrl.searchParams.get('userId')) || null;

  try {
    await ensureMediaColumns();
    const rows = authorFilter
      ? await sql`
      SELECT
        p.id,
        p.image_url,
        p.image_urls,
        p.media_type,
        p.caption,
        p.hashtags,
        p.recipe_id,
        p.user_recipe_id,
        p.created_at,
        u.id AS author_id,
        u.name AS author_name,
        u.avatar_url AS author_avatar_url,
        COUNT(DISTINCT pr.id)::int AS reaction_count,
        COUNT(DISTINCT pc.id)::int AS comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN post_reactions pr ON pr.post_id = p.id
      LEFT JOIN post_comments pc ON pc.post_id = p.id
      WHERE p.user_id = ${authorFilter}
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT ${PAGE_SIZE}
    `
      : await sql`
      SELECT
        p.id,
        p.image_url,
        p.image_urls,
        p.media_type,
        p.caption,
        p.hashtags,
        p.recipe_id,
        p.user_recipe_id,
        p.created_at,
        u.id AS author_id,
        u.name AS author_name,
        u.avatar_url AS author_avatar_url,
        COUNT(DISTINCT pr.id)::int AS reaction_count,
        COUNT(DISTINCT pc.id)::int AS comment_count
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN post_reactions pr ON pr.post_id = p.id
      LEFT JOIN post_comments pc ON pc.post_id = p.id
      GROUP BY p.id, u.id
      ORDER BY p.created_at DESC
      LIMIT ${PAGE_SIZE}
    `;

    // 로그인한 사용자가 있으면, 이 사용자가 반응(맛있어요)을 남긴 게시물 id만 따로 조회해서
    // 위 결과에 합친다. neon 서버리스 sql 태그는 쿼리 프래그먼트 중첩을 지원하지 않아
    // 조건부 서브쿼리 대신 별도 쿼리로 분리했다.
    let reactedPostIds = new Set<number>();
    if (viewer) {
      const reactedRows = await sql`
        SELECT post_id FROM post_reactions WHERE user_id = ${viewer.userId}
      `;
      reactedPostIds = new Set(reactedRows.map((r) => r.post_id as number));
    }

    return NextResponse.json({
      posts: rows.map((r) => ({
        id: r.id,
        imageUrl: r.image_url,
        imageUrls: (r.image_urls as string[] | null) ?? (r.image_url ? [r.image_url] : []),
        mediaType: (r.media_type as string | null) ?? 'image',
        caption: r.caption,
        hashtags: r.hashtags ?? [],
        recipeId: r.recipe_id,
        userRecipeId: r.user_recipe_id,
        createdAt: r.created_at,
        authorId: r.author_id,
        authorName: r.author_name || '이웃',
        authorAvatarUrl: r.author_avatar_url,
        reactionCount: r.reaction_count,
        commentCount: r.comment_count,
        reacted: reactedPostIds.has(r.id),
      })),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: '게시물을 불러오지 못했어요.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const { imageUrl, imageUrls, mediaType, caption, hashtags, recipeId, userRecipeId } = (await request.json()) as {
      imageUrl?: string;
      caption?: string;
      hashtags?: string[];
      recipeId?: string;
      userRecipeId?: number;
      imageUrls?: string[];
      mediaType?: 'image' | 'video';
    };

    if (!imageUrl) {
      return NextResponse.json({ error: '사진을 먼저 올려주세요.' }, { status: 400 });
    }

    const cleanHashtags = (hashtags ?? [])
      .map((h) => h.trim().replace(/^#/, ''))
      .filter(Boolean)
      .slice(0, 8);

    await ensureMediaColumns();
    // image_url은 첫 장(썸네일·구버전 호환), image_urls에 전체를 담는다
    const urls = imageUrls?.length ? imageUrls.slice(0, 10) : [imageUrl];

    const result = await sql`
      INSERT INTO posts (user_id, image_url, image_urls, media_type, caption, hashtags, recipe_id, user_recipe_id)
      VALUES (
        ${user.userId},
        ${urls[0]},
        ${urls},
        ${mediaType ?? 'image'},
        ${caption ?? null},
        ${cleanHashtags},
        ${recipeId ?? null},
        ${userRecipeId ?? null}
      )
      RETURNING id, created_at
    `;

    return NextResponse.json({ success: true, id: result[0].id, createdAt: result[0].created_at });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: '게시물을 올리지 못했어요.' }, { status: 500 });
  }
}

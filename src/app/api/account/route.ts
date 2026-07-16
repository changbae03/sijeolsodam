import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest, AUTH_COOKIE_NAME } from '@/lib/auth';

/**
 * 회원 탈퇴.
 * 사용자가 남긴 데이터(즐겨찾기, 조회 기록, 게시글·댓글·반응, 등록 레시피)를
 * 모두 지우고 계정을 삭제한 뒤 세션 쿠키를 비운다.
 * 개인정보 보호 원칙상 소프트 삭제가 아니라 실제 삭제.
 */
export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 });
  }

  try {
    const userId = user.userId;

    // 자식 데이터부터 순서대로 삭제 (FK 제약이 없어도 안전한 순서)
    await sql`DELETE FROM post_reactions WHERE user_id = ${userId}`;
    await sql`DELETE FROM post_comments WHERE user_id = ${userId}`;
    // 내가 쓴 글에 달린 남의 댓글/반응도 함께 정리
    await sql`DELETE FROM post_reactions WHERE post_id IN (SELECT id FROM posts WHERE user_id = ${userId})`;
    await sql`DELETE FROM post_comments WHERE post_id IN (SELECT id FROM posts WHERE user_id = ${userId})`;
    await sql`DELETE FROM posts WHERE user_id = ${userId}`;
    await sql`DELETE FROM user_recipes WHERE user_id = ${userId}`;
    await sql`DELETE FROM recipe_views WHERE user_id = ${userId}`;
    await sql`DELETE FROM favorites WHERE user_id = ${userId}`;
    await sql`DELETE FROM users WHERE id = ${userId}`;

    const response = NextResponse.json({ deleted: true });
    response.cookies.set(AUTH_COOKIE_NAME, '', { maxAge: 0, path: '/' });
    return response;
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: '탈퇴 처리 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

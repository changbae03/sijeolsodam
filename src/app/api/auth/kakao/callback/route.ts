import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { signToken, AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/lib/auth';

interface KakaoTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: { nickname?: string; profile_image_url?: string };
  };
}

/** 로그인 페이지로 에러 메시지와 함께 돌려보냄 */
function failRedirect(origin: string, message: string) {
  const url = new URL('/login', origin);
  url.searchParams.set('error', message);
  return NextResponse.redirect(url);
}

/**
 * 카카오 로그인 콜백.
 * code -> 토큰 교환 -> 프로필 조회 -> kakao_id 기준 사용자 찾기/생성 -> 세션 쿠키 발급.
 * 이메일 동의를 안 한 계정은 `kakao_{id}@kakao.local` 형식의 내부 이메일로 저장한다.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const savedState = request.cookies.get('kakao_oauth_state')?.value;

  if (!code) return failRedirect(origin, '카카오 로그인이 취소되었어요.');
  if (!state || !savedState || state !== savedState) {
    return failRedirect(origin, '로그인 요청이 유효하지 않아요. 다시 시도해주세요.');
  }

  const restApiKey = process.env.KAKAO_REST_API_KEY;
  if (!restApiKey) return failRedirect(origin, '카카오 로그인이 아직 설정되지 않았어요.');

  try {
    // 1. 인가 코드 -> 액세스 토큰
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: restApiKey,
      redirect_uri: `${origin}/api/auth/kakao/callback`,
      code,
    });
    // 콘솔에서 Client Secret을 '사용함'으로 켠 경우에만 필요
    if (process.env.KAKAO_CLIENT_SECRET) {
      tokenBody.set('client_secret', process.env.KAKAO_CLIENT_SECRET);
    }

    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: tokenBody,
    });
    const tokenData = (await tokenRes.json()) as KakaoTokenResponse;
    if (!tokenData.access_token) {
      console.error('Kakao token error:', tokenData.error, tokenData.error_description);
      return failRedirect(origin, '카카오 인증에 실패했어요. 다시 시도해주세요.');
    }

    // 2. 프로필 조회
    const meRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const me = (await meRes.json()) as KakaoUserResponse;
    if (!me.id) return failRedirect(origin, '카카오 프로필을 불러오지 못했어요.');

    const kakaoId = me.id;
    const nickname = me.kakao_account?.profile?.nickname ?? '카카오 사용자';
    const email = me.kakao_account?.email ?? `kakao_${kakaoId}@kakao.local`;
    // 카카오 프로필 사진을 그대로 아바타로 쓴다 (사용자는 마이페이지에서 언제든 교체 가능)
    const avatarUrl = me.kakao_account?.profile?.profile_image_url ?? null;

    // 3. kakao_id 컬럼이 없는 초기 DB를 위한 지연 마이그레이션 (멱등)
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS kakao_id BIGINT UNIQUE`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;

    // 4. 사용자 찾기/생성
    //    - kakao_id로 먼저 찾고
    //    - 없으면 같은 이메일의 기존 계정에 kakao_id를 연결 (이메일 가입자가 카카오로 전환하는 경우)
    //    - 그래도 없으면 신규 생성 (비밀번호 없는 소셜 계정: password_hash는 빈 값)
    let user = (
      (await sql`SELECT id, email, name FROM users WHERE kakao_id = ${kakaoId}`) as {
        id: number;
        email: string;
        name: string | null;
      }[]
    )[0];

    if (!user) {
      const byEmail = (
        (await sql`SELECT id, email, name FROM users WHERE email = ${email}`) as {
          id: number;
          email: string;
          name: string | null;
        }[]
      )[0];

      if (byEmail) {
        // 이메일로 가입해 둔 계정이 있으면 새 계정을 만들지 않고 카카오를 연결한다
        await sql`UPDATE users SET kakao_id = ${kakaoId} WHERE id = ${byEmail.id}`;
        if (avatarUrl) {
          await sql`UPDATE users SET avatar_url = ${avatarUrl} WHERE id = ${byEmail.id} AND avatar_url IS NULL`;
        }
        user = byEmail;
      } else {
        user = (
          (await sql`
            INSERT INTO users (email, name, password_hash, kakao_id, avatar_url)
            VALUES (${email}, ${nickname}, '', ${kakaoId}, ${avatarUrl})
            RETURNING id, email, name
          `) as { id: number; email: string; name: string | null }[]
        )[0];
      }
    }

    // 5. 기존 로그인과 동일한 세션 쿠키 발급
    const token = signToken({ userId: user.id, email: user.email });
    const response = NextResponse.redirect(new URL('/', origin));
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    });
    response.cookies.delete('kakao_oauth_state');
    return response;
  } catch (error) {
    console.error('Kakao callback error:', error);
    return failRedirect(origin, '카카오 로그인 중 문제가 발생했어요.');
  }
}

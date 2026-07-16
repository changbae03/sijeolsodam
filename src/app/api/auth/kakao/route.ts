import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * 카카오 로그인 시작.
 * CSRF 방지용 state를 쿠키에 심고 카카오 인가 페이지로 보낸다.
 * 필요 환경변수: KAKAO_REST_API_KEY
 * 카카오 개발자 콘솔의 Redirect URI에 `{origin}/api/auth/kakao/callback` 등록 필요.
 */
export async function GET(request: NextRequest) {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  if (!restApiKey) {
    return NextResponse.json(
      { error: '카카오 로그인이 아직 설정되지 않았어요. (KAKAO_REST_API_KEY 누락)' },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${request.nextUrl.origin}/api/auth/kakao/callback`;

  const authorizeUrl = new URL('https://kauth.kakao.com/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', restApiKey);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set('kakao_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10분
    path: '/',
  });
  return response;
}

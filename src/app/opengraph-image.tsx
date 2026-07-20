import { ImageResponse } from 'next/og';

/**
 * 기본 링크 미리보기 이미지.
 * 카카오톡 등에서 링크를 보낼 때 회색 빈 썸네일 대신 브랜드 카드가 뜨도록,
 * 절기 히어로와 같은 톤(딥그린 + 볕 골드)으로 그린다.
 */
export const runtime = 'edge';
export const alt = '시절소담 — 제철 식재료로 짓는 한 끼';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(150deg, #2E6B45 0%, #1E4632 62%, #14301F 100%)',
          color: '#FFFDF9',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: 0.75 }}>
          <div style={{ width: 40, height: 2, background: '#E9B84E' }} />
          <div style={{ fontSize: 26, letterSpacing: 6 }}>스물넷 절기의 밥상</div>
        </div>

        <div style={{ fontSize: 104, fontWeight: 700, marginTop: 28, letterSpacing: -2 }}>
          시절소담
        </div>

        <div style={{ fontSize: 38, marginTop: 20, color: 'rgba(255,253,249,0.82)' }}>
          제철 식재료로 짓는 한 끼
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 'auto',
            fontSize: 26,
            color: '#E9B84E',
            letterSpacing: 1,
          }}
        >
          가장 맛있는 때에, 가장 알맞은 요리
        </div>
      </div>
    ),
    size
  );
}

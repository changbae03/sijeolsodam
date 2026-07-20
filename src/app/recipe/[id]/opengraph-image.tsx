import { ImageResponse } from 'next/og';
import { getRecipeById } from '@/data/recipes';

/**
 * 레시피 링크 미리보기 이미지.
 *
 * 요리 사진을 그대로 og:image로 넘겼더니 카카오톡에서 빈 썸네일이 떴다.
 * 원인은 포맷 — 저장된 사진이 WebP인데 카카오 크롤러가 이를 렌더하지 못한다.
 * 그래서 여기서 PNG 카드를 직접 그려 내보낸다. 절기 히어로와 같은 톤에
 * 로고·요리 이름·부제를 얹어, 사진이 없어도 브랜드가 드러나게 했다.
 */
// Edge 런타임은 번들 상한(Hobby 1MB)이 있는데 레시피 데이터가 6.9MB라 배포가 실패한다.
// Node 런타임은 상한이 훨씬 커서 전체 데이터를 그대로 참조할 수 있다.
export const runtime = 'nodejs';
export const alt = '시절소담 레시피';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function RecipeOgImage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  const title = recipe?.title ?? '시절소담';
  const subtitle = recipe?.subtitle ?? '제철 식재료로 짓는 한 끼';
  const meta = recipe ? `${recipe.cookTime}분 · ${recipe.difficulty}` : '';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.8 }}>
          {/* 잎-그릇 로고 마크 */}
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <path d="M5 17C5 17 5 24 16 24C27 24 27 17 27 17" stroke="#FFFDF9" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17H28" stroke="#FFFDF9" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 17C16 17 15 11 16 7" stroke="#FFFDF9" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M16 12C16 12 10 11 9 6C9 6 15 6 16 12Z" fill="#FFFDF9" />
            <path d="M16 9C16 9 22 8 23 4C23 4 17 3 16 9Z" fill="rgba(255,253,249,0.6)" />
          </svg>
          <div style={{ fontSize: 30, letterSpacing: 2 }}>시절소담</div>
        </div>

        <div
          style={{
            fontSize: title.length > 16 ? 68 : 84,
            fontWeight: 700,
            marginTop: 34,
            letterSpacing: -2,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        <div style={{ fontSize: 34, marginTop: 18, color: 'rgba(255,253,249,0.8)' }}>{subtitle}</div>

        {meta && (
          <div style={{ display: 'flex', marginTop: 'auto', fontSize: 26, color: '#E9B84E' }}>{meta}</div>
        )}
      </div>
    ),
    size
  );
}

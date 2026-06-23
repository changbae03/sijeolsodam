/**
 * 시절소담 디자인 토큰
 *
 * globals.css의 CSS 변수와 동일한 값을 TypeScript에서 참조할 때 사용합니다.
 * 컴포넌트에서 직접 값을 하드코딩하지 말고 이 토큰을 사용하세요.
 */

// ============================================
// COLORS
// ============================================

export const colors = {
  // Neutrals
  cream: '#f8f6f2',
  creamWarm: '#f2eee5',
  paper: '#fffdf9',
  ink: '#2c2a26',
  inkSoft: '#5a5650',
  borderSoft: '#e3ddd0',

  // Accents
  sage: '#5b6e54',
  sageLight: '#889b80',
  sageDark: '#424f3d',
  terracotta: '#c45d3a',
  terracottaLight: '#e0936f',
} as const;

// ============================================
// 8PT SPACING SYSTEM
// ============================================

/**
 * 모든 여백, 패딩, 갭은 이 시스템을 따릅니다.
 * 기본 단위는 8px이며, 미세 조정이 필요한 경우만 4px 단위를 사용합니다.
 */
export const spacing = {
  0: '0',
  1: '4px', // 4pt
  2: '8px', // 8pt — 베이스 단위
  3: '12px', // 12pt
  4: '16px', // 16pt — 카드 패딩
  5: '20px', // 20pt
  6: '24px', // 24pt — 큰 패딩
  8: '32px', // 32pt — 섹션 사이
  10: '40px', // 40pt
  12: '48px', // 48pt — 큰 섹션
  16: '64px', // 64pt — hero 여백
  20: '80px', // 80pt — 잡지 호흡
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  sm: '8px', // 작은 칩
  md: '12px', // 입력, 작은 카드
  lg: '16px', // 일반 카드
  xl: '20px', // 큰 카드
  '2xl': '24px', // 히어로 카드
  full: '9999px',
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    display: "Georgia, 'Noto Serif KR', 'Apple SD Gothic Neo', serif",
    body: "var(--font-pretendard), -apple-system, sans-serif",
  },
  fontSize: {
    // Display
    displayXl: '38px',
    displayLg: '28px',
    displayMd: '22px',
    displaySm: '17px',
    // Body
    bodyLg: '15px',
    bodyMd: '14px',
    bodySm: '13px',
    caption: '12px',
    overline: '11px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.7,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '-0.01em',
    wide: '0.05em',
    wider: '0.15em',
    widest: '0.25em', // 우버라인용
  },
} as const;

// ============================================
// ELEVATION
// ============================================

export const shadow = {
  xs: '0 1px 2px 0 rgba(44, 42, 38, 0.04)',
  sm: '0 2px 8px 0 rgba(44, 42, 38, 0.06)',
  md: '0 4px 16px 0 rgba(44, 42, 38, 0.08)',
  lg: '0 8px 32px 0 rgba(44, 42, 38, 0.10)',
} as const;

// ============================================
// MOTION
// ============================================

export const motion = {
  ease: {
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
  duration: {
    fast: 150,
    base: 200,
    slow: 300,
  },
} as const;

// ============================================
// BREAKPOINTS — Mobile-first
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

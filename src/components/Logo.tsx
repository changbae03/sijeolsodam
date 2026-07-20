interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  /** 어두운 배경(절기 히어로 등)에서는 'cream' */
  tone?: 'ink' | 'cream';
  className?: string;
}

const SIZE_MAP = {
  sm: { text: 'text-[19px]', icon: 16 },
  md: { text: 'text-[24px]', icon: 22 },
  lg: { text: 'text-[34px]', icon: 30 },
};

/** 잎과 그릇을 합쳐 그린 작은 손그림 아이콘 — 제철 식재료를 담은 밥상을 표현 */
function LeafBowlIcon({ size, tone }: { size: number; tone: 'ink' | 'cream' }) {
  // 어두운 배경에서는 원래 색이 묻히므로 크림 단색으로 그린다
  const bowl = tone === 'cream' ? 'rgba(255,253,249,0.9)' : '#C45D3A';
  const leafA = tone === 'cream' ? 'rgba(255,253,249,0.9)' : '#5B6E54';
  const leafB = tone === 'cream' ? 'rgba(255,253,249,0.6)' : '#8A9A82';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* 그릇 */}
      <path
        d="M5 17C5 17 5 24 16 24C27 24 27 17 27 17"
        stroke={bowl}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 17H28"
        stroke={bowl}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 잎 줄기 */}
      <path
        d="M16 17C16 17 15 11 16 7"
        stroke={leafA}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* 잎 왼쪽 */}
      <path
        d="M16 12C16 12 10 11 9 6C9 6 15 6 16 12Z"
        fill={leafA}
      />
      {/* 잎 오른쪽 */}
      <path
        d="M16 9C16 9 22 8 23 4C23 4 17 3 16 9Z"
        fill={leafB}
      />
    </svg>
  );
}

export default function Logo({ size = 'md', tone = 'ink', className = '' }: LogoProps) {
  const { text, icon } = SIZE_MAP[size];
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <LeafBowlIcon size={icon} tone={tone} />
      <span
        className={`${text} ${tone === 'cream' ? 'text-cream' : 'text-ink'} font-bold tracking-wide leading-none`}
        style={{ fontFamily: 'var(--font-hahmlet), serif' }}
      >
        시절소담
      </span>
    </div>
  );
}

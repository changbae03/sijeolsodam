'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { getCurrentSolarTerm, SOLAR_TERMS } from '@/data/solar-terms';
import { josa } from '@/lib/korean';

/** 필름 그레인 — 그라디언트가 밋밋하지 않게 은은한 질감을 얹는다 */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface SeasonHeroProps {
  /** 히어로 서사 두 번째 줄에 들어갈 대표 제철 식재료 이름 (예: '초당옥수수') */
  featuredName?: string;
}

/**
 * 절기 히어로 — 홈의 "매거진 표지".
 * 현재 절기를 대형 세리프 타이포로 열고, 절기별 시즌 컬러·한 줄 서사·
 * 24절기 진행 바(지금이 1년 중 어디쯤인지)를 함께 보여준다.
 * 컬러는 solar-terms.ts의 테마 토큰에서 오므로 절기가 바뀌면 무드도 함께 바뀐다.
 */
export default function SeasonHero({ featuredName }: SeasonHeroProps) {
  const { current, next, daysToNext } = getCurrentSolarTerm();
  const { deep, mid, warm } = current.theme;

  const now = new Date();
  const dateLabel = `${now.getMonth() + 1}월 ${now.getDate()}일`;

  return (
    <section
      className="relative overflow-hidden text-cream"
      style={{
        background: `radial-gradient(120% 90% at 85% -10%, ${warm}59, transparent 55%), linear-gradient(168deg, ${mid} 0%, ${deep} 62%, color-mix(in srgb, ${deep} 72%, black) 100%)`,
      }}
    >
      {/* 계절 광원 — 절기 warm 컬러의 은은한 원광 */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-14 w-56 h-56 rounded-full blur-md"
        style={{ background: `radial-gradient(circle, ${warm}80, transparent 70%)` }}
      />
      {/* 필름 그레인 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: GRAIN_URI }}
      />

      <div className="relative max-w-md mx-auto px-6 pt-5 pb-[72px]">
        {/* 상단 — 워드마크 + 아이콘 */}
        <div className="flex items-center justify-between mb-8">
          <span className="font-season text-[19px] font-bold tracking-wide text-cream">
            시절소담
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/recipes"
              aria-label="레시피 검색"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.14] border border-white/[0.18] backdrop-blur-sm"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </Link>
            <Link
              href="/my"
              aria-label="마이 페이지"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.14] border border-white/[0.18] backdrop-blur-sm"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 아이브로 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5 text-[12px] tracking-[0.14em] text-white/75 font-medium"
        >
          <span>스물넷 절기, {current.index + 1}번째</span>
          <span className="w-6 h-px bg-white/40" aria-hidden="true" />
          <span>{dateLabel}</span>
        </motion.div>

        {/* 절기 이름 — 매거진 표지 타이포 */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 flex items-start gap-3.5"
        >
          <span className="font-season text-[76px] leading-[1.02] font-semibold tracking-[0.01em]">
            {current.name}
          </span>
          <span
            className="font-season mt-3 text-[15px] tracking-[0.5em] text-white/55 [writing-mode:vertical-rl]"
            aria-hidden="true"
          >
            {current.hanja}
          </span>
        </motion.h1>

        {/* 서사 */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3.5 max-w-[270px] text-[15px] leading-[1.65] text-white/85"
        >
          {current.tagline}.
          {featuredName && (
            <>
              <br />
              지금은 <strong className="font-semibold" style={{ color: warm }}>{featuredName}</strong>
              {josa(featuredName, '이/가')} 가장 맛있는 때예요.
            </>
          )}
        </motion.p>

        {/* 24절기 진행 바 — 지금이 1년 중 어디쯤인지 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9"
        >
          <div className="flex items-baseline justify-between text-[12px] text-white/70 mb-2.5">
            <span>
              다음 절기 <b className="text-cream font-semibold">{next.name}</b>까지
            </span>
            <b className="text-cream font-semibold">D-{daysToNext}</b>
          </div>
          <div className="flex items-center gap-[5px]" role="img" aria-label={`24절기 중 ${current.index + 1}번째, ${current.name}`}>
            {SOLAR_TERMS.map((t) => {
              const isNow = t.index === current.index;
              const isPast = t.index < current.index;
              return (
                <i
                  key={t.index}
                  className="rounded-full transition-all"
                  style={
                    isNow
                      ? { flex: 2.6, height: 5, background: warm, boxShadow: `0 0 10px ${warm}8C` }
                      : { flex: 1, height: 3, background: isPast ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.22)' }
                  }
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

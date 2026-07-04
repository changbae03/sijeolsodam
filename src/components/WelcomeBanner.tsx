'use client';

import { useEffect, useState } from 'react';
import SectionHeader from './SectionHeader';

const STORAGE_KEY = 'sodam-welcome-dismissed';

const FEATURES = [
  {
    icon: '🗓️',
    title: '지금 뭐가 맛있을까',
    desc: '제철 정보와 산지, 고르는 법까지 계절을 따라 친절하게 알려드려요.',
  },
  {
    icon: '🍳',
    title: '그 재료로 만드는 요리',
    desc: '집밥, 주말 요리, 세계 요리, 셰프의 특별 레시피까지 — 실력과 기분에 맞게 골라보세요.',
  },
  {
    icon: '💬',
    title: '무엇이든 물어보는 소담이',
    desc: '냉장고 속 재료나 오늘 기분을 말해주시면, 요리를 추천하고 끝까지 조리법을 알려드려요.',
  },
  {
    icon: '👥',
    title: '함께 나누는 이야기 (준비 중)',
    desc: '제철 식재료와 요리 이야기를 나눌 수 있는 공간을 차근차근 준비하고 있어요.',
  },
] as const;

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function WelcomeBanner() {
  const [state, setState] = useState<{ mounted: boolean; dismissed: boolean }>({
    mounted: false,
    dismissed: true,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 서버에는 localStorage가 없어 클라이언트 마운트 후에만 안전하게 읽을 수 있음
    setState({ mounted: true, dismissed: window.localStorage.getItem(STORAGE_KEY) === '1' });
  }, []);

  function handleDismiss() {
    setState((prev) => ({ ...prev, dismissed: true }));
    window.localStorage.setItem(STORAGE_KEY, '1');
  }

  if (!state.mounted || state.dismissed) return null;

  return (
    <section className="max-w-md mx-auto px-5 pt-3 pb-1">
      <div
        className="relative bg-paper border border-border-soft rounded-3xl p-5"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="안내 닫기"
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-ink-soft/50 hover:text-ink-soft hover:bg-cream-warm transition-colors"
        >
          <CloseIcon />
        </button>

        <SectionHeader eyebrow="시절소담 이야기" title="제철의 마음을 담았어요" icon="🌿" />

        <p className="mt-3 text-[13px] text-ink-soft leading-relaxed pr-6">
          안녕하세요, 시절소담이에요. 24절기를 따라 흘러가는 계절처럼, 그때그때 가장 맛있고
          넉넉한 제철 재료를 소중히 여기고 있어요. 오늘은 뭘 먹을지 고민되는 날, 부담 없이
          기대어 주세요.
        </p>

        <ul className="mt-4 space-y-3.5">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex gap-3">
              <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-sage/10 text-[15px] leading-none">
                {f.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink">{f.title}</p>
                <p className="text-[12px] text-ink-soft leading-relaxed mt-0.5">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[12px] text-ink-soft/80 leading-relaxed border-t border-border-soft/70 pt-3">
          요리에 관한 거라면 뭐든 편하게 물어보세요. 아래 대화창에 재료나 오늘 기분을
          말해주시면 소담이가 도와드릴게요.
        </p>
      </div>
    </section>
  );
}

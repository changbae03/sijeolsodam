'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 레시피 공유.
 *
 * 링크만 던지는 공유는 잘 안 눌린다. "이거 해줘" 같은 부탁이나 "이거 맛있어 보이지 않아?"
 * 같은 말이 붙어야 받는 사람이 반응하고, 그게 곧 유입이 된다.
 * 그래서 상황별 문구를 고르게 하고, 고른 문구 + 링크를 함께 공유한다.
 */
const SHARE_MESSAGES: { id: string; label: string; build: (title: string) => string }[] = [
  {
    id: 'please',
    label: '이거 해줘',
    build: (t) => `${t} 먹고 싶다... 해주라 🥺`,
  },
  {
    id: 'yummy',
    label: '맛있어 보여',
    build: (t) => `이것 봐, ${t} 맛있어 보이지 않아? 😋`,
  },
  {
    id: 'together',
    label: '같이 만들자',
    build: (t) => `주말에 ${t} 같이 만들어볼래? 🍳`,
  },
  {
    id: 'made',
    label: '내가 만들어줄게',
    build: (t) => `오늘 ${t} 만들어줄게. 기대해 ✨`,
  },
];

export default function RecipeShareButton({ recipeId, title }: { recipeId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const share = async (text: string) => {
    const url = `${window.location.origin}/recipe/${recipeId}`;
    const payload = `${text}\n${url}`;
    try {
      if (navigator.share) {
        // title·url을 따로 넘기면 카카오톡 등에서 메시지가 두 개로 쪼개진다.
        // 문구와 링크를 한 문자열로 합쳐 text 하나만 전달해 한 번에 가게 한다.
        await navigator.share({ text: payload });
      } else {
        await navigator.clipboard.writeText(payload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      setOpen(false);
    } catch {
      // 사용자가 취소한 경우 등 — 조용히 무시
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-border-soft bg-paper text-[15px] font-semibold text-ink transition-transform active:scale-[0.98]"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4M8 8l4-4 4 4" />
          <path d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14" />
        </svg>
        이 레시피 공유하기
      </button>

      {copied && (
        <p className="mt-1.5 text-center text-[12px] text-sage-dark">복사했어요! 붙여넣기로 보내주세요</p>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-t-3xl bg-paper px-5 pb-8 pt-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border-soft" />
              <p className="text-[16.5px] font-bold tracking-[-0.01em] text-ink">어떻게 보낼까요?</p>
              <p className="mt-1 text-[13px] text-ink-soft">
                고른 문구와 레시피 링크가 함께 전달돼요.
              </p>

              <div className="mt-4 space-y-2">
                {SHARE_MESSAGES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => share(m.build(title))}
                    className="w-full rounded-2xl border border-border-soft bg-cream-warm/40 px-4 py-3 text-left transition-colors active:bg-cream-warm"
                  >
                    <p className="text-[12px] font-semibold text-sage">{m.label}</p>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-ink">{m.build(title)}</p>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 h-11 w-full rounded-2xl text-[14px] font-medium text-ink-soft"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

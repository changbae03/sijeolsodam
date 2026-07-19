'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/auth-context';

/**
 * "만들었어요" 버튼 — 레시피 상세 하단.
 *
 * 설계 의도:
 *  - 즐겨찾기(하고 싶다)와 다른 축의 신호를 남긴다.
 *  - 누른 직후가 커뮤니티 진입의 최적 시점이라, 바로 "사진도 자랑할래요?"로 이어준다.
 *    커뮤니티의 가장 큰 벽인 "빈 게시판에 첫 글 쓰기"를 요리 끝난 맥락에서 넘게 하는 장치.
 *  - 카운트는 임계치(3) 미만이면 서버가 0으로 내려주고, 그때는 숫자를 감춘다.
 */
export default function CookedButton({ recipeId, title }: { recipeId: string; title: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [cooked, setCooked] = useState(false);
  const [count, setCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showBridge, setShowBridge] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/cooked?recipeId=${encodeURIComponent(recipeId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setCooked(Boolean(data.cooked));
          setCount(Number(data.count) || 0);
        }
      })
      .catch(() => {
        // 조회 실패는 조용히 무시 — 버튼은 계속 쓸 수 있어야 한다
      });
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  const handleClick = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (cooked) {
      setShowBridge(true); // 이미 기록했으면 자랑하기만 다시 제안
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/cooked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });
      if (res.ok) {
        setCooked(true);
        setShowBridge(true);
      }
    } catch {
      // 실패해도 흐름을 막지 않는다
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={saving}
        className={`flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl text-[15.5px] font-semibold transition-transform active:scale-[0.98] ${
          cooked
            ? 'border border-border-soft bg-paper text-ink'
            : 'bg-ink text-cream'
        }`}
      >
        {cooked ? (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12.5l5 5L20 6.5" />
            </svg>
            만들었어요
          </>
        ) : (
          '이 요리 만들었어요'
        )}
        {count > 0 && (
          <span className={`text-[13px] font-medium ${cooked ? 'text-ink-soft' : 'text-cream/70'}`}>
            · {count.toLocaleString()}명
          </span>
        )}
      </button>

      {/* 커뮤니티로 잇는 다리 */}
      <AnimatePresence>
        {showBridge && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="mt-2.5 rounded-2xl border border-border-soft bg-paper px-4 py-3.5"
          >
            <p className="text-[14px] font-semibold text-ink">사진도 올려서 자랑해볼까요?</p>
            <p className="mt-1 text-[12.5px] text-ink-soft leading-relaxed">
              소담에 올리면 다른 사람들이 이 레시피를 고를 때 큰 도움이 돼요.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/community?compose=post&recipeId=${encodeURIComponent(recipeId)}&title=${encodeURIComponent(title)}`
                  )
                }
                className="flex-1 rounded-xl bg-terracotta px-4 py-2.5 text-[13.5px] font-semibold text-cream"
              >
                사진 올리기
              </button>
              <button
                type="button"
                onClick={() => setShowBridge(false)}
                className="rounded-xl border border-border-soft px-4 py-2.5 text-[13.5px] font-medium text-ink-soft"
              >
                다음에
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

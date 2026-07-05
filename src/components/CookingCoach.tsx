'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentStep } from '@/lib/current-step-context';
import { cn } from '@/lib/cn';
import StructuredReplyView from './StructuredReplyView';

interface Exchange {
  question: string;
  reply?: string;
  error?: string;
}

const SUGGESTED_QUESTIONS = [
  '다음 단계 알려줘',
  '소금 얼마나 넣어?',
  '에어프라이어 없는데 프라이팬으로 하려면?',
];

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

function historyFromExchanges(exchanges: Exchange[]) {
  return exchanges.flatMap((ex) => {
    const turns: { role: 'user' | 'assistant'; content: string }[] = [
      { role: 'user', content: ex.question },
    ];
    if (ex.reply) turns.push({ role: 'assistant', content: ex.reply });
    return turns;
  });
}

export default function CookingCoach({
  recipeId,
  totalSteps,
}: {
  recipeId: string;
  totalSteps: number;
}) {
  const { currentStepIndex, servings, askRequest } = useCurrentStep();
  const [open, setOpen] = useState(false);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [askedStepIndex, setAskedStepIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastNonceRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [exchanges, loading]);

  useEffect(() => {
    if (askRequest && askRequest.nonce !== lastNonceRef.current) {
      lastNonceRef.current = askRequest.nonce;
      setAskedStepIndex(askRequest.stepIndex);
      setOpen(true);
    }
  }, [askRequest]);

  const effectiveStepIndex = open && askedStepIndex !== null ? askedStepIndex : currentStepIndex;

  const sendMessage = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    const priorHistory = historyFromExchanges(exchanges);
    setExchanges((prev) => [...prev, { question }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId,
          currentStepIndex: effectiveStepIndex,
          servings,
          messages: [...priorHistory, { role: 'user', content: question }],
        }),
      });
      const data = await res.json();
      setExchanges((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (res.ok) {
          next[next.length - 1] = { ...last, reply: data.reply };
        } else {
          next[next.length - 1] = { ...last, error: data.error || '답변을 가져오지 못했어요.' };
        }
        return next;
      });
    } catch {
      setExchanges((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          error: '네트워크 문제로 답변하지 못했어요. 다시 시도해주세요.',
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-terracotta shadow-lg flex items-center justify-center"
        aria-label="AI 요리 코치 소담이 열기"
      >
        <span className="text-[22px]">🧑‍🍳</span>
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-sage text-cream text-[11px] font-medium flex items-center justify-center border-2 border-cream">
          {currentStepIndex + 1}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setOpen(false);
                setAskedStepIndex(null);
              }}
              className="fixed inset-0 bg-ink/30 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-cream rounded-t-3xl flex flex-col h-[78vh]"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-soft shrink-0">
                <div className="flex items-baseline gap-3">
                  <span className="h-px w-8 bg-sage" />
                  <div>
                    <p className="font-display text-[16px] text-ink font-medium">
                      소담이에게 물어보기
                    </p>
                    <p className="text-[12px] text-ink-soft/70 mt-0.5">
                      {effectiveStepIndex + 1} / {totalSteps}단계 진행 중
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setAskedStepIndex(null);
                  }}
                  aria-label="닫기"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft/60 hover:text-ink-soft transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
                {exchanges.length === 0 && (
                  <div>
                    <p className="text-[14px] text-ink-soft leading-relaxed mb-4">
                      안녕하세요, 소담이예요. 손에 양념이 묻었을 땐 말로 물어보세요. 각 단계 옆
                      아이콘을 누르면 그 단계에 대해 바로 물어볼 수 있어요.
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="text-left text-[14px] text-ink-soft bg-cream-warm/60 border border-border-soft rounded-xl px-4 py-2.5 hover:border-sage/40 hover:text-ink transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {exchanges.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(i > 0 && 'border-t border-border-soft/70 pt-4 mt-4')}
                  >
                    <p className="text-[13px] text-ink-soft/70 mb-1.5">{ex.question}</p>
                    {ex.reply && <StructuredReplyView text={ex.reply} size="sm" />}
                    {i === exchanges.length - 1 && loading && (
                      <p className="text-[14px] text-ink-soft/60 mt-1">소담이가 생각하고 있어요</p>
                    )}
                    {ex.error && <p className="text-[14px] text-terracotta mt-1">{ex.error}</p>}
                  </motion.div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="px-5 py-3.5 border-t border-border-soft shrink-0"
              >
                <div className="flex items-center gap-2 bg-cream-warm/50 rounded-2xl h-11 px-3.5">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      // 한글 조합(IME) 중 Enter로 인해 글자가 씹히는 것을 막는 안전장치
                      if (e.key === 'Enter' && e.nativeEvent.isComposing) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="궁금한 걸 물어보세요"
                    className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft/45"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="전송"
                    className={cn(
                      'flex-shrink-0 p-2 -mr-1 rounded-lg transition-colors',
                      input.trim() && !loading
                        ? 'text-ink hover:bg-cream-warm'
                        : 'text-ink-soft/25 cursor-not-allowed'
                    )}
                  >
                    <SendIcon />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

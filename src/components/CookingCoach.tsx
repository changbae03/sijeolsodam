'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrentStep } from '@/lib/current-step-context';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  '다음 단계 알려줘',
  '소금 얼마나 넣어?',
  '에어프라이어 없는데 프라이팬으로 하려면?',
];

export default function CookingCoach({
  recipeId,
  totalSteps,
}: {
  recipeId: string;
  totalSteps: number;
}) {
  const { currentStepIndex, servings, askRequest } = useCurrentStep();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [askedStepIndex, setAskedStepIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastNonceRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (askRequest && askRequest.nonce !== lastNonceRef.current) {
      lastNonceRef.current = askRequest.nonce;
      setAskedStepIndex(askRequest.stepIndex);
      setOpen(true);
    }
  }, [askRequest]);

  const effectiveStepIndex = open && askedStepIndex !== null ? askedStepIndex : currentStepIndex;

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
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
          messages: nextMessages,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.error || '답변을 가져오지 못했어요.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '네트워크 문제로 답변하지 못했어요. 다시 시도해주세요.' },
      ]);
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
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-sage text-cream text-[10px] font-medium flex items-center justify-center border-2 border-cream">
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
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border-soft shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[20px]">🧑‍🍳</span>
                  <div>
                    <p className="text-[14px] font-medium text-ink">AI 소담이</p>
                    <p className="text-[11px] text-ink-soft">
                      {effectiveStepIndex + 1} / {totalSteps}단계에 대해 물어보는 중
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setAskedStepIndex(null);
                  }}
                  aria-label="닫기"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center pt-6">
                    <p className="text-[13px] text-ink-soft mb-4">
                      안녕하세요, 소담이예요. 🌿
                      <br />
                      손에 양념이 묻었을 땐 말로 물어보세요.
                      <br />
                      각 단계 옆 🧑‍🍳 버튼을 누르면 그 단계에 대해 바로 물어볼 수 있어요.
                    </p>
                    <div className="flex flex-col gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="text-[13px] text-sage border border-sage/30 bg-sage/8 rounded-full px-4 py-2"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words ${
                        m.role === 'user'
                          ? 'bg-sage text-cream'
                          : 'bg-paper border border-border-soft text-ink'
                      }`}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-paper border border-border-soft rounded-2xl px-4 py-3 flex gap-1">
                      <TypingDot delay={0} />
                      <TypingDot delay={0.15} />
                      <TypingDot delay={0.3} />
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2 px-5 py-3.5 border-t border-border-soft shrink-0"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="궁금한 걸 물어보세요"
                  className="flex-1 bg-paper border border-border-soft rounded-full px-4 py-2.5 text-[14px] outline-none focus:border-sage"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-sage text-cream flex items-center justify-center disabled:opacity-40 shrink-0"
                  aria-label="전송"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </motion.button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-ink-soft/50"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay }}
    />
  );
}

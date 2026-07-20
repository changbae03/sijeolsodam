'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/cn';
import { useAuth } from '@/lib/auth-context';
import StructuredReplyView from './StructuredReplyView';

interface RecipeSuggestion {
  name: string;
  reason: string;
  recipe: { id: string; title: string; heroImage: string } | null;
}

interface IngredientSuggestion {
  name: string;
  reason: string;
  ingredient: { name: string; emoji: string } | null;
}

interface Exchange {
  question: string;
  reply?: string;
  dishes?: RecipeSuggestion[];
  ingredients?: IngredientSuggestion[];
  error?: string;
}

const QUICK_PROMPTS = ['이거 어떻게 만들어?', '냉장고 파먹기 도와줘', '오늘은 매콤한 게 당겨요'];

/**
 * 전역 소담이 버튼은 현재 어느 화면에도 띄우지 않는다.
 *
 * 떠 있는 버튼이 콘텐츠를 가리고, 탭마다 자기 액션(커뮤니티 글쓰기 +,
 * 레시피 상세 요리 코치)과 겹쳐 보였다. 소담이 진입은 홈의 큰 입력창과
 * 하단 탭으로 충분하다는 판단.
 *
 * 되살릴 때는 아래에 노출할 경로 조건을 추가하면 된다.
 * 예: if (pathname.startsWith('/ingredient/')) return false;
 */
function shouldHideGlobalSodami() {
  return true;
}

export default function GlobalSodami() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [exchanges, isLoading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  if (shouldHideGlobalSodami()) return null;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const historyForApi = exchanges.flatMap((ex) => {
      const turns: { role: 'user' | 'assistant'; content: string }[] = [
        { role: 'user', content: ex.question },
      ];
      if (ex.reply) turns.push({ role: 'assistant', content: ex.reply });
      return turns;
    });

    setExchanges((prev) => [...prev, { question: trimmed }]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ingredient-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: historyForApi }),
      });
      const data = await res.json();
      setExchanges((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (!res.ok) {
          next[next.length - 1] = { ...last, error: data.error || '잠시 후 다시 시도해주세요.' };
        } else {
          next[next.length - 1] = {
            ...last,
            reply: data.reply,
            dishes: data.dishes,
            ingredients: data.ingredients,
          };
        }
        return next;
      });
    } catch {
      setExchanges((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          error: '소담이와 연결이 원활하지 않아요. 잠시 후 다시 시도해주세요.',
        };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) send(query);
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        className={cn(
          'fixed right-5 z-30 w-14 h-14 rounded-full bg-terracotta flex items-center justify-center',
          pathname === '/community' ? 'bottom-44' : 'bottom-24'
        )}
        style={{ boxShadow: 'var(--shadow-lg)' }}
        aria-label="소담이에게 물어보기"
      >
        <span className="text-[22px]">💬</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-ink/30 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-cream rounded-t-3xl flex flex-col h-[80vh]"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-soft shrink-0">
                <div className="flex items-baseline gap-3">
                  <span className="h-px w-8 bg-sage" />
                  <p className="font-display text-[16px] text-ink font-medium">
                    소담이에게 물어보기
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
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
                      요리에 관한 거라면 뭐든 편하게 물어보세요. 냉장고 속 재료나 오늘 기분을
                      말해주셔도 좋아요.
                    </p>
                    <div className="flex flex-col gap-2">
                      {QUICK_PROMPTS.map((q) => (
                        <button
                          key={q}
                          onClick={() => send(q)}
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
                    className={cn(i > 0 && 'border-t border-border-soft/70 pt-5 mt-5')}
                  >
                    <p className="text-[13px] text-ink-soft/70 mb-2">{ex.question}</p>

                    {ex.reply && (
                      <div className="mb-3">
                        <StructuredReplyView text={ex.reply} size="md" />
                      </div>
                    )}

                    {(ex.ingredients?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {ex.ingredients!.map((item, j) =>
                          item.ingredient ? (
                            <Link
                              key={j}
                              href={`/ingredient/${encodeURIComponent(item.ingredient.name)}`}
                              onClick={() => setOpen(false)}
                              className="inline-flex items-center gap-1 bg-sage/10 text-sage border border-sage/20 rounded-full px-2.5 py-1 text-[13px] font-medium hover:bg-sage/15 transition-colors"
                            >
                              <span>{item.ingredient.emoji}</span>
                              {item.ingredient.name}
                            </Link>
                          ) : (
                            <span
                              key={j}
                              className="inline-flex items-center bg-cream-warm text-ink-soft border border-border-soft rounded-full px-2.5 py-1 text-[13px]"
                            >
                              {item.name}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {(ex.dishes?.length ?? 0) > 0 && (
                      <>
                      <p className="mb-1.5 text-[11.5px] font-semibold tracking-[0.04em] text-ink-soft/60">
                        참고할 만한 레시피
                      </p>
                      <ul className="-mx-2 divide-y divide-border-soft/70 mb-2">
                        {ex.dishes!.map((dish, j) => (
                          <li key={j}>
                            {dish.recipe ? (
                              <Link
                                href={`/recipe/${dish.recipe.id}`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-cream-warm/50 transition-colors"
                              >
                                <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-cream-warm">
                                  <Image
                                    src={dish.recipe.heroImage}
                                    alt={dish.recipe.title}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[15px] text-ink font-medium truncate">
                                    {dish.recipe.title}
                                  </p>
                                  <p className="text-[13px] text-ink-soft truncate">{dish.reason}</p>
                                </div>
                                <span className="flex-shrink-0 text-ink-soft/40 text-[14px]">›</span>
                              </Link>
                            ) : (
                              <div className="px-2 py-2.5">
                                <p className="text-[15px] text-ink font-medium">{dish.name}</p>
                                <p className="text-[13px] text-ink-soft mt-0.5">{dish.reason}</p>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      </>
                    )}

                    {i === exchanges.length - 1 && isLoading && (
                      <p className="text-[14px] text-ink-soft/60 pb-2">소담이가 생각하고 있어요</p>
                    )}
                    {ex.error && <p className="text-[14px] text-terracotta pb-2">{ex.error}</p>}
                  </motion.div>
                ))}
              </div>

              <div className="px-5 py-3.5 border-t border-border-soft shrink-0">
                <div className="flex items-center gap-2 bg-cream-warm/50 rounded-2xl h-11 px-3.5 border border-sage/25">
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="궁금한 걸 물어보세요"
                    className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft/45"
                  />
                  <button
                    type="button"
                    onClick={() => send(query)}
                    disabled={isLoading || !query.trim()}
                    aria-label="전송"
                    className={cn(
                      'flex-shrink-0 p-2 -mr-1 rounded-full transition-colors',
                      query.trim() && !isLoading
                        ? 'bg-terracotta text-cream'
                        : 'text-ink-soft/25 cursor-not-allowed'
                    )}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="13 6 19 12 13 18" />
                    </svg>
                  </button>
                </div>
                {!user && (
                  <p className="text-[12px] text-ink-soft/60 mt-2">
                    로그인하면 대화가 쌓여 점점 더 나에게 맞는 추천을 받을 수 있어요.
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

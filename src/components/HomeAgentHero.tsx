'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/cn';
import StructuredReplyView from './StructuredReplyView';
import { useAuth } from '@/lib/auth-context';

interface RecipeSuggestion {
  name: string;
  reason: string;
  recipe: {
    id: string;
    title: string;
    heroImage: string;
    month: number;
    difficulty: string;
  } | null;
}

interface IngredientSuggestion {
  name: string;
  reason: string;
  ingredient: {
    name: string;
    emoji: string;
    imageUrl?: string;
  } | null;
}

interface Exchange {
  question: string;
  reply?: string;
  dishes?: RecipeSuggestion[];
  ingredients?: IngredientSuggestion[];
  ingredientList?: string[];
  error?: string;
}

interface PastQuery {
  id: number;
  message: string;
  reply: string;
  matchedIngredient: string | null;
  createdAt: string;
}

const PROMPT_CATEGORIES = [
  {
    label: '냉장고 파먹기',
    prompts: ['냉장고 파먹기 도와줘', '이 재료 어떻게 써야 할지 모르겠어요'],
  },
  {
    label: '상황별',
    prompts: ['손님 초대했는데 뭘 낼까요?', '도시락 반찬 추천해줘', '술안주 추천해줘'],
  },
  {
    label: '건강·다이어트',
    prompts: ['다이어트 식단 추천해줘', '속 편한 저녁 메뉴 알려줘'],
  },
  {
    label: '오늘 기분',
    prompts: ['오늘은 매콤한 게 당겨요', '자극적이지 않은 담백한 요리 알려줘'],
  },
  {
    label: '조리법이 궁금할 때',
    prompts: ['제육볶음 어떻게 만들어?', '된장찌개 황금레시피 알려줘'],
  },
  {
    label: '세계 요리',
    prompts: ['이탈리아식 파스타 알려줘', '태국식 커리 만드는 법 알려줘'],
  },
  {
    label: '제철 정보',
    prompts: ['지금 제철 재료 뭐가 좋아요?', '요즘 저렴한 재료 추천해줘'],
  },
] as const;

const QUICK_PROMPTS = PROMPT_CATEGORIES.flatMap((c) => c.prompts);

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

export default function HomeAgentHero() {
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [pastQueries, setPastQueries] = useState<PastQuery[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = exchanges.length > 0;

  function openHistory() {
    if (!user) {
      router.push('/login');
      return;
    }
    setHistoryOpen(true);
    if (!pastQueries) {
      fetch('/api/agent-queries')
        .then((res) => res.json())
        .then((data) => setPastQueries(data.queries ?? []))
        .catch(() => setPastQueries([]));
    }
  }

  useEffect(() => {
    if (hasConversation) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % QUICK_PROMPTS.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [hasConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [exchanges, isLoading]);

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
            ingredientList: data.ingredientList,
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
    // 한글 등 조합형 입력(IME) 중에 Enter를 누르면 마지막 글자가 아직 조합 중이라
    // React state에는 반영되기 전인데 먼저 전송/초기화가 일어나 글자가 씹히는 문제가 있었음.
    // isComposing이면 Enter를 무시하고 조합이 끝난 뒤의 Enter만 전송으로 처리한다.
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      send(query);
    }
  }

  function resetConversation() {
    setExchanges([]);
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h1 className="flex items-center gap-2 text-[12.5px] font-semibold text-sage-dark">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" aria-hidden="true" />
          소담이에게 물어보세요
        </h1>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openHistory}
            className="text-[12px] tracking-wide text-ink-soft/60 hover:text-ink-soft transition-colors"
          >
            지난 대화
          </button>
          {hasConversation && (
            <button
              type="button"
              onClick={resetConversation}
              className="text-[12px] tracking-wide text-ink-soft/60 hover:text-ink-soft transition-colors"
            >
              새 대화
            </button>
          )}
        </div>
      </div>

      <div>
        {hasConversation && (
          <div ref={scrollRef} className="pb-1">
            {exchanges.map((ex, i) => (
              <div key={i} className={cn(i > 0 && 'border-t border-border-soft/70 pt-5 mt-5')}>
                <p className="inline-block max-w-[85%] bg-cream-warm text-ink-soft text-[13px] rounded-2xl rounded-tl-sm px-3.5 py-2 mb-3">
                  {ex.question}
                </p>

                {ex.reply && (
                  <div className="mb-3">
                    <StructuredReplyView text={ex.reply} size="md" ingredientList={ex.ingredientList} />
                  </div>
                )}

                {(ex.ingredients?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ex.ingredients!.map((item, j) =>
                      item.ingredient ? (
                        <Link
                          key={j}
                          href={`/ingredient/${encodeURIComponent(item.ingredient.name)}`}
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
                  <ul className="-mx-2 divide-y divide-border-soft/70 mb-2">
                    {ex.dishes!.map((dish, j) =>
                      dish.recipe ? (
                        <li key={j}>
                          <Link
                            href={`/recipe/${dish.recipe.id}`}
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
                        </li>
                      ) : (
                        <li key={j} className="px-2 py-2.5">
                          <p className="text-[15px] text-ink font-medium">{dish.name}</p>
                          <p className="text-[13px] text-ink-soft mt-0.5">{dish.reason}</p>
                        </li>
                      )
                    )}
                  </ul>
                )}

                {i === exchanges.length - 1 && isLoading && (
                  <p className="flex items-center gap-1.5 text-[14px] text-ink-soft/60 pb-2">
                    소담이가 생각하고 있어요
                    <span className="inline-flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-ink-soft/40 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-1 rounded-full bg-ink-soft/40 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-1 rounded-full bg-ink-soft/40 animate-bounce" />
                    </span>
                  </p>
                )}

                {ex.error && <p className="text-[14px] text-terracotta pb-2">{ex.error}</p>}
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            'py-3',
            hasConversation && 'border-t border-border-soft mt-1'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2 rounded-2xl bg-cream-warm/50 border border-border-soft px-3.5 transition-all',
              hasConversation ? 'h-12' : 'h-[52px]'
            )}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasConversation ? '더 물어보기' : QUICK_PROMPTS[placeholderIndex]
              }
              aria-label="재료나 상황을 알려주시면 소담이가 요리를 추천해드려요"
              className={cn(
                'flex-1 bg-transparent text-ink min-w-0 outline-none',
                'placeholder:text-ink-soft/45 focus:placeholder:text-ink-soft/25 transition-colors',
                hasConversation ? 'text-[15px]' : 'text-[16.5px]'
              )}
            />
            <button
              type="button"
              onClick={() => send(query)}
              disabled={!query.trim() || isLoading}
              aria-label="소담이에게 물어보기"
              className={cn(
                'flex-shrink-0 p-2 -mr-1 rounded-full transition-colors',
                query.trim() && !isLoading
                  ? 'bg-ink text-cream'
                  : 'text-ink-soft/25 cursor-not-allowed'
              )}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>

      {!hasConversation && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setExamplesOpen((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase text-ink-soft/50 font-medium"
          >
            이런 것도 물어볼 수 있어요
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn('transition-transform', examplesOpen && 'rotate-180')}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <AnimatePresence initial={false}>
            {examplesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-3">
                  {PROMPT_CATEGORIES.map((category) => (
                    <div key={category.label}>
                      <p className="text-[11.5px] text-sage font-medium mb-1.5">{category.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {category.prompts.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => send(prompt)}
                            className="text-[13.5px] text-ink-soft bg-cream-warm/60 border border-border-soft rounded-full px-3 py-1.5 hover:border-sage/40 hover:text-ink transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="fixed inset-0 bg-ink/30 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-cream rounded-t-3xl flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-soft shrink-0">
                <p className="font-display text-[17px] text-ink font-medium">소담이와 나눈 이야기</p>
                <button
                  onClick={() => setHistoryOpen(false)}
                  aria-label="닫기"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft/60 hover:text-ink-soft transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {pastQueries === null && (
                  <p className="text-[14px] text-ink-soft text-center py-8">불러오는 중...</p>
                )}
                {pastQueries?.length === 0 && (
                  <p className="text-[14px] text-ink-soft text-center py-8">
                    아직 나눈 이야기가 없어요. 지금 첫 질문을 건네보세요!
                  </p>
                )}
                {pastQueries?.map((q, i) => (
                  <div
                    key={q.id}
                    className={cn(i > 0 && 'border-t border-border-soft/70 pt-4 mt-4')}
                  >
                    <p className="text-[12px] text-ink-soft/60 mb-1.5">
                      {new Date(q.createdAt).toLocaleDateString('ko-KR', {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-[13px] text-ink-soft mb-1.5">{q.message}</p>
                    <p className="text-[14.5px] text-ink leading-relaxed whitespace-pre-wrap break-words">
                      {q.reply}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

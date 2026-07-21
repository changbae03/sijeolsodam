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
  const [historySearch, setHistorySearch] = useState('');
  const [searchResults, setSearchResults] = useState<PastQuery[] | null>(null);
  const [searching, setSearching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = exchanges.length > 0;

  /**
   * 지난 대화를 별도 시트로 띄우지 않고 이 대화창 안에서 펼친다.
   * 같은 화면에서 이어 읽어야 흐름이 끊기지 않는다는 피드백을 반영.
   */
  function openHistory() {
    if (!user) {
      router.push('/login');
      return;
    }
    const next = !historyOpen;
    setHistoryOpen(next);
    if (!next) {
      // 닫을 때 검색 상태 초기화
      setHistorySearch('');
      setSearchResults(null);
    }
    if (next && !pastQueries) {
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

  // 지난 대화를 펼치면 목록 스크롤을 맨 아래(가장 최근)에 맞춘다.
  // 오래된 대화는 위로 스크롤해서 거슬러 올라가는 형태. (검색 중일 땐 앵커링 안 함)
  useEffect(() => {
    if (!historyOpen || historySearch.trim()) return;
    if (!pastQueries || pastQueries.length === 0) return;
    const el = historyScrollRef.current;
    if (!el) return;
    const anchorToLatest = () => {
      el.scrollTop = el.scrollHeight;
    };
    anchorToLatest();
    const raf = requestAnimationFrame(anchorToLatest);
    return () => cancelAnimationFrame(raf);
  }, [historyOpen, pastQueries, historySearch]);

  // 지난 대화 키워드 검색 (디바운스 300ms, 서버에서 전체 내역 대상 검색)
  useEffect(() => {
    if (!historyOpen) return;
    const keyword = historySearch.trim();
    if (!keyword) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/agent-queries?q=${encodeURIComponent(keyword)}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data.queries ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [historySearch, historyOpen]);

  // 지난 대화 한 건(질문 말풍선 + 날짜 + 구조화 답변)을 그리는 공용 렌더러
  const renderPastItem = (q: PastQuery, i: number) => (
    <div key={q.id} className={cn(i > 0 && 'border-t border-border-soft/70 pt-5 mt-5')}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="inline-block max-w-[85%] rounded-2xl rounded-tl-sm bg-cream-warm px-3.5 py-2 text-[13px] text-ink-soft">
          {q.message}
        </span>
        <span className="shrink-0 text-[11.5px] text-ink-soft/50">
          {new Date(q.createdAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
        </span>
      </div>
      <StructuredReplyView text={q.reply} size="md" />
    </div>
  );

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
            {historyOpen ? '지난 대화 접기' : '지난 대화'}
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
        {/* 지난 대화 — 대화창 안에서 위쪽에 이어 붙는다 (오래된 것부터 아래로 이어짐) */}
        {historyOpen && (
          <div className="mb-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px flex-1 bg-border-soft" />
              <span className="text-[11.5px] tracking-[0.08em] text-ink-soft/60">지난 대화</span>
              <span className="h-px flex-1 bg-border-soft" />
            </div>

            {pastQueries === null && (
              <p className="py-6 text-center text-[13.5px] text-ink-soft">불러오는 중...</p>
            )}
            {pastQueries?.length === 0 && (
              <p className="py-6 text-center text-[13.5px] text-ink-soft">
                아직 나눈 이야기가 없어요. 지금 첫 질문을 건네보세요!
              </p>
            )}

            {/* 키워드 검색창 */}
            {pastQueries && pastQueries.length > 0 && (
              <div className="relative mb-3">
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="지난 대화 검색 (예: 명란, 파스타)"
                  className="w-full rounded-xl border border-border-soft bg-cream-warm/40 py-2 pl-3.5 pr-8 text-[13px] text-ink placeholder:text-ink-soft/50 focus:border-ink-soft/40 focus:outline-none"
                />
                {historySearch && (
                  <button
                    type="button"
                    onClick={() => setHistorySearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-1 text-[16px] leading-none text-ink-soft/50 hover:text-ink-soft"
                    aria-label="검색어 지우기"
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {historySearch.trim() ? (
              /* 검색 모드 — 전체 내역에서 찾은 결과를 최신순으로 (스크롤 앵커링 없음) */
              <div className="max-h-[420px] overflow-y-auto pr-1">
                {searching && (
                  <p className="py-6 text-center text-[13.5px] text-ink-soft">검색 중...</p>
                )}
                {!searching && searchResults && searchResults.length === 0 && (
                  <p className="py-6 text-center text-[13.5px] text-ink-soft">
                    ‘{historySearch.trim()}’에 대한 지난 대화가 없어요.
                  </p>
                )}
                {!searching && searchResults && searchResults.length > 0 && (
                  <>
                    <p className="mb-3 text-[12px] text-ink-soft/60">
                      {searchResults.length}개 찾음
                    </p>
                    {searchResults.map((q, i) => renderPastItem(q, i))}
                  </>
                )}
              </div>
            ) : (
              /* 기본 목록 — 오래된 것 위 → 최근 아래, 펼치면 맨 아래(최근)로 앵커링 */
              pastQueries &&
              pastQueries.length > 0 && (
                <div ref={historyScrollRef} className="max-h-[420px] overflow-y-auto pr-1">
                  {[...pastQueries].reverse().map((q, i) => renderPastItem(q, i))}
                </div>
              )
            )}

            {hasConversation && !historySearch.trim() && (
              <div className="mt-4 flex items-center gap-2">
                <span className="h-px flex-1 bg-border-soft" />
                <span className="text-[11.5px] tracking-[0.08em] text-ink-soft/60">지금 대화</span>
                <span className="h-px flex-1 bg-border-soft" />
              </div>
            )}
          </div>
        )}

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
                  <>
                    {/* 이름이 비슷하다는 이유로 엉뚱한 레시피가 붙는 경우가 있어,
                        '정답'이 아니라 참고용임을 분명히 밝힌다 */}
                    <p className="mb-1.5 text-[11.5px] font-semibold tracking-[0.04em] text-ink-soft/60">
                      참고할 만한 레시피
                    </p>
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
                  </>
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

    </div>
  );
}

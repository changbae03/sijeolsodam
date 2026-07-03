'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';

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

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  dishes?: RecipeSuggestion[];
  ingredients?: IngredientSuggestion[];
}

const QUICK_PROMPTS = [
  '냉장고 파먹기 도와줘',
  '손님 초대했는데 뭘 낼까요?',
  '오늘은 매콤한 게 당겨요',
  '지금 제철 재료 뭐가 좋아요?',
];

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function HomeAgentHero() {
  const [query, setQuery] = useState('');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = turns.length > 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, isLoading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const historyForApi = turns.map((t) => ({ role: t.role, content: t.content }));
    const nextTurns: ChatTurn[] = [...turns, { role: 'user', content: trimmed }];
    setTurns(nextTurns);
    setQuery('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ingredient-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: historyForApi }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || '잠시 후 다시 시도해주세요.');
      } else {
        setTurns((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, dishes: data.dishes, ingredients: data.ingredients },
        ]);
      }
    } catch {
      setErrorMsg('소담이와 연결이 원활하지 않아요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') send(query);
  }

  function resetConversation() {
    setTurns([]);
    setErrorMsg(null);
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <section className="max-w-md mx-auto px-5 pt-2 pb-6">
      <div
        className={cn(
          'bg-paper border rounded-3xl shadow-sm transition-all duration-300',
          hasConversation ? 'border-sage/40' : 'border-border-soft'
        )}
      >
        {/* 대화 스레드 — 대화가 시작되면 나타남 */}
        {hasConversation && (
          <div ref={scrollRef} className="max-h-[52vh] overflow-y-auto px-4 pt-4 pb-2 space-y-4">
            {turns.map((turn, i) =>
              turn.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[85%] bg-sage text-white text-[14px] leading-relaxed rounded-2xl rounded-tr-sm px-3.5 py-2">
                    {turn.content}
                  </p>
                </div>
              ) : (
                <div key={i} className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-sage flex-shrink-0">
                      <SparkleIcon className="h-4 w-4" />
                    </span>
                    <p className="text-[14px] text-ink leading-relaxed">{turn.content}</p>
                  </div>

                  {(turn.ingredients?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 pl-6">
                      {turn.ingredients!.map((item, j) =>
                        item.ingredient ? (
                          <Link
                            key={j}
                            href={`/ingredient/${encodeURIComponent(item.ingredient.name)}`}
                            className="flex items-center gap-1.5 bg-cream-warm/60 border border-border-soft rounded-full pl-2 pr-3 py-1.5 hover:border-sage/50 transition-colors"
                          >
                            <span className="text-[15px]">{item.ingredient.emoji}</span>
                            <span className="text-[13px] text-ink font-medium">{item.ingredient.name}</span>
                          </Link>
                        ) : (
                          <span
                            key={j}
                            className="bg-cream-warm/40 border border-dashed border-border-soft rounded-full px-3 py-1.5 text-[13px] text-ink-soft"
                          >
                            {item.name}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {(turn.dishes?.length ?? 0) > 0 && (
                    <ul className="space-y-2 pl-6">
                      {turn.dishes!.map((dish, j) => (
                        <li key={j}>
                          {dish.recipe ? (
                            <Link
                              href={`/recipe/${dish.recipe.id}`}
                              className="flex items-center gap-3 rounded-xl border border-border-soft hover:border-sage/50 hover:bg-cream-warm/40 transition-colors p-2"
                            >
                              <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-cream-warm">
                                <Image
                                  src={dish.recipe.heroImage}
                                  alt={dish.recipe.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[14px] text-ink font-medium truncate">
                                  {dish.recipe.title}
                                </p>
                                <p className="text-[12px] text-ink-soft truncate">{dish.reason}</p>
                              </div>
                              <span className="flex-shrink-0 text-sage text-[12px] font-medium">
                                레시피 →
                              </span>
                            </Link>
                          ) : (
                            <div className="rounded-xl border border-dashed border-border-soft p-3">
                              <p className="text-[14px] text-ink font-medium">{dish.name}</p>
                              <p className="text-[12px] text-ink-soft mt-0.5">{dish.reason}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-ink-soft text-[13px] pl-6 pb-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage animate-pulse" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage animate-pulse [animation-delay:150ms]" />
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-sage animate-pulse [animation-delay:300ms]" />
                <span>소담이가 생각하고 있어요...</span>
              </div>
            )}

            {errorMsg && <p className="text-[13px] text-terracotta pl-6 pb-1">{errorMsg}</p>}
          </div>
        )}

        {/* 입력창 — 항상 하단(또는 대화 없을 땐 전체)에 위치 */}
        <div className={cn('px-3 py-3', hasConversation && 'border-t border-border-soft')}>
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-2xl transition-all',
              hasConversation ? 'h-12 px-3.5 bg-cream-warm/50' : 'h-16 px-5 bg-cream-warm/40'
            )}
          >
            <span className={cn('text-sage flex-shrink-0', !hasConversation && 'h-5 w-5')}>
              <SparkleIcon className={hasConversation ? 'h-4 w-4' : 'h-5 w-5'} />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                hasConversation ? '더 물어보기...' : '냉장고 속 재료나 오늘 기분을 알려주세요'
              }
              aria-label="재료나 상황을 알려주시면 소담이가 요리를 추천해드려요"
              className={cn(
                'flex-1 bg-transparent text-ink min-w-0 outline-none',
                'placeholder:text-ink-soft/50 focus:placeholder:text-ink-soft/30 transition-colors',
                hasConversation ? 'text-[14px]' : 'text-[16px]'
              )}
            />
            <button
              type="button"
              onClick={() => send(query)}
              disabled={!query.trim() || isLoading}
              aria-label="소담이에게 물어보기"
              className={cn(
                'flex-shrink-0 rounded-full flex items-center justify-center transition-colors',
                hasConversation ? 'h-8 w-8' : 'h-10 w-10',
                query.trim() && !isLoading
                  ? 'bg-sage text-white hover:bg-sage-dark'
                  : 'bg-border-soft text-ink-soft/40 cursor-not-allowed'
              )}
            >
              <SendIcon />
            </button>
          </div>

          {hasConversation && (
            <button
              type="button"
              onClick={resetConversation}
              className="mt-2 text-[12px] text-ink-soft/70 hover:text-ink-soft transition-colors"
            >
              새로운 대화 시작하기
            </button>
          )}
        </div>
      </div>

      {/* 빠른 시작 칩 — 대화 시작 전에만 노출 */}
      {!hasConversation && (
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => send(prompt)}
              className="text-[12.5px] text-ink-soft bg-paper border border-border-soft rounded-full px-3 py-1.5 hover:border-sage/50 hover:text-ink transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

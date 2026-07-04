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

interface Exchange {
  question: string;
  reply?: string;
  dishes?: RecipeSuggestion[];
  ingredients?: IngredientSuggestion[];
  error?: string;
}

const QUICK_PROMPTS = [
  '냉장고 파먹기 도와줘',
  '손님 초대했는데 뭘 낼까요?',
  '오늘은 매콤한 게 당겨요',
  '지금 제철 재료 뭐가 좋아요?',
];

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

export default function HomeAgentHero() {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasConversation = exchanges.length > 0;

  useEffect(() => {
    if (hasConversation) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % QUICK_PROMPTS.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [hasConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    if (e.key === 'Enter') send(query);
  }

  function resetConversation() {
    setExchanges([]);
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <section className="max-w-md mx-auto px-5 pt-2 pb-7">
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <span className="h-px w-8 bg-sage" />
          <h2 className="font-display text-[17px] tracking-tight text-ink font-medium">
            무엇을 만들까요
          </h2>
        </div>
        {hasConversation && (
          <button
            type="button"
            onClick={resetConversation}
            className="text-[11px] tracking-wide text-ink-soft/60 hover:text-ink-soft transition-colors"
          >
            새 대화
          </button>
        )}
      </div>

      <div
        className="bg-paper border border-border-soft rounded-2xl overflow-hidden"
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        {hasConversation && (
          <div ref={scrollRef} className="max-h-[56vh] overflow-y-auto px-5 pt-5 pb-1">
            {exchanges.map((ex, i) => (
              <div key={i} className={cn(i > 0 && 'border-t border-border-soft/70 pt-5 mt-5')}>
                <p className="text-[12px] text-ink-soft/70 mb-2">{ex.question}</p>

                {ex.reply && (
                  <p className="font-display text-[16px] leading-snug text-ink mb-3 whitespace-pre-wrap break-words">
                    {ex.reply}
                  </p>
                )}

                {(ex.ingredients?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ex.ingredients!.map((item, j) =>
                      item.ingredient ? (
                        <Link
                          key={j}
                          href={`/ingredient/${encodeURIComponent(item.ingredient.name)}`}
                          className="inline-flex items-center gap-1 bg-sage/10 text-sage border border-sage/20 rounded-full px-2.5 py-1 text-[12px] font-medium hover:bg-sage/15 transition-colors"
                        >
                          <span>{item.ingredient.emoji}</span>
                          {item.ingredient.name}
                        </Link>
                      ) : (
                        <span
                          key={j}
                          className="inline-flex items-center bg-cream-warm text-ink-soft border border-border-soft rounded-full px-2.5 py-1 text-[12px]"
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
                              <p className="text-[14px] text-ink font-medium truncate">
                                {dish.recipe.title}
                              </p>
                              <p className="text-[12px] text-ink-soft truncate">{dish.reason}</p>
                            </div>
                            <span className="flex-shrink-0 text-ink-soft/40 text-[13px]">›</span>
                          </Link>
                        </li>
                      ) : (
                        <li key={j} className="px-2 py-2.5">
                          <p className="text-[14px] text-ink font-medium">{dish.name}</p>
                          <p className="text-[12px] text-ink-soft mt-0.5">{dish.reason}</p>
                        </li>
                      )
                    )}
                  </ul>
                )}

                {i === exchanges.length - 1 && isLoading && (
                  <p className="text-[13px] text-ink-soft/60 pb-2">소담이가 생각하고 있어요</p>
                )}

                {ex.error && <p className="text-[13px] text-terracotta pb-2">{ex.error}</p>}
              </div>
            ))}
          </div>
        )}

        <div className={cn('px-4 py-3', hasConversation && 'border-t border-border-soft')}>
          <div
            className={cn(
              'flex items-center gap-2 transition-all',
              hasConversation ? 'h-11' : 'h-14'
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
                hasConversation ? 'text-[14px]' : 'text-[15.5px]'
              )}
            />
            <button
              type="button"
              onClick={() => send(query)}
              disabled={!query.trim() || isLoading}
              aria-label="소담이에게 물어보기"
              className={cn(
                'flex-shrink-0 p-2 -mr-1.5 rounded-lg transition-colors',
                query.trim() && !isLoading
                  ? 'text-ink hover:bg-cream-warm'
                  : 'text-ink-soft/25 cursor-not-allowed'
              )}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>

      {!hasConversation && (
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => send(prompt)}
              className="text-[12.5px] text-ink-soft bg-cream-warm/60 border border-border-soft rounded-full px-3 py-1.5 hover:border-sage/40 hover:text-ink transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

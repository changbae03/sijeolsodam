'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface AgentDish {
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

interface AgentResult {
  reply: string;
  dishes: AgentDish[];
}

const PLACEHOLDER_ROTATION = [
  '애호박이랑 두부 있는데 뭐 해먹지?',
  '손님 초대했는데 뭘 낼까요?',
  '오늘은 매콤한 게 당겨요',
  '자취생 한 끼, 뭐가 좋을까요?',
];

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

export default function HomeAgentInput() {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 포커스가 없을 때 몇 초마다 placeholder 예시를 바꿔가며 사용법을 넌지시 안내
  useEffect(() => {
    if (isOpen) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_ROTATION.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isOpen]);

  // 바깥 클릭 시 패널 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSubmit() {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setIsOpen(true);

    try {
      const res = await fetch('/api/ingredient-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || '잠시 후 다시 시도해주세요.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch {
      setErrorMsg('소담이와 연결이 원활하지 않아요. 잠시 후 다시 시도해주세요.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          'flex items-center gap-2 transition-all duration-200',
          'bg-paper border rounded-xl h-10 px-3.5',
          isOpen ? 'border-sage' : 'border-border-soft'
        )}
      >
        <span className="text-sage flex-shrink-0">
          <SparkleIcon />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={PLACEHOLDER_ROTATION[placeholderIndex]}
          aria-label="재료나 상황을 알려주시면 소담이가 요리를 추천해드려요"
          className={cn(
            'flex-1 bg-transparent text-[14px] text-ink min-w-0',
            'placeholder:text-ink-soft/50',
            'outline-none focus:placeholder:text-ink-soft/30 transition-colors'
          )}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          aria-label="소담이에게 물어보기"
          className={cn(
            'flex-shrink-0 -mr-1 p-1.5 rounded-lg transition-colors',
            query.trim() && !isLoading
              ? 'text-sage hover:bg-sage/10'
              : 'text-ink-soft/30 cursor-not-allowed'
          )}
        >
          <SendIcon />
        </button>
      </div>

      {isOpen && (
        <div
          role="region"
          aria-live="polite"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 bg-paper border border-border-soft rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="max-h-[70vh] overflow-y-auto p-4">
            {isLoading && (
              <div className="flex items-center gap-2 text-ink-soft text-[13px] py-2">
                <span className="inline-block h-2 w-2 rounded-full bg-sage animate-pulse" />
                소담이가 생각하고 있어요...
              </div>
            )}

            {!isLoading && errorMsg && (
              <p className="text-[13px] text-terracotta py-2">{errorMsg}</p>
            )}

            {!isLoading && result && (
              <>
                <p className="text-[14px] text-ink leading-relaxed mb-4">{result.reply}</p>
                <ul className="space-y-2.5">
                  {result.dishes.map((dish, i) => (
                    <li key={`${dish.name}-${i}`}>
                      {dish.recipe ? (
                        <Link
                          href={`/recipe/${dish.recipe.id}`}
                          onClick={() => setIsOpen(false)}
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

import { allRecipes } from '@/data/recipes';
import { SearchBar } from '@/components/ui';
import RecipeCard from '@/components/RecipeCard';
import Logo from '@/components/Logo';

const PAGE_SIZE = 30; // 2,635개를 한 번에 그리지 않도록 점진 렌더
const STATE_KEY = 'recipes-tab-state'; // 상세 갔다 돌아올 때 검색어·펼친 개수·스크롤 복원용

function loadSavedState(): { query: string; visibleCount: number; scrollY: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function RecipesPage() {
  const saved = useRef(loadSavedState());
  const [query, setQuery] = useState(saved.current?.query ?? '');
  const [visibleCount, setVisibleCount] = useState(saved.current?.visibleCount ?? PAGE_SIZE);

  // 복원: 저장된 개수만큼 렌더된 뒤 스크롤 위치로 이동
  useEffect(() => {
    const y = saved.current?.scrollY;
    if (y && y > 0) {
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
    saved.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마운트 시 1회만
  }, []);

  // 저장: 상태·스크롤이 바뀔 때마다 세션에 기록 (뒤로가기 대비)
  useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem(
          STATE_KEY,
          JSON.stringify({ query, visibleCount, scrollY: window.scrollY })
        );
      } catch {
        // 세션 저장 실패는 무시 (복원만 못 할 뿐)
      }
    };
    save();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      setTimeout(() => {
        save();
        ticking = false;
      }, 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [query, visibleCount]);

  const filtered = query.trim()
    ? allRecipes.filter(
        (r) =>
          r.title.includes(query) ||
          r.mainIngredient.includes(query) ||
          r.category.includes(query)
      )
    : allRecipes;

  return (
    <main className="max-w-md mx-auto px-5 pt-6 pb-10">
      <header className="mb-6">
        <Logo size="sm" />
        <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mt-5 mb-1.5">
          {allRecipes.length.toLocaleString()}개의 계절 레시피
        </p>
        <h1 className="text-[26px] text-ink font-bold tracking-[-0.02em] leading-tight">
          레시피
        </h1>
      </header>

      <div className="mb-6">
        <SearchBar
          placeholder="레시피, 재료, 카테고리로 검색"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE); // 새 검색은 첫 페이지부터
          }}
        />
      </div>

      <div className="mb-5">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink">
          {query ? `'${query}' 검색 결과` : '모든 레시피'}
        </h2>
        {query && (
          <p className="text-[12.5px] text-ink-soft/60 mt-1">{filtered.length}개를 찾았어요</p>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[14px] text-ink-soft/70 text-center py-16">
          검색 결과가 없어요. 다른 키워드로 찾아보세요.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {filtered.slice(0, visibleCount).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          {filtered.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl border border-border-soft bg-paper text-[14px] font-medium text-ink"
            >
              레시피 더 보기 ({(filtered.length - visibleCount).toLocaleString()}개 남음)
            </button>
          )}
        </>
      )}
    </main>
  );
}

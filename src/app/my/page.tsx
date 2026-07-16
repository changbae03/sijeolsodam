'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import { getRecipesByIds } from '@/data/recipes';
import { findIngredientByName } from '@/data/months';
import { getCurrentSolarTerm } from '@/data/solar-terms';
import RecipeCard from '@/components/RecipeCard';

interface ViewSummary {
  recipeIds: string[];
  totalViewed: number;
  topIngredients: string[];
}

export default function MyPage() {
  const { user, loading, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const [views, setViews] = useState<ViewSummary | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch('/api/recipe-views')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.recipeIds) setViews(data);
      })
      .catch(() => {
        // 조회 요약은 부가 정보라 실패해도 페이지는 정상 동작
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <main className="max-w-md mx-auto px-5 pt-16 text-center">
        <p className="text-[14px] text-ink-soft">불러오는 중...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-6 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[19px] font-bold tracking-[-0.01em] text-ink mb-2">
            로그인하고 즐겨찾기를 모아보세요
          </p>
          <p className="text-[14px] text-ink-soft mb-6">
            마음에 드는 레시피를 저장해두면 언제든 다시 찾아볼 수 있어요.
          </p>
          <motion.div whileTap={{ scale: 0.96 }} className="inline-block">
            <Link
              href="/login"
              className="inline-block bg-ink text-cream rounded-2xl px-8 py-3.5 text-[15px] font-semibold"
            >
              로그인하기
            </Link>
          </motion.div>
        </motion.div>
      </main>
    );
  }

  const favoriteRecipes = getRecipesByIds(Array.from(favoriteIds));
  const recentRecipes = views ? getRecipesByIds(views.recipeIds).slice(0, 10) : [];
  // 데이터에 실제 존재하는 재료만 칩으로 (조회 기록의 main_ingredient가 개편 전 이름일 수 있음)
  const topIngredients = (views?.topIngredients ?? []).filter((n) => findIngredientByName(n));
  const { current: currentTerm } = getCurrentSolarTerm();

  return (
    <main className="max-w-md mx-auto px-5 pt-6 pb-12">
      {/* ============================================
          1. 헤더
         ============================================ */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">마이페이지</p>
        <h1 className="text-[24px] text-ink font-bold tracking-[-0.02em] leading-tight">
          {user.name ? `${user.name}님` : user.email}
        </h1>
      </motion.header>

      {/* ============================================
          2. 나의 시절 요약 — 즐겨찾기 · 둘러본 레시피 · 지금 절기
         ============================================ */}
      <section className="mb-8">
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl bg-paper border border-border-soft px-3 py-3.5 text-center">
            <p className="text-[20px] font-bold tracking-[-0.02em] text-ink tabular-nums">
              {favoriteRecipes.length}
            </p>
            <p className="text-[11.5px] text-ink-soft mt-0.5">즐겨찾기</p>
          </div>
          <div className="rounded-2xl bg-paper border border-border-soft px-3 py-3.5 text-center">
            <p className="text-[20px] font-bold tracking-[-0.02em] text-ink tabular-nums">
              {views?.totalViewed ?? '–'}
            </p>
            <p className="text-[11.5px] text-ink-soft mt-0.5">둘러본 레시피</p>
          </div>
          <div
            className="rounded-2xl px-3 py-3.5 text-center text-cream"
            style={{
              background: `linear-gradient(160deg, ${currentTerm.theme.mid}, ${currentTerm.theme.deep})`,
            }}
          >
            <p className="font-season text-[19px] font-semibold leading-[1.15]">
              {currentTerm.name}
            </p>
            <p className="text-[11.5px] text-white/70 mt-0.5">지금 절기</p>
          </div>
        </div>
      </section>

      {/* ============================================
          3. 자주 찾는 재료 — 조회 기록에서 추출한 취향 칩
         ============================================ */}
      {topIngredients.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
            자주 찾는 재료
          </h2>
          <div className="flex flex-wrap gap-2">
            {topIngredients.map((name) => (
              <Link
                key={name}
                href={`/ingredient/${encodeURIComponent(name)}`}
                className="rounded-full border border-border-soft bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink"
              >
                {name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          4. 최근 본 레시피 — 가로 스크롤
         ============================================ */}
      {recentRecipes.length > 0 && (
        <section className="mb-8 -mx-5">
          <h2 className="px-5 text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
            최근 본 레시피
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5 snap-x scroll-px-5">
            {recentRecipes.map((recipe) => (
              <div key={recipe.id} className="w-[150px] flex-shrink-0 snap-start">
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          5. 즐겨찾기한 레시피
         ============================================ */}
      <section className="mb-8">
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">
          즐겨찾기한 레시피 {favoriteRecipes.length > 0 && `· ${favoriteRecipes.length}`}
        </h2>
        {favoriteRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-paper rounded-2xl border border-border-soft px-5 py-10 text-center"
          >
            <p className="text-[14.5px] text-ink-soft">
              아직 즐겨찾기한 레시피가 없어요.
              <br />
              마음에 드는 레시피를 하트로 저장해보세요.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favoriteRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================
          6. 계정
         ============================================ */}
      <section>
        <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">계정</h2>
        <div className="rounded-2xl bg-paper border border-border-soft divide-y divide-border-soft/70">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[14px] text-ink-soft">이메일</span>
            <span className="text-[14px] text-ink font-medium">{user.email}</span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-between px-4 py-3.5"
          >
            <span className="text-[14px] text-ink-soft">로그아웃</span>
            <span className="text-ink-soft/40">›</span>
          </button>
        </div>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';
import { getRecipesByIds } from '@/data/recipes';
import RecipeCard from '@/components/RecipeCard';

export default function MyPage() {
  const { user, loading, logout } = useAuth();
  const { favoriteIds } = useFavorites();

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

  return (
    <main className="max-w-md mx-auto px-5 pt-6">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <p className="text-[12px] tracking-[0.08em] text-sage font-semibold mb-1.5">마이페이지</p>
          <h1 className="text-[24px] text-ink font-bold tracking-[-0.02em] leading-tight">
            {user.name ? `${user.name}님` : user.email}
          </h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="text-[14px] text-ink-soft border border-border-soft rounded-full px-3.5 py-1.5"
        >
          로그아웃
        </motion.button>
      </motion.header>

      <section>
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
    </main>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Recipe } from '@/data/types';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favored = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleFavorite(recipe.id);
  };

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="will-change-transform">
      <Link
        href={`/recipe/${recipe.id}`}
        className="block bg-paper rounded-2xl overflow-hidden border border-border-soft shadow-sm"
      >
        <div className="relative w-full aspect-[4/5]">
          <Image
            src={recipe.heroImage}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover img-editorial"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
          {recipe.masterclass && recipe.level === 'chef' && (
            <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-1 rounded-full bg-terracotta text-paper">
              ✨ 마스터클래스
            </span>
          )}
          {user && (
            <motion.button
              onClick={handleFavoriteClick}
              aria-label={favored ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              whileTap={{ scale: 0.8 }}
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-ink/35 backdrop-blur-sm flex items-center justify-center"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={favored ? 'filled' : 'empty'}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  <HeartIcon filled={favored} />
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3.5">
            <h3 className="font-display text-[15px] text-cream leading-snug line-clamp-2 drop-shadow-sm">
              {recipe.title}
            </h3>
            {/* 조리시간 + 난이도만 간결하게 */}
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-cream/85">
              <span>{recipe.cookTime}분</span>
              <span className="w-0.5 h-0.5 rounded-full bg-cream/50" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? '#C45D3A' : 'none'}
      stroke={filled ? '#C45D3A' : '#ffffff'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

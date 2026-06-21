'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';

export default function FavoriteButton({ recipeId }: { recipeId: string }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const favored = isFavorite(recipeId);

  const handleClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    toggleFavorite(recipeId);
  };

  return (
    <motion.button
      onClick={handleClick}
      aria-label={favored ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      whileTap={{ scale: 0.85 }}
      className="w-10 h-10 rounded-full bg-paper border border-border-soft flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={favored ? 'filled' : 'empty'}
          initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-center"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={favored ? '#C45D3A' : 'none'}
            stroke={favored ? '#C45D3A' : '#5a5650'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

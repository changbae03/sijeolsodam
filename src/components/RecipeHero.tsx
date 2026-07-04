'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'motion/react';
import FavoriteButton from './FavoriteButton';

interface RecipeHeroProps {
  heroImage: string;
  title: string;
  recipeId: string;
}

export default function RecipeHero({ heroImage, title, recipeId }: RecipeHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 90]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.12]);

  function handleBack() {
    // 직전에 있던 페이지(재료 페이지, 레시피 목록, 홈 AI 추천 결과 등)로 그대로 돌아간다.
    // 이 레시피가 새 탭이나 직접 링크로 열려 히스토리가 없는 경우에만 홈으로 대체 이동한다.
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }

  return (
    <div ref={ref} className="relative w-full aspect-[4/3] overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          sizes="448px"
          priority
          className="object-cover"
        />
      </motion.div>
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로가기"
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2c2a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <div className="absolute top-4 right-4">
        <FavoriteButton recipeId={recipeId} />
      </div>
    </div>
  );
}

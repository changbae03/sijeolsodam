'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import FavoriteButton from './FavoriteButton';

interface RecipeHeroProps {
  heroImage: string;
  title: string;
  recipeId: string;
}

export default function RecipeHero({ heroImage, title, recipeId }: RecipeHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 90]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.12]);

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
      <Link
        href="/"
        aria-label="뒤로가기"
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2c2a26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Link>
      <div className="absolute top-4 right-4">
        <FavoriteButton recipeId={recipeId} />
      </div>
    </div>
  );
}

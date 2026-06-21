'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { getMonthData } from '@/data/months';
import { getRecipesByIds } from '@/data/recipes';
import { getCurrentMonth } from '@/lib/season';
import SolarTermBanner from '@/components/SolarTermBanner';
import IngredientGrid from '@/components/IngredientGrid';
import RecipeCard from '@/components/RecipeCard';
import PriceAlertSection from '@/components/PriceAlertSection';
import Logo from '@/components/Logo';

export default function HomePage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const monthData = getMonthData(selectedMonth);

  if (!monthData) return null;

  const recipes = getRecipesByIds(monthData.recipeIds);

  const handleSwipeMonth = (direction: -1 | 1) => {
    setSelectedMonth((prev) => {
      const next = prev + direction;
      if (next < 1) return 12;
      if (next > 12) return 1;
      return next;
    });
  };

  return (
    <main className="max-w-md mx-auto px-5 pt-6">
      <header className="mb-6">
        <Logo size="md" />
        <h1 className="font-display text-[24px] text-ink mt-1.5 font-semibold tracking-tight">
          제철 달력
        </h1>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMonth}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <section className="mb-7">
            <SolarTermBanner
              monthData={monthData}
              backgroundImage={monthData.bannerImage ?? recipes[0]?.heroImage}
              onSwipeMonth={handleSwipeMonth}
            />
          </section>

          <section className="mb-7">
            <h2 className="font-display text-[17px] text-ink mb-3.5 font-semibold tracking-tight">
              {monthData.month}월의 식재료
            </h2>
            <IngredientGrid ingredients={monthData.ingredients} />
          </section>

          <PriceAlertSection month={selectedMonth} />

          <section className="mb-8">
            <h2 className="font-display text-[17px] text-ink mb-3.5 font-semibold tracking-tight">
              {monthData.month}월의 추천 레시피
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {recipes.map((recipe, idx) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04, ease: 'easeOut' }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

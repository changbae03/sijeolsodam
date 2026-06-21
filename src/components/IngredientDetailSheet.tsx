'use client';

import { motion, AnimatePresence } from 'motion/react';
import { SeasonalIngredient } from '@/data/types';

interface IngredientDetailSheetProps {
  ingredient: SeasonalIngredient | null;
  onClose: () => void;
}

export default function IngredientDetailSheet({
  ingredient,
  onClose,
}: IngredientDetailSheetProps) {
  const hasDetails =
    ingredient &&
    (ingredient.nutrition || ingredient.howToChoose || ingredient.tip || ingredient.goesWellWith);

  return (
    <AnimatePresence>
      {ingredient && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/30 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-cream rounded-t-3xl px-6 pt-5 pb-8 max-h-[80vh] overflow-y-auto"
          >
            <div className="w-10 h-1 bg-border-soft rounded-full mx-auto mb-5" />

            <div className="flex items-center gap-3 mb-1">
              <span className="text-[32px] leading-none">{ingredient.emoji}</span>
              <div>
                <h2 className="font-display text-[20px] text-ink">{ingredient.name}</h2>
                {ingredient.origin && (
                  <span className="inline-flex items-center gap-1 mt-1 text-[11.5px] text-terracotta bg-terracotta/8 rounded-full px-2.5 py-0.5">
                    📍 {ingredient.origin}
                  </span>
                )}
              </div>
            </div>
            <p className="text-[13.5px] text-ink-soft leading-relaxed mt-2">
              {ingredient.description}
            </p>

            {hasDetails ? (
              <div className="mt-5 space-y-3">
                {ingredient.nutrition && (
                  <DetailRow icon="🌿" label="영양" value={ingredient.nutrition} />
                )}
                {ingredient.howToChoose && (
                  <DetailRow icon="👀" label="고르는 법" value={ingredient.howToChoose} />
                )}
                {ingredient.tip && (
                  <DetailRow icon="💡" label="손질·보관 팁" value={ingredient.tip} />
                )}
                {ingredient.goesWellWith && (
                  <DetailRow icon="🍳" label="이렇게 먹어요" value={ingredient.goesWellWith} />
                )}
              </div>
            ) : (
              <p className="text-[12.5px] text-ink-soft/70 mt-5">
                자세한 정보는 곧 채워질 예정이에요.
              </p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-paper rounded-2xl border border-border-soft px-4 py-3">
      <span className="text-[16px] shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[11px] text-sage font-medium mb-0.5">{label}</p>
        <p className="text-[13.5px] text-ink leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

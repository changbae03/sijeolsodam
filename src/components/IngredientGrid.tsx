import Link from 'next/link';
import { SeasonalIngredient, IngredientCategory } from '@/data/types';

interface IngredientGridProps {
  ingredients: SeasonalIngredient[];
}

const CATEGORY_ORDER: IngredientCategory[] = ['채소', '과일', '해산물', '기타'];

const CATEGORY_STYLE: Record<IngredientCategory, { emoji: string; color: string }> = {
  채소: { emoji: '🥬', color: 'text-sage' },
  과일: { emoji: '🍎', color: 'text-terracotta' },
  해산물: { emoji: '🐟', color: 'text-sage-dark' },
  기타: { emoji: '🍽️', color: 'text-ink-soft' },
};

export default function IngredientGrid({ ingredients }: IngredientGridProps) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: ingredients.filter((ing) => ing.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      {grouped.map((group) => {
        const isOdd = group.items.length % 2 === 1;
        const style = CATEGORY_STYLE[group.category];
        return (
          <div key={group.category}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[13px]">{style.emoji}</span>
              <span className={`text-[12.5px] font-medium ${style.color}`}>
                {group.category}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {group.items.map((ing, idx) => {
                const isLastOdd = isOdd && idx === group.items.length - 1;
                return (
                  <Link
                    key={ing.name}
                    href={`/ingredient/${encodeURIComponent(ing.name)}`}
                    className={`text-left bg-paper rounded-2xl border border-border-soft px-4 py-3.5 active:bg-cream-warm transition-colors ${
                      isLastOdd ? 'col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[20px] leading-none">{ing.emoji}</span>
                      <span className="font-medium text-[15px] text-ink">{ing.name}</span>
                    </div>
                    <p className="text-[12px] text-ink-soft leading-snug">{ing.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

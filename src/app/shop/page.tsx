'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { monthsData } from '@/data/months';
import { getShoppableIngredients } from '@/lib/kamis-mapping';
import { Badge, Card } from '@/components/ui';
import Logo from '@/components/Logo';

interface PriceInfo {
  price: number;
  trendPct: number | null; // 30일 전 대비 변동률
}

const SHOP_ITEMS = getShoppableIngredients();

const CATEGORIES = ['전체', '제철', '특가', '산지직송'] as const;
type Category = (typeof CATEGORIES)[number];

export default function ShopPage() {
  const [prices, setPrices] = useState<Record<string, PriceInfo | null>>({});
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState<Category>('전체');

  useEffect(() => {
    let cancelled = false;
    SHOP_ITEMS.forEach(({ ingredient }) => {
      fetch(`/api/ingredient-price?name=${encodeURIComponent(ingredient.name)}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          const latest = data?.comparison?.latest?.price ?? null;
          const monthAgo = data?.comparison?.oneMonthAgo?.price ?? null;
          if (latest == null) {
            setPrices((p) => ({ ...p, [ingredient.name]: null }));
            return;
          }
          const trendPct =
            monthAgo && monthAgo > 0 ? Math.round(((latest - monthAgo) / monthAgo) * 100) : null;
          setPrices((p) => ({ ...p, [ingredient.name]: { price: latest, trendPct } }));
        })
        .catch(() => {
          if (!cancelled) setPrices((p) => ({ ...p, [ingredient.name]: null }));
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleItems = useMemo(() => {
    if (category === '전체') return SHOP_ITEMS;
    if (category === '특가')
      return SHOP_ITEMS.filter((x) => (prices[x.ingredient.name]?.trendPct ?? 0) < 0);
    if (category === '산지직송')
      return SHOP_ITEMS.filter((x) => x.ingredient.origin);
    return SHOP_ITEMS; // '제철' = 기본 전체와 동일 (현재 매핑 품목 모두가 제철 기준)
  }, [category, prices]);

  const originRecommended = monthsData
    .flatMap((m) => m.ingredients)
    .filter((i) => i.origin)
    .slice(0, 6);

  function toggleCart(name: string) {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <main className="max-w-md mx-auto pb-28">
      {/* 헤더: 배송지 + 장바구니 */}
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <div>
          <Logo size="sm" />
          <button className="flex items-center gap-1 text-[12.5px] text-ink-soft mt-2">
            서울특별시 강남구
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          {cart.size > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-terracotta text-paper text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] flex items-center justify-center">
              {cart.size}
            </span>
          )}
        </div>
      </header>

      <div className="px-5">
        {/* 배송 안내 배너 */}
        <div className="bg-sage/10 border border-sage/20 rounded-2xl px-4 py-3 mb-5">
          <p className="text-[13px] text-sage-dark font-medium">
            🚚 지금 주문하면 내일 아침 7시 전에 도착해요
          </p>
        </div>

        {/* 카테고리 칩 */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
                category === cat
                  ? 'bg-ink text-cream'
                  : 'bg-paper text-ink-soft border border-border-soft'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 지금 가장 많이 구매하는 제철 식재료 */}
        <section className="mb-9">
          <h2 className="text-[15.5px] font-semibold text-ink mb-1">
            지금 가장 많이 구매하는 제철 식재료
          </h2>
          <p className="text-[12px] text-ink-soft/70 mb-3.5">실시간 KAMIS 시세 기준</p>

          <div className="grid grid-cols-2 gap-3">
            {visibleItems.map(({ ingredient }) => {
              const info = prices[ingredient.name];
              const inCart = cart.has(ingredient.name);
              return (
                <Card key={ingredient.name} padding="none" className="overflow-hidden">
                  <div className="relative w-full aspect-square bg-cream-warm">
                    {ingredient.imageUrl ? (
                      <Image
                        src={ingredient.imageUrl}
                        alt={ingredient.name}
                        fill
                        sizes="180px"
                        className="object-cover img-editorial"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[36px]">
                        {ingredient.emoji}
                      </div>
                    )}
                    {info && info.trendPct !== null && info.trendPct < 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="terracotta" size="sm">
                          {info.trendPct}%
                        </Badge>
                      </div>
                    )}
                    <button
                      onClick={() => toggleCart(ingredient.name)}
                      aria-label="장바구니에 담기"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-paper/90 backdrop-blur-sm flex items-center justify-center"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill={inCart ? '#C45D3A' : 'none'}
                        stroke={inCart ? '#C45D3A' : 'currentColor'}
                        strokeWidth="2"
                        className="text-ink-soft"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-[13px] font-medium text-ink">{ingredient.name}</p>
                    {info ? (
                      <p className="text-[13.5px] font-semibold text-ink mt-0.5 tabular-nums">
                        {info.price.toLocaleString()}원
                        <span className="text-[10.5px] text-ink-soft/60 font-normal">/kg</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-ink-soft/50 mt-0.5">시세 확인 중...</p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 산지직송 추천 */}
        <section className="mb-4">
          <h2 className="text-[15.5px] font-semibold text-ink mb-3.5">산지직송 추천</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-5 px-5 snap-x">
            {originRecommended.map((ing) => {
              const info = prices[ing.name];
              return (
                <div key={ing.name} className="w-[120px] flex-shrink-0 snap-start">
                  <div className="ingredient-frame rounded-xl mb-2">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-[0_4px_14px_-3px_rgba(44,42,38,0.14)]">
                      {ing.imageUrl ? (
                        <Image src={ing.imageUrl} alt={ing.name} fill sizes="120px" className="object-cover img-editorial" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[28px]">
                          {ing.emoji}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[12.5px] font-medium text-ink leading-tight">{ing.name}</p>
                  <p className="text-[10.5px] text-ink-soft/60 mt-0.5">{ing.origin}</p>
                  <p className="text-[12px] text-terracotta font-medium mt-0.5">
                    {info ? `${info.price.toLocaleString()}원~` : '시세 확인하기'}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 장바구니 담김 안내 바 */}
      {cart.size > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-30 px-5 pb-3">
          <div className="max-w-md mx-auto bg-ink text-cream rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg">
            <span className="text-[13px]">{cart.size}개 담았어요</span>
            <span className="text-[12.5px] text-terracotta-light font-medium">보러 가기 →</span>
          </div>
        </div>
      )}
    </main>
  );
}

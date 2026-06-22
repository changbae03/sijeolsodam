'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SeasonalIngredient } from '@/data/types';

interface IngredientDetailSheetProps {
  ingredient: SeasonalIngredient | null;
  onClose: () => void;
}

interface PriceProfileResponse {
  available: boolean;
  displayName?: string;
  comparison?: {
    latest: { date: string; price: number } | null;
    oneWeekAgo: { date: string; price: number } | null;
    oneMonthAgo: { date: string; price: number } | null;
    oneYearAgo: { date: string; price: number } | null;
  } | null;
  normalYear?: { average: number | null } | null;
  wholesale?: { county: string; market: string | null; date: string; price: number }[] | null;
  monthlyTrend?: { yearMonth: string; avgPrice: number | null }[] | null;
}

export default function IngredientDetailSheet({
  ingredient,
  onClose,
}: IngredientDetailSheetProps) {
  const hasDetails =
    ingredient &&
    (ingredient.nutrition || ingredient.howToChoose || ingredient.tip || ingredient.goesWellWith);

  const [priceProfile, setPriceProfile] = useState<PriceProfileResponse | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    if (!ingredient) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ingredient가 null로 바뀔 때 이전 가격 정보를 정리하는 안전한 패턴
      setPriceProfile(null);
      return;
    }
    let cancelled = false;
    setPriceProfile(null);
    setPriceLoading(true);

    fetch(`/api/ingredient-price?name=${encodeURIComponent(ingredient.name)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPriceProfile(data);
      })
      .catch(() => {
        if (!cancelled) setPriceProfile({ available: false });
      })
      .finally(() => {
        if (!cancelled) setPriceLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ingredient]);

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

            <PriceProfileSection loading={priceLoading} profile={priceProfile} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PriceProfileSection({
  loading,
  profile,
}: {
  loading: boolean;
  profile: PriceProfileResponse | null;
}) {
  if (loading) {
    return (
      <div className="mt-5 bg-paper rounded-2xl border border-border-soft px-4 py-5 text-center text-[12px] text-ink-soft/70">
        시세 정보를 불러오는 중이에요...
      </div>
    );
  }

  if (!profile || !profile.available) return null;

  const { comparison, normalYear, wholesale, monthlyTrend } = profile;
  const fmt = (n: number) => n.toLocaleString() + '원';

  return (
    <div className="mt-5 space-y-3">
      <span className="text-[10px] font-bold text-sage uppercase tracking-wider block">
        📊 KAMIS 농산물유통정보 연동 시세 (서울 소매가 기준)
      </span>

      {comparison && (comparison.latest || comparison.oneWeekAgo || comparison.oneMonthAgo || comparison.oneYearAgo) && (
        <div className="grid grid-cols-2 gap-2 text-center">
          {comparison.latest && (
            <PriceTile label="최근 조사가" price={comparison.latest.price} date={comparison.latest.date} highlight />
          )}
          {comparison.oneWeekAgo && (
            <PriceTile label="1주일 전" price={comparison.oneWeekAgo.price} date={comparison.oneWeekAgo.date} />
          )}
          {comparison.oneMonthAgo && (
            <PriceTile label="1개월 전" price={comparison.oneMonthAgo.price} date={comparison.oneMonthAgo.date} />
          )}
          {comparison.oneYearAgo && (
            <PriceTile label="1년 전 오늘" price={comparison.oneYearAgo.price} date={comparison.oneYearAgo.date} />
          )}
        </div>
      )}

      {normalYear?.average != null && (
        <div className="bg-paper rounded-2xl border border-border-soft px-4 py-3 flex items-center justify-between">
          <span className="text-[12px] text-ink-soft">
            평년가 (최근 5개년 최고·최저 제외 평균)
          </span>
          <span className="text-[14px] font-bold text-ink tabular-nums">{fmt(normalYear.average)}</span>
        </div>
      )}

      {wholesale && wholesale.length > 0 && (
        <div className="bg-ink rounded-2xl px-4 py-3.5 space-y-2">
          <span className="text-[11px] font-bold text-sage/80 block border-b border-white/10 pb-1.5">
            전국 주요 도매시장 당일 경락가
          </span>
          {wholesale.map((w) => (
            <div key={w.county} className="flex justify-between items-center text-[12px] text-white/90">
              <span>
                {w.county}
                {w.market ? ` · ${w.market}` : ''}
              </span>
              <span className="font-bold tabular-nums">{fmt(w.price)}</span>
            </div>
          ))}
        </div>
      )}

      {monthlyTrend && monthlyTrend.length > 1 && <MonthlyTrendSparkline data={monthlyTrend} />}

      <p className="text-[10px] text-ink-soft/60 leading-relaxed">
        자료: KAMIS 농산물유통정보. 도매 경락가는 서울·부산·대구·광주·대전 5개 주요 시장만 제공돼요.
      </p>
    </div>
  );
}

function PriceTile({
  label,
  price,
  date,
  highlight,
}: {
  label: string;
  price: number;
  date: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        highlight ? 'bg-terracotta/8 border-terracotta/20' : 'bg-paper border-border-soft'
      }`}
    >
      <p className="text-[10px] text-ink-soft/70">{label}</p>
      <p className="text-[14px] font-bold text-ink mt-0.5 tabular-nums">{price.toLocaleString()}원</p>
      <p className="text-[9px] text-ink-soft/50 mt-0.5">{date.slice(5)}</p>
    </div>
  );
}

function MonthlyTrendSparkline({ data }: { data: { yearMonth: string; avgPrice: number | null }[] }) {
  const valid = data.filter((d) => d.avgPrice !== null) as { yearMonth: string; avgPrice: number }[];
  if (valid.length < 2) return null;

  const max = Math.max(...valid.map((d) => d.avgPrice));
  const min = Math.min(...valid.map((d) => d.avgPrice));
  const range = max - min || 1;

  return (
    <div className="bg-paper rounded-2xl border border-border-soft px-4 py-3.5">
      <span className="text-[11px] font-bold text-ink-soft block mb-2.5">
        월별 가격 흐름 ({valid[0].yearMonth.slice(0, 4)}년 ~)
      </span>
      <div className="flex items-end gap-[2px] h-12">
        {valid.map((d) => {
          const height = ((d.avgPrice - min) / range) * 100;
          return (
            <div
              key={d.yearMonth}
              title={`${d.yearMonth}: ${d.avgPrice.toLocaleString()}원`}
              className="flex-1 bg-sage/40 rounded-sm min-h-[2px]"
              style={{ height: `${Math.max(height, 4)}%` }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5 text-[9px] text-ink-soft/50">
        <span>{valid[0].yearMonth}</span>
        <span>{valid[valid.length - 1].yearMonth}</span>
      </div>
    </div>
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

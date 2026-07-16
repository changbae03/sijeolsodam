'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Recipe, RecipeLevel } from '@/data/types';
import { scaleAmount, estimateTimeAdjustmentNote } from '@/lib/scale-amount';
import { useCurrentStep } from '@/lib/current-step-context';
import StepList from './StepList';
import ServingSelector from './ServingSelector';

interface RecipeBodyProps {
  recipe: Recipe;
}

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

const LEVEL_BADGE: Record<RecipeLevel, { label: string; className: string }> = {
  home: { label: '데일리 홈쿡', className: 'bg-sage/10 text-sage' },
  weekend: { label: '주말 요리', className: 'bg-terracotta/10 text-terracotta' },
  world: { label: '세계 요리', className: 'bg-terracotta/10 text-terracotta' },
  chef: { label: '셰프 컬렉션', className: 'bg-ink text-cream' },
};

/** "\n\n"으로 구분된 텍스트를 여러 문단(<p>)으로 나눠 렌더링 — 긴 마스터클래스 글의 가독성용 */
function Paragraphs({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  return (
    <div className="space-y-2.5">
      {paragraphs.map((p, idx) => (
        <p key={idx} className={className}>
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

export default function RecipeBody({ recipe }: RecipeBodyProps) {
  const { servings, setServings, requestAskAboutStep } = useCurrentStep();
  const scale = servings / recipe.servings;
  const timeNote = estimateTimeAdjustmentNote(scale);
  const levelBadge = LEVEL_BADGE[recipe.level];

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    recipe.youtubeQuery
  )}`;

  return (
    <div className="px-5 pt-5">
      <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.05 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[14px] text-sage font-medium">{recipe.category}</p>
          <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${levelBadge.className}`}>
            {levelBadge.label}
          </span>
          {recipe.masterclass && recipe.level === 'chef' && (
            <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-terracotta text-paper">
              마스터클래스
            </span>
          )}
        </div>
        <h1 className="font-display text-[21px] text-ink mt-1 leading-snug">
          {recipe.title}
        </h1>
        <p className="text-[15px] text-ink-soft mt-1.5">{recipe.subtitle}</p>
      </motion.div>

      {recipe.masterclass && (
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="mt-4 border-l-2 border-terracotta pl-4"
        >
          <p className="text-[12px] font-semibold text-terracotta mb-1.5">셰프의 한마디</p>
          <Paragraphs
            text={`"${recipe.masterclass.chefIntro}"`}
            className="text-[14.5px] text-ink leading-relaxed italic"
          />
        </motion.div>
      )}

      {recipe.cuisineContext && (
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="flex items-start gap-2.5 mt-4 bg-terracotta/8 rounded-2xl px-4 py-3.5"
        >
          <div>
            <p className="text-[13.5px] font-semibold text-terracotta">
              {recipe.cuisineContext.country} 요리
            </p>
            <p className="text-[13.5px] text-ink-soft leading-relaxed mt-1">
              {recipe.cuisineContext.note}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex items-center gap-4 mt-4 py-3 border-y border-border-soft"
      >
        <InfoStat label="조리시간" value={`${recipe.cookTime}분`} />
        <InfoStat label="난이도" value={recipe.difficulty} />
        <InfoStat label="기본 인분" value={`${recipe.servings}인분`} />
      </motion.div>

      <motion.p
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="text-[15px] text-ink-soft leading-relaxed mt-4"
      >
        {recipe.description}
      </motion.p>

      <motion.a
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.2 }}
        whileTap={{ scale: 0.97 }}
        href={youtubeSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 mt-5 bg-ink text-cream rounded-full py-3 text-[15px] font-medium"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.6 7.2s-.2-1.5-.8-2.2c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.1c-.4 0-1.3.1-2.1.9-.6.7-.8 2.2-.8 2.2S2.2 9 2.2 10.7v1.5c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.2c.8.9 1.9.8 2.4.9 1.7.2 7.4.2 7.4.2s3.9 0 6.7-.2c.4 0 1.3-.1 2.1-.9.6-.7.8-2.2.8-2.2s.2-1.7.2-3.5v-1.5c0-1.7-.2-3.5-.2-3.5zM9.9 14.6V8.9l5.4 2.9-5.4 2.8z" />
        </svg>
        유튜브에서 영상으로 보기
      </motion.a>

      <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.22 }} className="mt-5">
        <ServingSelector
          baseServings={recipe.servings}
          selectedServings={servings}
          onChange={setServings}
        />
      </motion.div>

      {recipe.masterclass && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-7"
        >
          <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">재료 고르는 법</h2>
          <Paragraphs
            text={recipe.masterclass.ingredientSelection}
            className="text-[14.5px] text-ink-soft leading-relaxed"
          />
        </motion.section>
      )}

      <motion.section
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="mt-7"
      >
        <h2 className="font-display text-[17px] text-ink mb-3">
          재료 {servings !== recipe.servings && `· ${servings}인분 기준`}
        </h2>
        <div className="bg-paper rounded-2xl border border-border-soft px-4 py-3.5 divide-y divide-border-soft">
          <AnimatePresence mode="popLayout">
            {recipe.ingredients.map((ing) => (
              <motion.div
                key={ing.name}
                layout
                className="flex justify-between py-2 first:pt-0 last:pb-0"
              >
                <span className="text-[15px] text-ink">{ing.name}</span>
                <motion.span
                  key={`${ing.name}-${servings}`}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-[15px] text-ink-soft tabular-nums"
                >
                  {scaleAmount(ing.amount, scale)}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {timeNote && (
          <p className="text-[13px] text-terracotta mt-2.5 leading-relaxed">{timeNote}</p>
        )}
      </motion.section>

      {recipe.masterclass && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-7 space-y-4"
        >
          <div>
            <h2 className="font-display text-[17px] text-ink mb-3">🔪 미리 준비하기</h2>
            <Paragraphs
              text={recipe.masterclass.miseEnPlace}
              className="text-[14.5px] text-ink-soft leading-relaxed"
            />
          </div>
          <div className="bg-cream-warm rounded-2xl px-4 py-3.5">
            <p className="text-[13px] font-semibold text-ink mb-1.5">추천 조리도구</p>
            <p className="text-[14px] text-ink leading-relaxed">{recipe.masterclass.cookware.recommended}</p>
            {recipe.masterclass.cookware.alternatives.length > 0 && (
              <div className="mt-2">
                <p className="text-[12px] text-ink-soft/70 mb-1">대체 가능한 도구</p>
                {recipe.masterclass.cookware.alternatives.map((alt, idx) => (
                  <p key={idx} className="text-[13.5px] text-ink-soft leading-relaxed">
                    · {alt}
                  </p>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      )}

      <section className="mt-7">
        <h2 className="font-display text-[17px] text-ink mb-4">만드는 법</h2>
        <StepList steps={recipe.steps} onAskAboutStep={requestAskAboutStep} />
      </section>

      {recipe.masterclass?.chefsNotes && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-7"
        >
          <details className="group bg-ink/5 rounded-2xl px-4 py-3.5">
            <summary className="text-[15px] font-medium text-ink cursor-pointer list-none flex items-center justify-between">
              <span>🎓 셰프의 노트 — 더 깊은 기법과 원리</span>
              <span className="text-ink-soft/50 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <p className="text-[14px] text-ink-soft leading-relaxed mt-3">
              {recipe.masterclass.chefsNotes}
            </p>
          </details>
        </motion.section>
      )}

      {(recipe.masterclass?.platingAndServing || recipe.platingGuide) && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-7"
        >
          <h2 className="text-[16.5px] font-bold tracking-[-0.01em] text-ink mb-3">플레이팅 가이드</h2>
          <div className="bg-ink/5 rounded-2xl px-4 py-3.5">
            <p className="text-[14px] text-ink leading-relaxed">
              {recipe.masterclass?.platingAndServing ?? recipe.platingGuide}
            </p>
          </div>
        </motion.section>
      )}

      {recipe.masterclass && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-7 space-y-5"
        >
          <div>
            <h2 className="font-display text-[17px] text-ink mb-3">🍷 곁들임 추천</h2>
            <p className="text-[14.5px] text-ink-soft leading-relaxed">{recipe.masterclass.pairing}</p>
          </div>
          <div>
            <h2 className="font-display text-[17px] text-ink mb-3">🧊 보관 및 재가열</h2>
            <p className="text-[14.5px] text-ink-soft leading-relaxed">
              {recipe.masterclass.storageAndReheating}
            </p>
          </div>
          <div>
            <h2 className="font-display text-[17px] text-ink mb-3">♻️ 남았을 때 활용법</h2>
            <p className="text-[14.5px] text-ink-soft leading-relaxed">
              {recipe.masterclass.leftoverIdeas}
            </p>
          </div>
        </motion.section>
      )}

      {recipe.tips.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-7"
        >
          <h2 className="font-display text-[17px] text-ink mb-3">알면 더 맛있는 팁</h2>
          <div className="bg-sage/8 rounded-2xl px-4 py-3.5 space-y-2">
            {recipe.tips.map((tip, idx) => (
              <p key={idx} className="text-[14px] text-sage-dark leading-relaxed">
                · {tip}
              </p>
            ))}
          </div>
        </motion.section>
      )}

      {recipe.masterclass && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-7 mb-10 text-center"
        >
          <p className="text-[14px] text-ink-soft leading-relaxed italic px-4">
            {recipe.masterclass.closingNote}
          </p>
          <p className="text-[12px] text-ink-soft/50 mt-2.5">— 시절소담 셰프 노트</p>
        </motion.section>
      )}
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-[12px] text-ink-soft/70">{label}</p>
      <p className="text-[15px] text-ink font-medium mt-0.5">{value}</p>
    </div>
  );
}

'use client';

import { motion } from 'motion/react';

interface ServingSelectorProps {
  baseServings: number;
  selectedServings: number;
  onChange: (servings: number) => void;
}

const PRESETS = [1, 2, 4, 6];

export default function ServingSelector({
  baseServings,
  selectedServings,
  onChange,
}: ServingSelectorProps) {
  return (
    <div className="bg-paper rounded-2xl border border-border-soft px-4 py-3.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] text-ink-soft">몇 인분으로 만들까요?</span>
        {selectedServings !== baseServings && (
          <button
            onClick={() => onChange(baseServings)}
            className="text-[13px] text-sage underline"
          >
            기본값으로
          </button>
        )}
      </div>
      <div className="flex gap-2">
        {PRESETS.map((n) => {
          const isActive = n === selectedServings;
          return (
            <motion.button
              key={n}
              onClick={() => onChange(n)}
              whileTap={{ scale: 0.92 }}
              className="relative flex-1 h-11 rounded-xl"
            >
              {isActive && (
                <motion.div
                  layoutId="serving-pill"
                  className="absolute inset-0 bg-sage rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 text-[14.5px] font-medium ${
                  isActive ? 'text-cream' : 'text-ink-soft'
                }`}
              >
                {n}인분
              </span>
              {!isActive && (
                <span className="absolute inset-0 rounded-xl border border-border-soft -z-10" />
              )}
            </motion.button>
          );
        })}
      </div>
      {selectedServings !== baseServings && (
        <p className="text-[12.5px] text-ink-soft/70 mt-2.5">
          기본 {baseServings}인분 기준 재료를 {(selectedServings / baseServings).toFixed(1).replace('.0', '')}배로 계산했어요
        </p>
      )}
    </div>
  );
}

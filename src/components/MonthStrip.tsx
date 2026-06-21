'use client';

import { motion } from 'motion/react';
import { monthsData } from '@/data/months';

interface MonthStripProps {
  selectedMonth: number;
  onSelectMonth: (month: number) => void;
}

export default function MonthStrip({ selectedMonth, onSelectMonth }: MonthStripProps) {
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {monthsData.map((m) => {
        const isActive = m.month === selectedMonth;
        return (
          <motion.button
            key={m.month}
            onClick={() => onSelectMonth(m.month)}
            whileTap={{ scale: 0.92 }}
            className="relative flex flex-col items-center justify-center aspect-square rounded-xl"
          >
            {isActive && (
              <motion.div
                layoutId="month-pill"
                className="absolute inset-0 bg-sage rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span
              className={`relative z-10 text-[13.5px] font-medium transition-colors ${
                isActive ? 'text-cream' : 'text-ink-soft'
              }`}
            >
              {m.month}월
            </span>
            <span
              className={`relative z-10 text-[9px] mt-0.5 transition-colors leading-none ${
                isActive ? 'text-cream/80' : 'text-ink-soft/70'
              }`}
            >
              {m.season}
            </span>
            {!isActive && (
              <span className="absolute inset-0 rounded-xl bg-paper border border-border-soft -z-10" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

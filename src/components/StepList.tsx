'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { RecipeStep } from '@/data/types';
import { useCurrentStep } from '@/lib/current-step-context';

interface StepListProps {
  steps: RecipeStep[];
  onAskAboutStep: (stepIndex: number) => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function StepList({ steps, onAskAboutStep }: StepListProps) {
  const { currentStepIndex, setCurrentStepIndex } = useCurrentStep();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = refs.current.findIndex((el) => el === visible.target);
          if (idx !== -1) setCurrentStepIndex(idx);
        }
      },
      { threshold: 0.5, rootMargin: '-15% 0px -35% 0px' }
    );

    refs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setCurrentStepIndex]);

  return (
    <div>
      <ProgressDots total={steps.length} current={currentStepIndex} />
      <div className="space-y-3 mt-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <StepItem
                index={idx + 1}
                step={step}
                isActive={idx === currentStepIndex}
                onAsk={() => onAskAboutStep(idx)}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="sticky top-0 z-10 -mx-5 px-5 py-2.5 bg-cream/95 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] text-ink-soft">
          {current + 1} / {total} 단계
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, idx) => (
          <div key={idx} className="flex-1 h-1.5 rounded-full bg-border-soft overflow-hidden">
            <motion.div
              className="h-full bg-sage rounded-full"
              initial={false}
              animate={{ width: idx <= current ? '100%' : '0%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepItem({
  index,
  step,
  isActive,
  onAsk,
}: {
  index: number;
  step: RecipeStep;
  isActive: boolean;
  onAsk: () => void;
}) {
  const total = step.timerSeconds || 0;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const toggleTimer = () => {
    if (remaining === 0) setRemaining(total);
    setRunning((r) => !r);
  };

  const resetTimer = () => {
    setRunning(false);
    setRemaining(total);
  };

  const progress = total > 0 ? (total - remaining) / total : 0;
  const isDone = total > 0 && remaining === 0;

  return (
    <motion.div
      animate={{
        opacity: isActive ? 1 : 0.55,
        scale: isActive ? 1 : 0.985,
      }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 rounded-2xl px-3.5 py-3.5 -mx-3.5 ${
        isActive ? 'bg-paper border border-sage/25' : ''
      }`}
    >
      <div
        className={`shrink-0 w-7 h-7 rounded-full text-[13px] font-medium flex items-center justify-center mt-0.5 transition-colors ${
          isActive ? 'bg-sage text-cream' : 'bg-border-soft text-ink-soft'
        }`}
      >
        {index}
      </div>
      <div className="flex-1 pb-1">
        {step.stepImage && (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-border-soft">
            <Image
              src={step.stepImage}
              alt={step.title}
              fill
              sizes="(max-width: 768px) 90vw, 400px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-[14.5px] text-ink">{step.title}</h3>
          <button
            onClick={onAsk}
            className="shrink-0 text-[11px] text-sage bg-sage/8 border border-sage/20 rounded-full px-2.5 py-1 mt-0.5"
          >
            🧑‍🍳 물어보기
          </button>
        </div>
        <p className="text-[13.5px] text-ink-soft leading-relaxed mt-1">{step.description}</p>
        {step.tip && (
          <p className="text-[12.5px] text-terracotta mt-1.5 leading-relaxed">
            tip · {step.tip}
          </p>
        )}
        {total > 0 && (
          <div className="flex items-center gap-3 mt-2.5">
            <button
              onClick={toggleTimer}
              className="relative w-9 h-9 shrink-0"
              aria-label={running ? '일시정지' : '타이머 시작'}
            >
              <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e3ddd0" strokeWidth="3" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke={isDone ? '#5B6E54' : '#C45D3A'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15.5}
                  initial={{ strokeDashoffset: 2 * Math.PI * 15.5 }}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 15.5 * (1 - progress),
                  }}
                  transition={{ duration: 0.3, ease: 'linear' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center">
                {running ? <PauseIcon /> : isDone ? <CheckIcon /> : <PlayIcon />}
              </span>
            </button>
            <span className="text-[13px] text-ink-soft tabular-nums">
              {formatTime(remaining)}
            </span>
            {remaining !== total && (
              <button onClick={resetTimer} className="text-[12px] text-ink-soft/70 underline">
                초기화
              </button>
            )}
          </div>
        )}
        {step.checkpoint && (
          <div className="flex items-start gap-1.5 mt-2.5 bg-sage/8 rounded-xl px-3 py-2">
            <span className="text-[13px] shrink-0">✓</span>
            <p className="text-[12px] text-sage-dark leading-relaxed">{step.checkpoint}</p>
          </div>
        )}
        {step.warning && (
          <div className="flex items-start gap-1.5 mt-2 bg-terracotta/8 rounded-xl px-3 py-2">
            <span className="text-[13px] shrink-0">⚠️</span>
            <p className="text-[12px] text-terracotta leading-relaxed">{step.warning}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#C45D3A">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#C45D3A">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5B6E54"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="text-[13px] font-medium text-ink mb-1.5 block">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2.5 text-[15px] rounded-lg border transition-all duration-200',
          'bg-paper border-border-soft placeholder:text-ink-soft/50',
          'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-sage',
          error && 'border-terracotta/50 focus:ring-terracotta',
          'disabled:bg-cream-warm disabled:cursor-not-allowed disabled:opacity-60',
          className
        )}
        {...props}
      />
      {error && <p className="text-[12px] text-terracotta mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-[12px] text-ink-soft/60 mt-1">{helperText}</p>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };

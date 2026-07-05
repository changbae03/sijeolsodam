import { parseStructuredReply } from '@/lib/parseStructuredReply';
import { cn } from '@/lib/cn';

interface StructuredReplyViewProps {
  text: string;
  /** 'md'는 홈 히어로(더 큰 헤드라인), 'sm'은 CookingCoach 등 좁은 패널용 */
  size?: 'md' | 'sm';
}

export default function StructuredReplyView({ text, size = 'md' }: StructuredReplyViewProps) {
  const { intro, steps, outro } = parseStructuredReply(text);
  const introTextClass = size === 'md' ? 'text-[17px]' : 'text-[16px]';
  const stepTextClass = size === 'md' ? 'text-[15px]' : 'text-[14.5px]';
  const badgeSize = size === 'md' ? 'w-6 h-6 text-[13px]' : 'w-5 h-5 text-[12px]';

  return (
    <div className="space-y-3">
      {intro.map((paragraph, i) => (
        <p
          key={`intro-${i}`}
          className={cn(
            'font-display leading-snug text-ink whitespace-pre-wrap break-words',
            introTextClass
          )}
        >
          {paragraph}
        </p>
      ))}

      {steps.length > 0 && (
        <ol className="space-y-2.5 border-t border-border-soft/70 pt-3">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-2.5">
              <span
                className={cn(
                  'shrink-0 rounded-full bg-sage/12 text-sage font-medium flex items-center justify-center mt-0.5',
                  badgeSize
                )}
              >
                {step.number}
              </span>
              <span className={cn('flex-1 text-ink leading-relaxed', stepTextClass)}>
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      )}

      {outro.map((paragraph, i) => (
        <p key={`outro-${i}`} className="text-[13.5px] text-ink-soft leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

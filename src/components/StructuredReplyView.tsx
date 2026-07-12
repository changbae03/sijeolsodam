import { parseStructuredReply } from '@/lib/parseStructuredReply';
import { cn } from '@/lib/cn';

interface StructuredReplyViewProps {
  text: string;
  /** 'md'는 홈 히어로(더 큰 헤드라인), 'sm'은 CookingCoach 등 좁은 패널용 */
  size?: 'md' | 'sm';
  /** API가 구조화된 필드로 내려준 재료 목록. 있으면 이걸 그대로 칩으로 쓰고,
   * 텍스트에서 재료 줄을 추측 파싱하지 않는다(항상 일관된 모양을 위해). */
  ingredientList?: string[];
}

export default function StructuredReplyView({ text, size = 'md', ingredientList }: StructuredReplyViewProps) {
  const parsed = parseStructuredReply(text);
  const intro = parsed.intro;
  const steps = parsed.steps;
  const outro = parsed.outro;
  // API가 이미 구조화된 재료 배열을 줬으면 그걸 쓰고, 없으면(과거 대화 등) 텍스트 추측 파싱으로 대체한다.
  const chips = ingredientList && ingredientList.length > 0 ? ingredientList : parsed.ingredientLine;
  const introTextClass = size === 'md' ? 'text-[17px]' : 'text-[16px]';
  const stepTextClass = size === 'md' ? 'text-[15px]' : 'text-[14.5px]';
  const badgeSize = size === 'md' ? 'w-6 h-6 text-[13px]' : 'w-5 h-5 text-[12px]';

  return (
    <div className="space-y-3.5">
      {intro.map((paragraph, i) => (
        <p
          key={`intro-${i}`}
          className={cn(
            'font-display font-semibold leading-snug text-ink whitespace-pre-wrap break-words tracking-tight',
            introTextClass
          )}
        >
          {paragraph}
        </p>
      ))}

      {chips && chips.length > 0 && (
        <div>
          <p className="text-[10.5px] tracking-[0.14em] uppercase text-sage font-bold mb-1.5">
            재료
          </p>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center bg-sage/10 text-ink border border-sage/20 rounded-full px-2.5 py-1 text-[13px] font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {steps.length > 0 && (
        <ol className="space-y-3 border-t border-border-soft/70 pt-3.5">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-3">
              <span
                className={cn(
                  'shrink-0 rounded-full bg-terracotta text-cream font-bold flex items-center justify-center mt-0.5 shadow-sm',
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

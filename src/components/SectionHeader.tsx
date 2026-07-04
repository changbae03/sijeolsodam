import { ReactNode } from 'react';

interface SectionHeaderProps {
  /** 아이콘 위에 작게 들어가는 강조 라벨 (예: "AI 추천", "이달의 제철") */
  eyebrow: string;
  /** 본 제목 */
  title: string;
  /** 아이콘 칩 안에 들어갈 이모지 또는 작은 아이콘 */
  icon: ReactNode;
  /** 헤더 오른쪽 끝에 붙는 보조 액션 (예: "새 대화" 버튼) */
  action?: ReactNode;
}

export default function SectionHeader({ eyebrow, title, icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sage/15 to-terracotta/10 text-[18px] leading-none">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10.5px] tracking-[0.16em] uppercase text-terracotta font-semibold mb-0.5">
          {eyebrow}
        </p>
        <h2 className="font-display text-[19px] tracking-tight text-ink font-semibold leading-tight truncate">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

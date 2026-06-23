/**
 * 조건부 클래스명을 병합하는 유틸리티 함수
 * classnames/clsx를 간단하게 구현한 버전
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .flatMap((cls) => {
      if (!cls) return [];
      if (typeof cls === 'string') return cls.split(/\s+/).filter(Boolean);
      return Object.entries(cls)
        .filter(([, enabled]) => enabled)
        .map(([className]) => className.split(/\s+/).filter(Boolean))
        .flat();
    })
    .filter(Boolean)
    .join(' ');
}

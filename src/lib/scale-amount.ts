/**
 * 재료 양 텍스트("150g", "1/3개", "1.5큰술", "약간")를 파싱해
 * 인분 비율에 맞게 재계산합니다.
 *
 * 전략: 텍스트 맨 앞쪽의 숫자(정수/소수/분수)만 추출해서 배율을 곱하고,
 * 나머지 단위 텍스트는 그대로 둡니다. 숫자가 없으면("약간" 등) 원본을 그대로 반환합니다.
 */

// "1/3", "2", "1.5" 같은 선두 숫자(분수 포함) 매칭
const LEADING_NUMBER_REGEX = /^(\d+\s*\/\s*\d+|\d+\.\d+|\d+)/;

function parseLeadingNumber(token: string): number | null {
  const fractionMatch = token.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);
    if (denominator === 0) return null;
    return numerator / denominator;
  }
  const num = Number(token);
  return Number.isFinite(num) ? num : null;
}

/**
 * 숫자를 보기 좋은 분수/소수 텍스트로 변환합니다.
 * 예: 0.5 -> "1/2", 0.333... -> "1/3", 2 -> "2", 1.5 -> "1.5"
 */
function formatNumber(value: number): string {
  // 정수면 그대로
  if (Number.isInteger(value)) return String(value);

  // 흔한 분수로 근사 (1/2, 1/3, 2/3, 1/4, 3/4)
  const commonFractions: [number, string][] = [
    [1 / 2, '1/2'],
    [1 / 3, '1/3'],
    [2 / 3, '2/3'],
    [1 / 4, '1/4'],
    [3 / 4, '3/4'],
    [1 / 5, '1/5'],
  ];
  for (const [frac, label] of commonFractions) {
    if (Math.abs(value - frac) < 0.02) return label;
  }

  // 소수 둘째 자리까지, 불필요한 0 제거
  const rounded = Math.round(value * 100) / 100;
  return String(rounded);
}

/**
 * amount 텍스트를 scale 배율로 재계산합니다.
 * 예: scaleAmount("150g", 2) -> "300g"
 *     scaleAmount("1/3개", 3) -> "1개"
 *     scaleAmount("약간", 2) -> "약간" (변경 없음)
 */
export function scaleAmount(amount: string, scale: number): string {
  if (scale === 1) return amount;

  const trimmed = amount.trim();
  const match = trimmed.match(LEADING_NUMBER_REGEX);
  if (!match) return amount; // 숫자 없음 → 그대로

  const numberToken = match[0].replace(/\s+/g, '');
  const baseValue = parseLeadingNumber(numberToken);
  if (baseValue === null) return amount;

  const scaledValue = baseValue * scale;
  const rest = trimmed.slice(match[0].length);

  return `${formatNumber(scaledValue)}${rest}`;
}

/** 조리시간도 인분이 늘어나면 일부 보정이 필요한 단계(굽기 등)에 사용할 수 있는 보조 함수.
 * 다만 시간은 단순 비례가 아니므로, 안내 문구로만 참고 표시합니다. */
export function estimateTimeAdjustmentNote(scale: number): string | null {
  if (scale <= 1) return null;
  if (scale >= 2) {
    return '재료가 많아져 오븐/에어프라이어 조리 시간이 10~20% 더 걸릴 수 있어요. 중간에 한 번 확인해주세요.';
  }
  return null;
}

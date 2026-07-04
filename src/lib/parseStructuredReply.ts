/**
 * AI 답변 텍스트("1. ... 2. ... 3. ...")를 구조화한다.
 *
 * 모델이 줄바꿈 없이 한 줄로 번호를 이어붙여 내는 경우(가장 흔함)와
 * 이미 줄바꿈으로 구분해서 내는 경우를 모두 다룬다.
 */

export interface StructuredReplyStep {
  number: number;
  text: string;
}

export interface StructuredReply {
  /** 번호 목록이 시작되기 전의 문단들 */
  intro: string[];
  /** 번호가 매겨진 단계들 (1, 2, 3, ... 순서로 이어질 때만 인식) */
  steps: StructuredReplyStep[];
  /** 번호 목록 이후에 이어지는 문단들 */
  outro: string[];
}

const STEP_LINE = /^\s*(\d{1,2})[.)]\s*(.+)$/;

/**
 * "...세요.2. 양념장" 처럼 번호 앞에 줄바꿈이 없는 경우를 보정해서
 * 번호마다 줄을 새로 시작하도록 만든다.
 */
function insertLineBreaksBeforeNumbers(raw: string): string {
  const markerCount = (raw.match(/\d{1,2}[.)]\s/g) ?? []).length;
  if (markerCount < 2) return raw;

  return raw
    // 공백 뒤에 번호가 오는 경우: "...습니다. 2. 볶기" -> "...습니다.\n2. 볶기"
    .replace(/([^\n])\s+(\d{1,2}[.)]\s)/g, (_m, a, b) => `${a}\n${b}`)
    // 공백 없이 바로 번호가 붙는 경우: "...습니다.2. 볶기" -> "...습니다.\n2. 볶기"
    .replace(/([^\n\d])(\d{1,2}[.)]\s)/g, (_m, a, b) => `${a}\n${b}`);
}

export function parseStructuredReply(raw: string): StructuredReply {
  const normalized = insertLineBreaksBeforeNumbers(raw.trim());
  const lines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const intro: string[] = [];
  const steps: StructuredReplyStep[] = [];
  const outro: string[] = [];
  let lastStepNum = 0;
  let inSteps = false;

  for (const line of lines) {
    const match = line.match(STEP_LINE);
    if (match && Number(match[1]) === lastStepNum + 1) {
      steps.push({ number: Number(match[1]), text: match[2].trim() });
      lastStepNum += 1;
      inSteps = true;
    } else if (!inSteps) {
      intro.push(line);
    } else {
      outro.push(line);
    }
  }

  // 번호가 1개뿐이라 "단계"로 보기 애매하면(예: 그냥 문장 안에 숫자 하나) 통째로 intro로 되돌린다.
  if (steps.length < 2) {
    return { intro: lines, steps: [], outro: [] };
  }

  return { intro, steps, outro };
}

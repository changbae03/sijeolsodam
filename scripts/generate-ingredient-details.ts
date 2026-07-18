/**
 * 각 월의 제철 식재료(monthsData.ingredients)에 상세 정보 4종을
 * (nutrition, howToChoose, tip, goesWellWith) Gemini로 생성해 채워 넣는 1회성 스크립트.
 *
 * 식재료 객체가 파일 안에서 한 줄로 작성되어 있다는 전제(현재 months.ts 포맷)를 이용해
 * 줄 단위로 안전하게 파싱합니다.
 *
 * 실행 방법:
 *   GEMINI_API_KEY=키 npx tsx scripts/generate-ingredient-details.ts
 *
 * 이미 상세 정보가 있는 항목은 건너뛰므로 여러 번 실행해도 안전합니다.
 * 실행 후 git diff로 결과를 반드시 확인하세요.
 */
import { GoogleGenAI } from '@google/genai';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { SODAMI_TEXT_PERSONA_PROMPT } from '../src/lib/persona';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const filePath = join(__dirname, '..', 'src', 'data', 'months.ts');

// --refresh-nutrition: 이미 상세가 채워진 식재료도 nutrition 필드만 새 기준으로 재작성
const refreshNutrition = process.argv.slice(2).includes('--refresh-nutrition');

interface IngredientDetail {
  nutrition: string;
  howToChoose: string;
  tip: string;
  goesWellWith: string;
}

function isIngredientLine(line: string): boolean {
  return /^\s*\{\s*name:\s*'/.test(line);
}

function lineHasDetails(line: string): boolean {
  return /nutrition:\s*'/.test(line);
}

function extractNameAndDescription(line: string): { name: string; description: string } | null {
  const nameMatch = line.match(/name:\s*'((?:[^'\\]|\\.)*)'/);
  const descMatch = line.match(/description:\s*'((?:[^'\\]|\\.)*)'/);
  if (!nameMatch || !descMatch) return null;
  return { name: nameMatch[1], description: descMatch[1] };
}

function escapeForSingleQuote(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** 기존 라인에서 nutrition 값만 새 값으로 교체 (다른 필드는 보존) */
function replaceNutritionOnly(line: string, nutrition: string): string {
  return line.replace(/nutrition:\s*'(?:[^'\\]|\\.)*'/, `nutrition: '${escapeForSingleQuote(nutrition)}'`);
}

function insertDetailsIntoLine(line: string, detail: IngredientDetail): string {
  const trimmedEnd = line.trimEnd();
  if (!trimmedEnd.endsWith('},')) return line;
  const withoutTrailing = trimmedEnd.slice(0, -2).trimEnd();
  const fields = [
    `nutrition: '${escapeForSingleQuote(detail.nutrition)}'`,
    `howToChoose: '${escapeForSingleQuote(detail.howToChoose)}'`,
    `tip: '${escapeForSingleQuote(detail.tip)}'`,
    `goesWellWith: '${escapeForSingleQuote(detail.goesWellWith)}'`,
  ].join(', ');
  return `${withoutTrailing}, ${fields} },`;
}

async function generateDetail(
  name: string,
  description: string,
  month: number
): Promise<IngredientDetail | null> {
  const prompt = `${SODAMI_TEXT_PERSONA_PROMPT}

"${name}"은 ${month}월 한국의 제철 식재료입니다. 간단한 소개: "${description}"

이 식재료에 대해 아래 JSON 형식으로만 답해주세요. 다른 설명이나 코드블록(\`\`\`) 없이 순수 JSON 객체만 출력하세요.

{
  "nutrition": "핵심 영양 성분의 '이름'을 2~3개 짚고, 각각이 몸의 어디에·왜 좋은지 연결한 2문장 (60~90자). 예시 톤: '칼륨이 풍부해 여름철 땀으로 빠져나간 전해질을 채우고 붓기를 빼는 데 좋아요. 식이섬유도 많아 더위에 지친 장을 편하게 해줘요.' — 이런 식으로 성분명 -> 효능을 구체적으로.",
  "howToChoose": "신선한 것을 고르는 방법을 1~2문장으로 (30자 내외, 눈으로 확인 가능한 구체적 기준)",
  "tip": "손질이나 보관할 때 알아두면 좋은 팁을 1~2문장으로 (30자 내외)",
  "goesWellWith": "잘 어울리는 조리법이나 양념을 1문장으로 (20자 내외)"
}

규칙:
- 정확히 알지 못하는 수치(mg, %, 몇 배 등)는 절대 만들어내지 마세요. 성분 '이름'과 '효능 방향'까지만 구체적으로.
- 이 식재료가 제철인 계절 맥락(더위/추위/환절기)과 효능을 자연스럽게 연결하면 좋습니다.
- 의학적 치료 효과 단정("~을 치료한다", "~병을 예방한다")은 금지. "~에 도움이 돼요" 수준까지만.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      maxOutputTokens: 1000,
      temperature: 0.6,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const text = (response.text || '').trim();
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (
      typeof parsed.nutrition === 'string' &&
      typeof parsed.howToChoose === 'string' &&
      typeof parsed.tip === 'string' &&
      typeof parsed.goesWellWith === 'string'
    ) {
      return parsed;
    }
    console.warn(`    경고: 응답 형식이 예상과 다릅니다 - ${name}`);
    return null;
  } catch {
    console.warn(`    경고: JSON 파싱 실패 - ${name}:`, cleaned.slice(0, 100));
    return null;
  }
}

async function main() {
  const lines = readFileSync(filePath, 'utf-8').split('\n');
  const result = lines.slice();
  let currentMonth = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const monthMatch = line.match(/^\s{4}month:\s*(\d+),/);
    if (monthMatch) {
      currentMonth = Number(monthMatch[1]);
      continue;
    }

    if (!isIngredientLine(line)) continue;

    const alreadyDetailed = lineHasDetails(line);
    // 기본 모드: 미처리 항목만 채움. --refresh-nutrition: 처리된 항목의 영양만 재작성.
    if (alreadyDetailed && !refreshNutrition) continue;
    if (!alreadyDetailed && refreshNutrition) continue; // refresh 모드에선 미처리 항목은 기본 모드 몫

    const parsed = extractNameAndDescription(line);
    if (!parsed) continue;

    console.log(
      `[${currentMonth}월] ${parsed.name} ${refreshNutrition ? '영양 정보 재작성' : '상세 정보 생성'} 중...`
    );

    try {
      const detail = await generateDetail(parsed.name, parsed.description, currentMonth);
      if (detail) {
        result[i] = refreshNutrition
          ? replaceNutritionOnly(result[i], detail.nutrition)
          : insertDetailsIntoLine(result[i], detail);
        writeFileSync(filePath, result.join('\n'), 'utf-8');
        console.log('  완료');
      }
    } catch (err) {
      console.error('  에러, 건너뜁니다:', err);
    }

    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log('\n전체 완료!');
}

main();

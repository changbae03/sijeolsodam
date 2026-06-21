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
  "nutrition": "주요 영양 성분이나 효능을 1문장으로 (15자 내외)",
  "howToChoose": "신선한 것을 고르는 방법을 1문장으로 (20자 내외)",
  "tip": "손질이나 보관할 때 알아두면 좋은 팁을 1문장으로 (20자 내외)",
  "goesWellWith": "잘 어울리는 조리법이나 양념을 1문장으로 (15자 내외)"
}

확실하지 않은 구체적인 수치(예: 정확한 비타민 함량 mg)는 만들어내지 말고, "풍부해요", "도움이 돼요" 같은 일반적인 표현을 사용하세요.`;

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
    if (lineHasDetails(line)) continue; // 이미 처리됨

    const parsed = extractNameAndDescription(line);
    if (!parsed) continue;

    console.log(`[${currentMonth}월] ${parsed.name} 상세 정보 생성 중...`);

    try {
      const detail = await generateDetail(parsed.name, parsed.description, currentMonth);
      if (detail) {
        result[i] = insertDetailsIntoLine(result[i], detail);
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

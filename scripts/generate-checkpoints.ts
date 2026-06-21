/**
 * 60개 레시피의 각 조리 단계에 "체크포인트"(이 단계가 끝났을 때 확인할 수 있는 상태) 문구를
 * Gemini로 생성해서 recipes-q1/q2/q3.ts 파일에 직접 채워 넣는 1회성 스크립트입니다.
 *
 * 각 step 객체가 파일 안에서 정확히 한 줄로 작성되어 있다는 전제(현재 데이터 파일의
 * 실제 포맷)를 이용해, 줄 단위로 안전하게 파싱합니다. 정규식으로 멀티라인을 매칭하지
 * 않으므로 description에 쉼표가 들어있어도 깨지지 않습니다.
 *
 * 실행 방법:
 *   GEMINI_API_KEY=발급받은키 npx tsx scripts/generate-checkpoints.ts
 *
 * 이미 checkpoint가 있는 단계는 건너뛰므로 여러 번 실행해도 안전합니다.
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
const files = [
  'recipes-q1.ts',
  'recipes-q2.ts',
  'recipes-q3.ts',
  'recipes-q1-extra.ts',
  'recipes-q2-extra.ts',
  'recipes-q3-extra.ts',
];

interface StepInput {
  title: string;
  description: string;
}

function extractTitleAndDescription(line: string): StepInput | null {
  const titleMatch = line.match(/title:\s*'((?:[^'\\]|\\.)*)'/);
  const descMatch = line.match(/description:\s*'((?:[^'\\]|\\.)*)'/);
  if (!titleMatch || !descMatch) return null;
  return { title: titleMatch[1], description: descMatch[1] };
}

function isStepLine(line: string): boolean {
  return /^\s*\{\s*title:/.test(line);
}

function lineEndsWithStepClose(line: string): boolean {
  return line.trimEnd().endsWith('},');
}

function lineHasCheckpoint(line: string): boolean {
  return /checkpoint:\s*'/.test(line);
}

function insertCheckpointIntoLine(line: string, checkpoint: string): string {
  const trimmedEnd = line.trimEnd();
  if (!trimmedEnd.endsWith('},')) return line;
  const withoutTrailing = trimmedEnd.slice(0, -2).trimEnd();
  const escaped = checkpoint.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `${withoutTrailing}, checkpoint: '${escaped}' },`;
}

async function generateCheckpoints(
  recipeTitle: string,
  steps: StepInput[]
): Promise<string[]> {
  const stepsText = steps
    .map((s, i) => `${i + 1}. ${s.title}: ${s.description}`)
    .join('\n');

  const prompt = `${SODAMI_TEXT_PERSONA_PROMPT}

다음은 "${recipeTitle}" 레시피의 조리 단계입니다.

${stepsText}

각 단계가 "잘 진행되고 있는지" 확인할 수 있는 짧은 체크포인트 문구를 단계마다 하나씩 만들어주세요.
예시 톤: "이 정도로 노릇해졌다면 잘 익고 있는 거예요", "국물이 맑게 우러났다면 성공이에요"

규칙:
- 각 문구는 20자 내외로 짧게, 존댓말, 다정한 톤
- 반드시 ${steps.length}개의 문구만 줄바꿈으로 구분해서 출력하세요. 번호, 설명, 다른 텍스트는 절대 넣지 마세요.
- 마지막 단계(보통 "마무리")는 완성된 모습에 대한 체크포인트로 작성하세요.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { maxOutputTokens: 500, temperature: 0.7 },
  });

  const text = response.text || '';
  return text
    .split('\n')
    .map((l) => l.replace(/^[\d.\-\s]+/, '').trim())
    .filter((l) => l.length > 0);
}

async function processFile(fileName: string) {
  const filePath = join(__dirname, '..', 'src', 'data', fileName);
  const lines = readFileSync(filePath, 'utf-8').split('\n');

  const result = lines.slice();
  let recipeTitle: string | null = null;
  let blockStepLineIndices: number[] = [];
  let blockSteps: StepInput[] = [];

  async function flushBlock() {
    if (blockSteps.length === 0 || !recipeTitle) return;
    const needsGeneration = blockStepLineIndices.some(
      (idx) => !lineHasCheckpoint(result[idx])
    );
    if (!needsGeneration) {
      blockStepLineIndices = [];
      blockSteps = [];
      return;
    }

    console.log(`  - ${recipeTitle} (${blockSteps.length}단계) 생성 중...`);
    try {
      const checkpoints = await generateCheckpoints(recipeTitle as string, blockSteps);
      if (checkpoints.length !== blockSteps.length) {
        console.warn(
          `    경고: 생성 개수(${checkpoints.length}) != 단계 개수(${blockSteps.length}), 건너뜁니다.`
        );
      } else {
        blockStepLineIndices.forEach((lineIdx, idx) => {
          result[lineIdx] = insertCheckpointIntoLine(result[lineIdx], checkpoints[idx]);
        });
        writeFileSync(filePath, result.join('\n'), 'utf-8');
      }
    } catch (err) {
      console.error(`    에러, 건너뜁니다:`, err);
    }
    await new Promise((r) => setTimeout(r, 1200));
    blockStepLineIndices = [];
    blockSteps = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!isStepLine(line)) {
      const topLevelTitleMatch = line.match(/^\s{4}title:\s*'((?:[^'\\]|\\.)*)'/);
      if (topLevelTitleMatch) {
        await flushBlock();
        recipeTitle = topLevelTitleMatch[1];
      }
      continue;
    }

    if (!lineEndsWithStepClose(line)) continue;
    const parsed = extractTitleAndDescription(line);
    if (!parsed) continue;

    blockStepLineIndices.push(i);
    blockSteps.push(parsed);
  }
  await flushBlock();

  console.log(`${fileName} 완료`);
}

async function main() {
  for (const file of files) {
    console.log(`\n=== ${file} 처리 시작 ===`);
    await processFile(file);
  }
  console.log('\n전체 완료!');
}

main();

/**
 * 기존 레시피의 "맛"을 보강하는 스크립트.
 *
 * SODAMI_FLAVOR_STANDARD(맛의 기준)를 기준으로 각 레시피의
 * ingredients / steps / tips 를 다시 설계해서 파일에 직접 덮어씁니다.
 * 감칠맛 베이스, 향 내기 단계, 밑간·중간 간·마무리 간, 산미와 마무리 향,
 * 구체적인 계량, 곁들임 양념장이 빠져 있으면 채워 넣습니다.
 *
 * 실행 방법:
 *   # 한 개만 테스트 (가장 먼저 이걸로 결과를 확인하세요)
 *   GEMINI_API_KEY=키 npx tsx scripts/upgrade-recipe-flavor.ts --recipe=9-1
 *
 *   # 특정 파일 전체 / 특정 월 / 개수 제한
 *   GEMINI_API_KEY=키 npx tsx scripts/upgrade-recipe-flavor.ts --file=recipes-q3.ts --limit=5
 *   GEMINI_API_KEY=키 npx tsx scripts/upgrade-recipe-flavor.ts --month=9
 *   GEMINI_API_KEY=키 npx tsx scripts/upgrade-recipe-flavor.ts --all --limit=50
 *
 * 이미 보강된 레시피(flavorUpgraded: true)는 건너뛰므로 여러 번 나눠 실행해도 안전합니다.
 * 다시 보강하려면 --force 를 주세요.
 *
 * 실행 후 반드시 `git diff` 로 결과를 확인하세요.
 */
import { GoogleGenAI } from '@google/genai';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import {
  SODAMI_TEXT_PERSONA_PROMPT,
  SODAMI_FLAVOR_STANDARD,
  SODAMI_KOREAN_PALATE,
} from '../src/lib/persona';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const args = process.argv.slice(2);

const recipeArg = args.find((a) => a.startsWith('--recipe='))?.split('=')[1];
const fileArg = args.find((a) => a.startsWith('--file='))?.split('=')[1];
const monthArg = args.find((a) => a.startsWith('--month='))?.split('=')[1];
const levelArg = args.find((a) => a.startsWith('--level='))?.split('=')[1];
const limitArg = args.find((a) => a.startsWith('--limit='))?.split('=')[1];
const runAll = args.includes('--all');
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
// API 호출 없이 고정된 샘플 결과로 파일 재작성 경로만 검증 (개발/테스트용)
const mock = args.includes('--mock');

const MOCK_RESULT: UpgradeResult = {
  ingredients: [
    { name: '테스트재료', amount: "1큰술 'quoted' \\ 백슬래시" },
    { name: '국간장', amount: '1큰술' },
  ],
  steps: [
    { title: '향 내기', description: '기름에 마늘을 볶아 향을 냅니다.', checkpoint: '고소한 향이 올라오면 좋아요' },
    { title: '마무리', description: '간을 보고 싱거우면 소금으로 맞추세요.', timerSeconds: 300, tip: '참기름은 불을 끄고 넣으세요.' },
  ],
  tips: ['테스트 팁 1', "따옴표 ' 포함 팁"],
};

if (!recipeArg && !fileArg && !monthArg && !levelArg && !runAll) {
  console.error(
    '대상을 지정해주세요: --recipe=9-1 | --file=recipes-q3.ts | --month=9 | --level=home | --all'
  );
  process.exit(1);
}

const limit = limitArg ? parseInt(limitArg, 10) : Infinity;
const DATA_DIR = join(__dirname, '..', 'src', 'data');

interface UpgradedIngredient {
  name: string;
  amount: string;
}
interface UpgradedStep {
  title: string;
  description: string;
  tip?: string;
  timerSeconds?: number;
  checkpoint?: string;
}
interface UpgradeResult {
  ingredients: UpgradedIngredient[];
  steps: UpgradedStep[];
  tips: string[];
}

/** TS 작은따옴표 문자열로 안전하게 이스케이프 */
function esc(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** 레시피 블록에서 단일 필드 값을 읽는다 */
function readField(block: string, field: string): string | null {
  const m = block.match(new RegExp(`${field}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  return m ? m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\') : null;
}

/**
 * `    key: [` 부터 같은 들여쓰기의 `    ],` 까지의 [시작줄, 끝줄] 인덱스를 찾는다.
 * 배열이 여러 줄로 작성되어 있다는 현재 데이터 포맷을 전제로 한다.
 */
function findArrayRange(lines: string[], key: string): [number, number] | null {
  const startIdx = lines.findIndex((l) => new RegExp(`^\\s{4}${key}:\\s*\\[\\s*$`).test(l));
  if (startIdx === -1) return null;
  const endIdx = lines.findIndex((l, i) => i > startIdx && /^\s{4}\],\s*$/.test(l));
  if (endIdx === -1) return null;
  return [startIdx, endIdx];
}

function buildPrompt(
  title: string,
  subtitle: string,
  description: string,
  category: string,
  mainIngredient: string,
  servings: string,
  level: string,
  ingredientsText: string,
  stepsText: string,
  tipsText: string
): string {
  return `${SODAMI_TEXT_PERSONA_PROMPT}

${SODAMI_FLAVOR_STANDARD}

${SODAMI_KOREAN_PALATE}

아래는 "시절소담"에 이미 실려 있는 레시피입니다. 그런데 이 레시피대로 만들면 맛이 밍밍하다는 피드백을 받았습니다.
위 "맛의 기준"에 맞춰, **실제로 먹었을 때 확실히 맛있도록** 재료와 조리 단계를 다시 설계해주세요.

[레시피 정보]
제목: ${title}
부제: ${subtitle}
설명: ${description}
분류: ${category}
주재료: ${mainIngredient}
인분: ${servings}인분
난이도 등급: ${level}

[현재 재료]
${ingredientsText}

[현재 조리 단계]
${stepsText}

[현재 팁]
${tipsText}

[보강 지침]
- 요리의 정체성은 유지하세요. 제목과 주재료는 그대로이고, 다른 요리로 바꾸지 마세요.
- 맛을 끌어올리는 데 꼭 필요한 재료를 추가하세요(육수 재료, 국간장·액젓·새우젓 등 감칠맛 재료, 단맛, 산미, 마무리 향).
  다만 한국 가정집 마트에서 살 수 있는 재료만 쓰세요. 구하기 어려운 재료는 넣지 마세요.
- 모든 재료에 구체적인 분량을 적으세요. "약간", "적당량"은 절대 쓰지 마세요.
- 조리 단계는 향 내기 → 본조리 → 간 맞추기 → 마무리 순서가 드러나게 다시 쓰세요.
- 마지막 단계에는 반드시 간을 보고 맞추라는 안내를 포함하세요.
- 과조리를 피하도록 시간과 불 세기를 정확히 적으세요.
- 곁들임 양념장이 필요한 요리라면 그 재료와 분량을 재료 목록에 포함하고, 만드는 단계도 넣으세요.
- 단계 수는 4~8개로, 각 단계 설명은 1~3문장으로 명확하게 쓰세요.
- 난이도 등급이 'home'이면 평일 저녁에 만들 수 있는 현실적인 범위를 유지하되, 맛은 타협하지 마세요.
- 말투는 존댓말, 다정하지만 정확하게.

[출력 형식]
아래 JSON 형식으로만 출력하세요. 코드블록 표시(\`\`\`)나 다른 설명은 절대 넣지 마세요.
{
  "ingredients": [{ "name": "재료명", "amount": "분량" }],
  "steps": [{ "title": "단계 제목", "description": "설명", "tip": "선택", "timerSeconds": 600, "checkpoint": "이 단계가 잘 됐는지 확인하는 짧은 문구" }],
  "tips": ["맛을 더 끌어올리는 팁", "..."]
}
- "tip", "timerSeconds", "checkpoint"는 해당하는 단계에만 넣으세요(없으면 생략).
- "timerSeconds"는 실제로 시간을 재야 하는 단계에만, 초 단위 숫자로.
- "tips"는 2~4개로, 이 요리의 맛을 좌우하는 핵심만 쓰세요.`;
}

async function upgradeRecipe(prompt: string): Promise<UpgradeResult | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { maxOutputTokens: 4000, temperature: 0.8 },
  });

  const raw = (response.text || '').trim();
  const cleaned = raw
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as UpgradeResult;
    if (
      !Array.isArray(parsed.ingredients) ||
      !Array.isArray(parsed.steps) ||
      parsed.ingredients.length === 0 ||
      parsed.steps.length === 0
    ) {
      return null;
    }
    // 모호한 계량이 남아 있으면 실패로 간주하고 재시도하게 둔다
    const vague = parsed.ingredients.some((i) =>
      /약간|적당량|조금$/.test(String(i.amount ?? ''))
    );
    if (vague) return null;
    return parsed;
  } catch {
    return null;
  }
}

function renderIngredients(items: UpgradedIngredient[]): string[] {
  return items.map((i) => `      { name: '${esc(i.name)}', amount: '${esc(i.amount)}' },`);
}

function renderSteps(items: UpgradedStep[]): string[] {
  return items.map((s) => {
    const parts = [`title: '${esc(s.title)}'`, `description: '${esc(s.description)}'`];
    if (s.tip) parts.push(`tip: '${esc(s.tip)}'`);
    if (typeof s.timerSeconds === 'number' && s.timerSeconds > 0) {
      parts.push(`timerSeconds: ${Math.round(s.timerSeconds)}`);
    }
    if (s.checkpoint) parts.push(`checkpoint: '${esc(s.checkpoint)}'`);
    return `      { ${parts.join(', ')} },`;
  });
}

function renderTips(items: string[]): string[] {
  return items.map((t) => `      '${esc(t)}',`);
}

/** 파일 하나를 처리. 반환값은 이번에 보강한 레시피 수. */
async function processFile(fileName: string, budget: { left: number }): Promise<number> {
  const filePath = join(DATA_DIR, fileName);
  let lines = readFileSync(filePath, 'utf-8').split('\n');
  let upgraded = 0;

  // 레시피 블록 시작 위치(들여쓰기 2칸의 여는 중괄호)를 뒤에서부터 처리해야
  // 앞쪽 줄 인덱스가 밀리지 않는다.
  const blockStarts: number[] = [];
  lines.forEach((l, i) => {
    if (/^\s{2}\{\s*$/.test(l)) blockStarts.push(i);
  });

  for (let b = blockStarts.length - 1; b >= 0; b--) {
    if (budget.left <= 0) break;

    const start = blockStarts[b];
    const end = lines.findIndex((l, i) => i > start && /^\s{2}\},\s*$/.test(l));
    if (end === -1) continue;

    const blockLines = lines.slice(start, end + 1);
    const block = blockLines.join('\n');

    const id = readField(block, 'id');
    const title = readField(block, 'title');
    if (!id || !title) continue;

    // 대상 필터
    if (recipeArg && id !== recipeArg) continue;
    if (monthArg) {
      const m = block.match(/month:\s*(\d+)/);
      if (!m || m[1] !== monthArg) continue;
    }
    if (levelArg) {
      const lv = readField(block, 'level');
      if (lv !== levelArg) continue;
    }
    if (!force && /flavorUpgraded:\s*true/.test(block)) continue;

    const ingRange = findArrayRange(blockLines, 'ingredients');
    const stepRange = findArrayRange(blockLines, 'steps');
    const tipRange = findArrayRange(blockLines, 'tips');
    if (!ingRange || !stepRange || !tipRange) {
      console.log(`  [${id}] 배열 구조를 찾지 못해 건너뜁니다.`);
      continue;
    }

    const ingredientsText = blockLines.slice(ingRange[0] + 1, ingRange[1]).join('\n');
    const stepsText = blockLines.slice(stepRange[0] + 1, stepRange[1]).join('\n');
    const tipsText = blockLines.slice(tipRange[0] + 1, tipRange[1]).join('\n');

    const servingsMatch = block.match(/servings:\s*(\d+)/);
    const prompt = buildPrompt(
      title,
      readField(block, 'subtitle') ?? '',
      readField(block, 'description') ?? '',
      readField(block, 'category') ?? '',
      readField(block, 'mainIngredient') ?? '',
      servingsMatch?.[1] ?? '2',
      readField(block, 'level') ?? 'home',
      ingredientsText,
      stepsText,
      tipsText
    );

    console.log(`  [${id}] ${title} 보강 중...`);
    if (dryRun) {
      upgraded++;
      budget.left--;
      continue;
    }

    let result: UpgradeResult | null = mock ? MOCK_RESULT : null;
    for (let attempt = 0; attempt < 3 && !result; attempt++) {
      try {
        result = await upgradeRecipe(prompt);
      } catch (err) {
        console.log(`    시도 ${attempt + 1} 실패: ${(err as Error).message}`);
      }
      if (!result) await new Promise((r) => setTimeout(r, 1500));
    }

    if (!result) {
      console.log(`    [${id}] 보강 실패 — 원본 유지`);
      continue;
    }

    // 뒤쪽 배열부터 교체해야 앞쪽 인덱스가 유지된다 (tips → steps → ingredients)
    const newBlock = blockLines.slice();
    const replaceRange = (range: [number, number], body: string[]) => {
      newBlock.splice(range[0] + 1, range[1] - range[0] - 1, ...body);
    };
    const ordered: Array<[[number, number], string[]]> = [
      [tipRange, renderTips(result.tips ?? [])],
      [stepRange, renderSteps(result.steps)],
      [ingRange, renderIngredients(result.ingredients)],
    ];
    ordered.sort((a, b2) => b2[0][0] - a[0][0]);
    for (const [range, body] of ordered) replaceRange(range, body);

    // 보강 표시(재실행 시 건너뛰기 위함)
    if (!/flavorUpgraded:\s*true/.test(newBlock.join('\n'))) {
      const idLineIdx = newBlock.findIndex((l) => /^\s{4}id:\s*'/.test(l));
      if (idLineIdx !== -1) {
        newBlock.splice(idLineIdx + 1, 0, '    flavorUpgraded: true,');
      }
    }

    lines = [...lines.slice(0, start), ...newBlock, ...lines.slice(end + 1)];
    writeFileSync(filePath, lines.join('\n'), 'utf-8');

    upgraded++;
    budget.left--;
    console.log(`    [${id}] 완료 (재료 ${result.ingredients.length}개, 단계 ${result.steps.length}개)`);

    await new Promise((r) => setTimeout(r, 800)); // 레이트리밋 여유
  }

  return upgraded;
}

async function main() {
  let targetFiles: string[];
  if (fileArg) {
    targetFiles = [fileArg];
  } else {
    targetFiles = readdirSync(DATA_DIR).filter(
      (f) => f.startsWith('recipes-') && f.endsWith('.ts')
    );
  }

  const budget = { left: limit };
  let total = 0;

  for (const file of targetFiles) {
    if (budget.left <= 0) break;
    const before = budget.left;
    const count = await processFile(file, budget);
    if (count > 0) console.log(`${file}: ${count}개 보강`);
    total += count;
    if (before !== budget.left && recipeArg) break; // 단일 레시피면 찾는 즉시 종료
  }

  console.log(`\n완료! 총 ${total}개 레시피를 보강했습니다.`);
  if (!dryRun && total > 0) {
    console.log('git diff 로 결과를 꼭 확인하세요.');
  }
}

main().catch((err) => {
  console.error('오류:', err);
  process.exit(1);
});

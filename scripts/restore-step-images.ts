/**
 * generate-images.ts 실행 중 출력된 "완료: https://..." 로그를 바탕으로,
 * 손실된 stepImage 필드를 데이터 파일에 다시 채워 넣는 1회성 복구 스크립트입니다.
 *
 * recipe-map.json: { "1-1": [["밥 짓기", "https://...png"], ...], ... } 형태의
 * 매핑 파일을 읽어, 각 레시피의 동일한 title을 가진 step 줄에 stepImage를 삽입합니다.
 *
 * 실행 방법:
 *   npx tsx scripts/restore-step-images.ts
 *
 * 이미 stepImage가 있는 줄은 건너뜁니다. 같은 레시피에 동일한 title의 단계가
 * 여러 개 있으면(드문 경우) 순서대로 매칭합니다.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const mapPath = join(__dirname, '..', 'recipe-map.json');
if (!existsSync(mapPath)) {
  console.error(`매핑 파일이 없습니다: ${mapPath}`);
  console.error('recipe-map.json을 scripts 폴더의 상위(프로젝트 루트)에 두세요.');
  process.exit(1);
}

const recipeMap: Record<string, [string, string][]> = JSON.parse(
  readFileSync(mapPath, 'utf-8')
);

const files = [
  'recipes-q1.ts',
  'recipes-q2.ts',
  'recipes-q3.ts',
  'recipes-q1-extra.ts',
  'recipes-q2-extra.ts',
  'recipes-q3-extra.ts',
  'recipes-q1-extra2.ts',
  'recipes-q2-extra2.ts',
  'recipes-q3-extra2.ts',
];

function isStepLine(line: string): boolean {
  return /^\s*\{\s*title:/.test(line);
}

function lineHasStepImage(line: string): boolean {
  return /stepImage:\s*'/.test(line);
}

function extractTitle(line: string): string | null {
  const m = line.match(/title:\s*'((?:[^'\\]|\\.)*)'/);
  return m ? m[1] : null;
}

function insertStepImage(line: string, url: string): string {
  const trimmedEnd = line.trimEnd();
  if (!trimmedEnd.endsWith('},')) return line;
  const withoutTrailing = trimmedEnd.slice(0, -2).trimEnd();
  const escaped = url.replace(/'/g, "\\'");
  return `${withoutTrailing}, stepImage: '${escaped}' },`;
}

let totalInserted = 0;
let totalSkippedAlready = 0;
let totalNoMatch = 0;

for (const fileName of files) {
  const filePath = join(__dirname, '..', 'src', 'data', fileName);
  if (!existsSync(filePath)) {
    console.log(`건너뜀 (파일 없음): ${fileName}`);
    continue;
  }

  const lines = readFileSync(filePath, 'utf-8').split('\n');
  const result = lines.slice();
  let currentRecipeId: string | null = null;
  // 레시피별로 사용된 title의 인덱스를 추적 (동일 title 중복 시 순서대로 소진)
  const usedIndexByRecipeTitle: Record<string, number> = {};
  let fileInserted = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const idMatch = line.match(/^\s{4}id:\s*'([^']+)'/);
    if (idMatch) {
      currentRecipeId = idMatch[1];
      continue;
    }

    if (!isStepLine(line)) continue;
    if (lineHasStepImage(line)) {
      totalSkippedAlready++;
      continue;
    }
    if (!currentRecipeId) continue;

    const stepsForRecipe = recipeMap[currentRecipeId];
    if (!stepsForRecipe) continue;

    const title = extractTitle(line);
    if (!title) continue;

    const key = `${currentRecipeId}::${title}`;
    const usedCount = usedIndexByRecipeTitle[key] || 0;

    // 같은 title을 가진 항목들 중 아직 안 쓴 것 찾기
    const matches = stepsForRecipe
      .map((pair, idx) => ({ pair, idx }))
      .filter(({ pair }) => pair[0] === title);

    if (matches.length === 0) {
      totalNoMatch++;
      continue;
    }

    const chosen = matches[Math.min(usedCount, matches.length - 1)];
    usedIndexByRecipeTitle[key] = usedCount + 1;

    result[i] = insertStepImage(line, chosen.pair[1]);
    fileInserted++;
    totalInserted++;
  }

  if (fileInserted > 0) {
    writeFileSync(filePath, result.join('\n'), 'utf-8');
  }
  console.log(`${fileName}: ${fileInserted}개 삽입`);
}

console.log('\n=== 요약 ===');
console.log('총 삽입:', totalInserted);
console.log('이미 있어서 건너뜀:', totalSkippedAlready);
console.log('매칭 실패(제목 불일치):', totalNoMatch);

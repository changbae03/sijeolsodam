/**
 * Vercel Blob 저장소에 실제로 존재하는 파일 목록을 list() API로 직접 조회하여,
 * 데이터 파일의 heroImage(완성샷)와 stepImage(단계별 이미지)를 정확하게 복구합니다.
 *
 * "This blob already exists" 에러가 났다는 것은 해당 경로의 파일이 이미 Blob에
 * 존재한다는 뜻입니다. 즉 새로 만들 필요 없이, 그 경로의 실제 URL만 알아내면
 * 데이터 파일에 다시 연결할 수 있습니다.
 *
 * 실행 방법:
 *   BLOB_READ_WRITE_TOKEN=키 npx tsx scripts/restore-from-blob-list.ts
 */
import { list } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error('BLOB_READ_WRITE_TOKEN 환경변수가 필요합니다.');
  process.exit(1);
}

async function getAllBlobs() {
  const all: { pathname: string; url: string }[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ token, cursor, prefix: 'recipes/', limit: 1000 });
    all.push(...result.blobs.map((b) => ({ pathname: b.pathname, url: b.url })));
    cursor = result.cursor;
  } while (cursor);
  return all;
}

function isStepLine(line: string): boolean {
  return /^\s*\{\s*title:/.test(line);
}

function lineHasStepImage(line: string): boolean {
  return /stepImage:\s*'/.test(line);
}

function lineHasHeroImage(line: string): boolean {
  return /^\s{4}heroImage:\s*'/.test(line);
}

function isUnsplashHero(line: string): boolean {
  return /heroImage:\s*'https:\/\/images\.unsplash\.com/.test(line);
}

function insertStepImage(line: string, url: string): string {
  const trimmedEnd = line.trimEnd();
  if (!trimmedEnd.endsWith('},')) return line;
  const withoutTrailing = trimmedEnd.slice(0, -2).trimEnd();
  const escaped = url.replace(/'/g, "\\'");
  return `${withoutTrailing}, stepImage: '${escaped}' },`;
}

function replaceHeroImage(line: string, url: string): string {
  const escaped = url.replace(/'/g, "\\'");
  return line.replace(/heroImage:\s*'(?:[^'\\]|\\.)*'/, `heroImage: '${escaped}'`);
}

async function main() {
  console.log('Blob 저장소 파일 목록 조회 중...');
  const blobs = await getAllBlobs();
  console.log(`총 ${blobs.length}개 파일 발견`);

  if (blobs.length === 0) {
    console.warn('Blob 저장소에서 recipes/ 경로 파일을 하나도 찾지 못했습니다.');
    console.warn('토큰이 올바른지, 저장소가 맞는지 확인 후 다시 시도하세요.');
    process.exit(1);
  }

  // recipeId -> { hero?: url, steps: Map<lineIndexInOriginalOrder, url> }
  // 여기서는 경로 패턴으로 hero/step을 구분합니다.
  const heroByRecipe: Record<string, string> = {};
  const stepsByRecipe: Record<string, { stepNum: number; url: string }[]> = {};

  for (const blob of blobs) {
    // recipes/{recipeId}/hero.png 또는 recipes/{recipeId}/step-{N}.png
    const heroMatch = blob.pathname.match(/^recipes\/([\d-]+)\/hero\.png$/);
    if (heroMatch) {
      heroByRecipe[heroMatch[1]] = blob.url;
      continue;
    }
    const stepMatch = blob.pathname.match(/^recipes\/([\d-]+)\/step-(\d+)\.png$/);
    if (stepMatch) {
      const rid = stepMatch[1];
      const stepNum = Number(stepMatch[2]);
      if (!stepsByRecipe[rid]) stepsByRecipe[rid] = [];
      stepsByRecipe[rid].push({ stepNum, url: blob.url });
    }
  }

  // 각 레시피의 step들을 stepNum 순으로 정렬 (원본 라인 순서와 동일했을 것으로 가정)
  for (const rid in stepsByRecipe) {
    stepsByRecipe[rid].sort((a, b) => a.stepNum - b.stepNum);
  }

  console.log('완성샷 보유 레시피 수:', Object.keys(heroByRecipe).length);
  console.log('단계이미지 보유 레시피 수:', Object.keys(stepsByRecipe).length);

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

  let totalHeroFixed = 0;
  let totalStepFixed = 0;

  for (const fileName of files) {
    const filePath = join(__dirname, '..', 'src', 'data', fileName);
    const original = readFileSync(filePath, 'utf-8');
    writeFileSync(filePath + '.bak', original, 'utf-8'); // 안전을 위한 백업
    const lines = original.split('\n');
    const result = lines.slice();
    let currentRecipeId: string | null = null;
    let stepCursorByRecipe: Record<string, number> = {};
    let fileHeroFixed = 0;
    let fileStepFixed = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const idMatch = line.match(/^\s{4}id:\s*'([^']+)'/);
      if (idMatch) {
        currentRecipeId = idMatch[1];
        continue;
      }

      if (!currentRecipeId) continue;

      // 완성샷: Unsplash로 되돌아간 줄을 Blob URL로 교체
      if (lineHasHeroImage(line) && isUnsplashHero(line)) {
        const heroUrl = heroByRecipe[currentRecipeId];
        if (heroUrl) {
          result[i] = replaceHeroImage(line, heroUrl);
          fileHeroFixed++;
          totalHeroFixed++;
        }
        continue;
      }

      // 단계 이미지: stepImage가 없는 단계 줄에 순서대로 채워넣기
      if (isStepLine(line) && !lineHasStepImage(line)) {
        const stepUrls = stepsByRecipe[currentRecipeId];
        if (stepUrls && stepUrls.length > 0) {
          const cursor = stepCursorByRecipe[currentRecipeId] || 0;
          if (cursor < stepUrls.length) {
            result[i] = insertStepImage(line, stepUrls[cursor].url);
            stepCursorByRecipe[currentRecipeId] = cursor + 1;
            fileStepFixed++;
            totalStepFixed++;
          }
        }
      }
    }

    if (fileHeroFixed > 0 || fileStepFixed > 0) {
      writeFileSync(filePath, result.join('\n'), 'utf-8');
    }
    console.log(`${fileName}: 완성샷 ${fileHeroFixed}개, 단계이미지 ${fileStepFixed}개 복구`);
  }

  console.log('\n=== 요약 ===');
  console.log('총 완성샷 복구:', totalHeroFixed);
  console.log('총 단계이미지 복구:', totalStepFixed);
}

main();

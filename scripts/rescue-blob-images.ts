/**
 * Blob 탈출 스크립트 — 정지된 Vercel Blob에서 레포 정적 저장으로 이전.
 *
 * 배경: Hobby Blob은 Advanced Operations 월 2,000회 한도가 있어 업로드가 많은
 * 이 프로젝트 구조와 근본적으로 안 맞는다 (스토어 정지 2회째). 이후 이미지는
 * 전부 레포 안 public/images/ 정적 저장으로 통일한다.
 *
 * 동작: src/data/*.ts의 blob.vercel-storage.com URL을 전부 찾아
 *  1) 공개 URL 다운로드 시도 (정지 스토어도 읽기는 열려 있는 경우가 있음)
 *  2) 성공 -> public/images/<경로> 저장 + 데이터 URL을 로컬 경로로 교체 (항목마다 즉시 저장, 재개 가능)
 *  3) 실패 -> 재생성 대상으로 수집, 마지막에 재생성 커맨드를 출력
 *
 * 사용법 (토큰 불필요 — 공개 URL만 사용):
 *   npx tsx scripts/rescue-blob-images.ts
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BLOB_URL_REGEX =
  /(?:imageUrl|heroImage|stepImage|image):\s*'(https:\/\/[^']*\.blob\.vercel-storage\.com\/[^']*)'/g;

function pathnameFromUrl(url: string): string {
  const u = new URL(url);
  return decodeURIComponent(u.pathname.replace(/^\//, ''));
}

async function main() {
  const dataDir = join(__dirname, '..', 'src', 'data');
  const files = readdirSync(dataDir).filter((f) => f.endsWith('.ts'));

  const urls = new Set<string>();
  for (const file of files) {
    const content = readFileSync(join(dataDir, file), 'utf-8');
    for (const m of content.matchAll(BLOB_URL_REGEX)) urls.add(m[1]);
  }

  console.log(`Blob URL ${urls.size}개 발견 — 다운로드 시도 시작`);

  let rescued = 0;
  const failed: string[] = [];

  for (const url of urls) {
    const relPath = pathnameFromUrl(url); // 예: recipes/xxx/hero.webp, ingredients/감자.webp
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());

      const localPath = join(__dirname, '..', 'public', 'images', relPath);
      mkdirSync(dirname(localPath), { recursive: true });
      writeFileSync(localPath, buffer);

      const newUrl = `/images/${relPath}`;
      for (const file of files) {
        const p = join(dataDir, file);
        const content = readFileSync(p, 'utf-8');
        if (!content.includes(url)) continue;
        writeFileSync(p, content.split(url).join(newUrl), 'utf-8');
      }

      rescued += 1;
      console.log(`[구출 ${rescued}] ${relPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
    } catch (err) {
      failed.push(relPath);
      console.warn(`[실패] ${relPath}: ${err instanceof Error ? err.message : err}`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n완료 — 구출 ${rescued}개 / 실패 ${failed.length}개`);
  if (rescued > 0) {
    console.log('데이터 파일의 URL이 로컬 경로로 교체되었습니다. git add -A && commit && push 하세요.');
  }
  if (failed.length > 0) {
    console.log('\n다운로드가 막힌 항목 — 재생성이 필요합니다:');
    const recipeIds = failed
      .map((p) => p.match(/^recipes\/([^/]+)\//)?.[1])
      .filter((v, i, a): v is string => !!v && a.indexOf(v) === i);
    const ingredientNames = failed
      .map((p) => p.match(/^ingredients\/(.+)\.(?:webp|png)$/)?.[1])
      .filter((v): v is string => !!v);

    if (recipeIds.length > 0) {
      console.log(`\n# 레시피 히어로 ${recipeIds.length}개 재생성 (로컬 저장 — BLOB 토큰 없이):`);
      console.log(
        `for id in ${recipeIds.join(' ')}; do npx tsx scripts/generate-images.ts --recipe=$id --force; done`
      );
    }
    if (ingredientNames.length > 0) {
      console.log(`\n# 식재료 원물 ${ingredientNames.length}개 재생성 (로컬 저장 — BLOB 토큰 없이):`);
      console.log(
        `for n in ${ingredientNames.join(' ')}; do npx tsx scripts/generate-ingredient-images.ts --ingredient=$n --replace-blob; done`
      );
    }
  }
}

main();

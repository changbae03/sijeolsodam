/**
 * 기존 Blob 이미지 일괄 압축 마이그레이션.
 *
 * 데이터 파일(src/data/*.ts)에 박힌 blob.vercel-storage.com PNG URL을 전부 찾아
 * 내려받아 WebP(최대 1200px, q80)로 압축해 같은 경로(.webp)로 다시 올리고,
 * 데이터 파일의 URL을 교체한 뒤 원본 PNG blob을 삭제한다.
 * 식재료 원물 사진 ~286장(장당 1~2MB)이 주 대상 — 약 400MB+ -> ~40MB로 줄어
 * Blob 무료 한도(1GB) 안에서 레시피 전체 배치까지 수용 가능해진다.
 *
 * 사용법 (로컬에서, BLOB_READ_WRITE_TOKEN 필수):
 *   BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/compress-existing-images.ts --dry-run   (대상 목록·용량만 확인)
 *   BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/compress-existing-images.ts             (실행: 압축·교체·원본 삭제)
 *   BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/compress-existing-images.ts --keep-old  (원본 blob을 지우지 않음)
 *
 * 안전장치:
 *  - 항목 하나 처리할 때마다 데이터 파일을 즉시 저장 -> 중간에 끊겨도 다시 실행하면 이어서 진행
 *  - 이미 .webp인 URL은 건너뜀 (멱등)
 *  - 원본 삭제는 새 URL 업로드 + 파일 저장이 모두 성공한 뒤에만 수행
 */

import { put, del, list } from '@vercel/blob';
import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const keepOld = args.includes('--keep-old');
// --orphans: Blob 저장소 전체를 나열해 데이터 파일이 참조하지 않는 파일을 보여줌
// --delete-orphans: 그 고아 파일들을 실제로 삭제 (참조 목록에 없는 것만)
const orphanReport = args.includes('--orphans') || args.includes('--delete-orphans');
const deleteOrphans = args.includes('--delete-orphans');

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
if (!blobToken && !dryRun) {
  console.error('BLOB_READ_WRITE_TOKEN 환경변수가 필요해요. (--dry-run은 토큰 없이 가능)');
  process.exit(1);
}

const IMAGE_FIELD_REGEX =
  /((?:imageUrl|heroImage|stepImage|image):\s*')(https:\/\/[^']*\.blob\.vercel-storage\.com\/[^']*\.(?:png|jpg|jpeg))(')/g;

interface Target {
  file: string;
  url: string;
}

function collectTargets(dataDir: string): Target[] {
  const targets: Target[] = [];
  const files = readdirSync(dataDir).filter((f) => f.endsWith('.ts'));
  for (const file of files) {
    const content = readFileSync(join(dataDir, file), 'utf-8');
    for (const match of content.matchAll(IMAGE_FIELD_REGEX)) {
      targets.push({ file, url: match[2] });
    }
  }
  return targets;
}

async function compressToWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

/** blob URL에서 저장 경로(pathname)를 복원. 한글 경로는 인코딩돼 있어 디코드한다. */
function pathnameFromUrl(url: string): string {
  const u = new URL(url);
  return decodeURIComponent(u.pathname.replace(/^\//, ''));
}

/** Blob 저장소 전체를 나열해, 데이터 파일이 참조하지 않는 고아 파일을 리포트/삭제 */
async function runOrphanReport(referencedUrls: Set<string>) {
  // 참조 URL의 경로만 뽑아 비교 (도메인 표기가 달라도 경로가 같으면 같은 파일)
  const referencedPaths = new Set(Array.from(referencedUrls).map((u) => pathnameFromUrl(u)));

  let cursor: string | undefined;
  let totalCount = 0;
  let totalBytes = 0;
  const orphans: { url: string; pathname: string; size: number }[] = [];

  do {
    const page = await list({ token: blobToken, cursor, limit: 1000 });
    for (const blob of page.blobs) {
      totalCount += 1;
      totalBytes += blob.size;
      if (!referencedPaths.has(decodeURIComponent(blob.pathname))) {
        orphans.push({ url: blob.url, pathname: blob.pathname, size: blob.size });
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const orphanBytes = orphans.reduce((a, b) => a + b.size, 0);
  console.log(
    `\nBlob 저장소 전체: ${totalCount}개 / ${(totalBytes / 1024 / 1024).toFixed(1)}MB`
  );
  console.log(
    `데이터 파일이 참조하는 파일: ${referencedPaths.size}개 -> 고아 파일: ${orphans.length}개 / ${(orphanBytes / 1024 / 1024).toFixed(1)}MB`
  );
  for (const o of orphans.slice(0, 30)) {
    console.log(`  - ${decodeURIComponent(o.pathname)} (${(o.size / 1024).toFixed(0)}KB)`);
  }
  if (orphans.length > 30) console.log(`  ... 외 ${orphans.length - 30}개`);

  if (deleteOrphans && orphans.length > 0) {
    console.log('\n--delete-orphans: 고아 파일 삭제 중...');
    let deleted = 0;
    for (const o of orphans) {
      try {
        await del(o.url, { token: blobToken });
        deleted += 1;
      } catch (e) {
        console.warn(`  삭제 실패: ${o.pathname}`, e);
      }
    }
    console.log(`고아 파일 ${deleted}개 삭제 완료, 약 ${(orphanBytes / 1024 / 1024).toFixed(1)}MB 확보`);
  } else if (orphans.length > 0) {
    console.log('\n삭제하려면 --delete-orphans 플래그로 다시 실행하세요.');
  }
}

async function main() {
  const dataDir = join(__dirname, '..', 'src', 'data');
  const targets = collectTargets(dataDir);
  // 같은 URL이 여러 파일에 있을 수 있으니 URL 기준으로 중복 제거해 처리하되, 교체는 모든 파일에서
  const uniqueUrls = Array.from(new Set(targets.map((t) => t.url)));

  console.log(`압축 대상 PNG: ${uniqueUrls.length}개 (참조 ${targets.length}곳)`);

  if (orphanReport) {
    if (!blobToken) {
      console.error('--orphans / --delete-orphans 는 BLOB_READ_WRITE_TOKEN이 필요해요.');
      process.exit(1);
    }
    // 참조 기준: PNG뿐 아니라 이미 변환된 webp 등 모든 blob URL 필드
    const allRefRegex = /(?:imageUrl|heroImage|stepImage|image):\s*'(https:\/\/[^']*\.blob\.vercel-storage\.com\/[^']*)'/g;
    const allRefs = new Set<string>();
    for (const file of readdirSync(dataDir).filter((f) => f.endsWith('.ts'))) {
      const content = readFileSync(join(dataDir, file), 'utf-8');
      for (const m of content.matchAll(allRefRegex)) allRefs.add(m[1]);
    }
    await runOrphanReport(allRefs);
    return;
  }

  if (dryRun) {
    let totalBytes = 0;
    let checked = 0;
    for (const url of uniqueUrls) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        const len = Number(res.headers.get('content-length') || 0);
        totalBytes += len;
        checked += 1;
      } catch {
        // HEAD 실패는 무시하고 개수만 집계
      }
    }
    console.log(
      `현재 총 용량(HEAD 확인 ${checked}개): ${(totalBytes / 1024 / 1024).toFixed(1)}MB` +
        ` -> 압축 후 예상: ${((totalBytes / 1024 / 1024) * 0.08).toFixed(1)}MB 안팎`
    );
    console.log('--dry-run 모드라 아무것도 변경하지 않았어요.');
    return;
  }

  let done = 0;
  let failed = 0;
  let savedBytes = 0;

  for (const url of uniqueUrls) {
    const label = pathnameFromUrl(url);
    try {
      // 1) 다운로드
      const res = await fetch(url);
      if (!res.ok) throw new Error(`다운로드 실패 HTTP ${res.status}`);
      const original = Buffer.from(await res.arrayBuffer());

      // 2) 압축
      const webp = await compressToWebp(original);

      // 3) 같은 경로 .webp로 업로드
      const newPath = pathnameFromUrl(url).replace(/\.(png|jpg|jpeg)$/i, '.webp');
      const blob = await put(newPath, webp, {
        access: 'public',
        contentType: 'image/webp',
        addRandomSuffix: false,
        token: blobToken,
      });

      // 4) 모든 데이터 파일에서 URL 교체 후 즉시 저장 (재개 가능 지점)
      const files = readdirSync(dataDir).filter((f) => f.endsWith('.ts'));
      for (const file of files) {
        const p = join(dataDir, file);
        const content = readFileSync(p, 'utf-8');
        if (!content.includes(url)) continue;
        writeFileSync(p, content.split(url).join(blob.url), 'utf-8');
      }

      // 5) 원본 삭제 (기본 동작 — 저장 공간 확보가 목적이므로)
      if (!keepOld) {
        try {
          await del(url, { token: blobToken });
        } catch (e) {
          console.warn(`  원본 삭제 실패(계속 진행): ${label}`, e);
        }
      }

      savedBytes += original.length - webp.length;
      done += 1;
      console.log(
        `[${done}/${uniqueUrls.length}] ${label}: ${(original.length / 1024).toFixed(0)}KB -> ${(webp.length / 1024).toFixed(0)}KB`
      );
    } catch (err) {
      failed += 1;
      console.error(`실패: ${label}`, err);
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(
    `\n완료! 성공 ${done}개 / 실패 ${failed}개, 절약한 용량 약 ${(savedBytes / 1024 / 1024).toFixed(1)}MB`
  );
  console.log('데이터 파일이 수정되었으니 git diff 확인 후 커밋·푸시하세요.');
}

main();

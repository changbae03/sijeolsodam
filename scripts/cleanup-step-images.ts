/**
 * recipes/ 경로 아래 step-*.png (레시피 단계별 사진) 파일을
 * Vercel Blob 스토리지에서 한 번에 전부 삭제하는 스크립트.
 *
 * ⚠️ 식재료 사진(ingredients/ 경로)이나 완성작 사진(heroImage)은
 *    건드리지 않습니다. recipes/ 아래 "step-"이 포함된 파일만 지워요.
 *
 * 사용법:
 *   1) 이 파일을 sijeolsodam 프로젝트 폴더 안에 둡니다 (예: scripts/cleanup-step-images.ts)
 *   2) 터미널에서 실행:
 *
 *      BLOB_READ_WRITE_TOKEN=여기에토큰 npx tsx scripts/cleanup-step-images.ts
 *
 *   토큰은 Vercel 대시보드 → Storage → sijeolsodam2-blob (Public, 이미지가
 *   들어있는 스토어) → .env.local 탭에서 BLOB_READ_WRITE_TOKEN 값을
 *   복사해서 쓰면 됩니다.
 *
 *   먼저 --dry-run으로 몇 개가 지워질지 미리 확인하는 걸 추천해요:
 *      BLOB_READ_WRITE_TOKEN=여기에토큰 npx tsx scripts/cleanup-step-images.ts --dry-run
 */

import { list, del } from '@vercel/blob';

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN 환경변수가 없어요. 명령어 앞에 붙여서 실행해주세요.');
    process.exit(1);
  }

  console.log(DRY_RUN ? '🔍 미리보기 모드 (실제로 지우지 않음)\n' : '🗑️  실제 삭제 모드\n');

  let cursor: string | undefined;
  let totalFound = 0;
  let totalSize = 0;
  const toDelete: string[] = [];

  // recipes/ 경로 아래 step- 파일만 모으기 (페이지네이션 처리)
  do {
    const result = await list({
      prefix: 'recipes/',
      cursor,
      limit: 1000,
    });

    for (const blob of result.blobs) {
      // 경로 예시: recipes/5-1/step-27.png
      const isStepImage = blob.pathname.includes('/step-');
      if (isStepImage) {
        toDelete.push(blob.url);
        totalFound++;
        totalSize += blob.size;
      }
    }

    cursor = result.cursor;
  } while (cursor);

  console.log(`📋 찾은 단계별 사진: ${totalFound}개`);
  console.log(`💾 합산 용량: ${(totalSize / 1024 / 1024).toFixed(1)} MB\n`);

  if (totalFound === 0) {
    console.log('지울 게 없어요. 이미 깨끗한 상태예요.');
    return;
  }

  if (DRY_RUN) {
    console.log('실제로 지우려면 --dry-run 옵션을 빼고 다시 실행하세요.');
    console.log('\n샘플 (최대 10개):');
    toDelete.slice(0, 10).forEach((url) => console.log('  -', url));
    return;
  }

  // del()은 한 번에 여러 URL을 받을 수 있어요. 너무 많으면 100개씩 나눠서 처리.
  const BATCH_SIZE = 100;
  let deleted = 0;
  for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
    const batch = toDelete.slice(i, i + BATCH_SIZE);
    await del(batch);
    deleted += batch.length;
    console.log(`삭제 진행: ${deleted}/${totalFound}`);
  }

  console.log(`\n✅ 완료! 단계별 사진 ${deleted}개를 삭제했어요.`);
  console.log(`💾 약 ${(totalSize / 1024 / 1024).toFixed(1)} MB의 공간이 확보됐어요.`);
}

main().catch((err) => {
  console.error('스크립트 실행 중 오류가 발생했어요:', err);
  process.exit(1);
});

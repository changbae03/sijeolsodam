/**
 * 홈 화면 상단 배너에 쓸 "월별 대표 사진" 12장을 생성하는 스크립트입니다.
 * 레시피 완성샷을 재활용하던 기존 방식과 달리, 각 달의 계절감/식재료 분위기를
 * 표현하는 배너 전용 이미지를 새로 만들어 src/data/months.ts의 bannerImage 필드에
 * 채워 넣습니다.
 *
 * 실행 방법:
 *   GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-month-banners.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generateAndUploadImage } from '../src/lib/ai-image';
import { SODAMI_VISUAL_STYLE } from '../src/lib/persona';

interface MonthBannerSpec {
  month: number;
  /** 사진에 등장시킬 식재료/장면 묘사 (영어로 작성) */
  scene: string;
}

const MONTH_SPECS: MonthBannerSpec[] = [
  { month: 1, scene: 'a rustic wooden table with whole daikon radish, scallions, and root vegetables, warm winter morning light, cozy hearty mood' },
  { month: 2, scene: 'fresh seaweed, clams, and early spring greens arranged on a warm cream table, hints of the sea, soft daylight' },
  { month: 3, scene: 'wild spring greens, garlic chives, and tiny silver fish on a wooden board, fresh green sprouts, bright soft morning light' },
  { month: 4, scene: 'tender wild greens, butterbur, lettuce, and herbs freshly picked, vivid green textures, dewy fresh look' },
  { month: 5, scene: 'cucumbers, melons, and squid on a light table, early summer freshness, crisp bright daylight' },
  { month: 6, scene: 'whole new potatoes and cherry tomatoes piled together, golden warm summer sunlight, rustic harvest mood' },
  { month: 7, scene: 'corn, plums, and fresh perilla leaves on a wooden surface, deep midsummer warm light, vibrant colors' },
  { month: 8, scene: 'figs, abalone, and chili peppers arranged together, late summer abundance, soft warm afternoon light' },
  { month: 9, scene: 'blue crab, shiitake mushrooms, and jujube dates on a rustic table, early autumn warm tones' },
  { month: 10, scene: 'persimmons, chestnuts, and pumpkin arranged together, golden autumn harvest light, cozy warm colors' },
  { month: 11, scene: 'oysters, napa cabbage, and dried radish greens on a wooden table, late autumn muted warm light' },
  { month: 12, scene: 'citron, dried persimmons, and warm soup ingredients like radish and beans, winter evening warm glow' },
];

function buildPrompt(scene: string): string {
  return `A beautiful overhead or 45-degree angle food photography shot featuring ${scene}. ${SODAMI_VISUAL_STYLE}`;
}

/**
 * lines 배열에서 "month: N," 줄을 찾아 그 바로 다음 줄에 bannerImage 필드를
 * 삽입(또는 기존 bannerImage 줄을 교체)합니다. 안전을 위해 줄 단위로만 동작합니다.
 */
function upsertBannerImage(lines: string[], month: number, url: string): string[] {
  const monthLineIdx = lines.findIndex((l) => l.trim() === `month: ${month},`);
  if (monthLineIdx === -1) return lines;

  const nextLine = lines[monthLineIdx + 1];
  const escapedUrl = url.replace(/'/g, "\\'");
  const newBannerLine = `    bannerImage: '${escapedUrl}',`;

  if (nextLine && nextLine.trim().startsWith('bannerImage:')) {
    // 이미 있으면 교체
    const result = lines.slice();
    result[monthLineIdx + 1] = newBannerLine;
    return result;
  }

  // 없으면 month 줄 바로 다음에 삽입
  const result = lines.slice();
  result.splice(monthLineIdx + 1, 0, newBannerLine);
  return result;
}

async function main() {
  const monthsPath = join(__dirname, '..', 'src', 'data', 'months.ts');
  const original = readFileSync(monthsPath, 'utf-8');
  writeFileSync(monthsPath + '.bak', original, 'utf-8'); // 안전을 위한 백업

  let lines = original.split('\n');

  let successCount = 0;
  let failCount = 0;

  for (const spec of MONTH_SPECS) {
    console.log(`\n[${spec.month}월] 배너 사진 생성 중...`);
    const prompt = buildPrompt(spec.scene);
    const pathname = `banners/month-${spec.month}.png`;

    try {
      const url = await generateAndUploadImage(prompt, pathname);
      if (!url) {
        console.log('  이미지 생성 결과 없음, 건너뜀');
        failCount++;
        continue;
      }
      console.log('  완료:', url);
      lines = upsertBannerImage(lines, spec.month, url);
      successCount++;
    } catch (err) {
      console.log('  에러:', err);
      failCount++;
    }
  }

  writeFileSync(monthsPath, lines.join('\n'), 'utf-8');
  console.log(`\n완료! 성공 ${successCount}건, 실패 ${failCount}건`);
}

main();

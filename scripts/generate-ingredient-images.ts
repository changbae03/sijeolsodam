/**
 * 식재료 원물 사진을 Gemini(gemini-2.5-flash-image, "나노바나나")로 생성해
 * 저장하고, 생성된 경로를 src/data/months.ts에 채워 넣는 스크립트.
 * 레시피용 scripts/generate-images.ts와 동일한 안전장치 패턴을 따릅니다.
 *
 * 저장 방식은 두 가지 중 하나가 자동으로 선택됩니다:
 *  - BLOB_READ_WRITE_TOKEN이 있으면: Vercel Blob에 업로드 (기존 방식)
 *  - 없으면: 프로젝트 안 /public/images/ingredients/ 폴더에 직접 저장.
 *    이 경우 데이터에는 '/images/ingredients/이름.png' 같은 상대 경로가 들어가고,
 *    Next.js가 정적 파일로 그대로 서빙합니다. git에 커밋해서 배포하면 됩니다.
 *
 * 실행 방법:
 *   GEMINI_API_KEY=키 npx tsx scripts/generate-ingredient-images.ts --ingredient=햇감자
 *   (전체 실행: --all 플래그 필요)
 *   (이미 사진이 있는 것도 시절소담 톤으로 다시 만들고 싶으면: --replace-existing)
 *   (기존 Vercel Blob 사진들도 다시 생성하고 싶으면(Blob 스토어가 정지된 경우 등): --replace-blob)
 *
 * 안전장치:
 *  - 기본은 1개 식재료(--ingredient=이름)만 처리하도록 강제. --all을 명시해야 전체 실행.
 *  - 기본은 imageUrl이 아예 없는 항목만 채움. 이미 사진(Unsplash 등)이 있는 항목은
 *    --replace-existing을 명시해야 다시 생성함.
 *  - 이미 이미지 URL(Blob 또는 로컬 경로)인 항목은 기본적으로 건너뜀(중복 생성 방지).
 *    --replace-blob을 명시하면 기존 Blob URL도 다시 생성 대상에 포함.
 *  - 같은 식재료가 여러 달에 중복 등장하면(예: 도다리) 한 번만 생성해서 모든 줄에 동일하게 적용.
 *  - 매 항목 처리 후 즉시 파일에 저장 → 중간에 끊겨도 그때까지 결과는 남음.
 */
import { GoogleGenAI } from '@google/genai';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { SODAMI_VISUAL_STYLE } from '../src/lib/persona';

const apiKey = process.env.GEMINI_API_KEY;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const useLocalStorage = !blobToken;

if (!apiKey) {
  console.error('GEMINI_API_KEY 환경변수가 필요합니다.');
  process.exit(1);
}
if (useLocalStorage) {
  console.log('BLOB_READ_WRITE_TOKEN이 없어 /public/images/ingredients/ 폴더에 로컬로 저장합니다.');
}

const ai = new GoogleGenAI({ apiKey });

const args = process.argv.slice(2);
const ingredientArg = args.find((a) => a.startsWith('--ingredient='))?.split('=')[1];
const runAll = args.includes('--all');
const replaceExisting = args.includes('--replace-existing');
const replaceBlob = args.includes('--replace-blob');
// 로컬에 이미 저장된 이미지까지 강제로 다시 생성 (특정 이미지 교정용)
const forceRegen = args.includes('--force');
// 어종/형태가 계속 틀리게 나올 때 참조 사진을 함께 넣는다: --ref=./ref/갈치.jpg
const refImagePathRaw = args.find((a) => a.startsWith('--ref='))?.split('=')[1];
// 홈 디렉토리(~) 표기를 실제 경로로 펼친다
const refImagePath = refImagePathRaw?.startsWith('~')
  ? join(homedir(), refImagePathRaw.slice(1))
  : refImagePathRaw;

if (refImagePath && !existsSync(refImagePath)) {
  console.error(`참조 이미지를 찾을 수 없습니다: ${refImagePath}`);
  console.error('--ref= 뒤에는 실제 파일 경로를 넣어주세요.');
  console.error('맥에서는 "--ref=" 까지 입력한 뒤 파일을 터미널 창으로 드래그하면 경로가 자동 입력됩니다.');
  process.exit(1);
}

if (!ingredientArg && !runAll) {
  console.error(
    '안전장치: --ingredient=이름 으로 1개만 테스트하거나, 전체를 돌리려면 --all 을 명시하세요.\n' +
      '예: npx tsx scripts/generate-ingredient-images.ts --ingredient=햇감자'
  );
  process.exit(1);
}

type Category = '채소' | '과일' | '해산물' | '기타';

// 채소·과일 — 가이드의 "다양한 연출 예시" 4종 (영문, Gemini 프롬프트용)
const PRODUCE_VARIANTS = [
  'arranged generously in a woven wicker basket, with a soft linen cloth beside it',
  'piled in a wooden bowl, shot from a 45-degree top-down angle',
  'one piece halved to show the cross-section, the rest whole, arranged together',
  'arranged in a basket with a small herb sprig placed beside it as an accent',
];

// 해산물 — 바구니 대신 도마/얼음/리넨
const SEAFOOD_VARIANTS = [
  'arranged naturally on a wooden cutting board, with a herb sprig beside it',
  'placed on crushed ice, shot from a top-down angle',
  'arranged neatly on an ivory linen cloth',
  'arranged on a wooden tray, with a small lemon wedge as an accent',
];

function getVariant(name: string, category: Category): string {
  const variants = category === '해산물' ? SEAFOOD_VARIANTS : PRODUCE_VARIANTS;
  const seed = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return variants[seed % variants.length];
}

/**
 * 한글 이름만으로는 Gemini가 종/형태를 잘못 그리거나, 기본 연출이 어울리지 않는 식재료를 위한 힌트.
 *  - species: 어종·품종의 생김새를 못 맞출 때 쓰는 형태 설명
 *  - presentation: 기본 연출(SEAFOOD_VARIANTS/PRODUCE_VARIANTS) 대신 쓸 구도.
 *    실제로 그 재료를 사고 손질하는 모습이 더 자연스러울 때 지정한다.
 * 새로 발견되는 대로 여기에 추가.
 */
interface ImageHint {
  species?: string;
  presentation?: string;
}

const IMAGE_HINTS: Record<string, ImageHint> = {
  갈치: {
    species:
      'CRITICAL SPECIES: 갈치 is the largehead hairtail (beltfish / cutlassfish, Trichiurus lepturus). ' +
      'Its flesh is pure white and the skin is scaleless, mirror-bright metallic silver. ' +
      'The body is strongly flattened side-to-side, so each cut piece has a tall, narrow, ' +
      'slightly rectangular cross-section — never a round tube shape. ' +
      'A single continuous dorsal fin runs along the top edge of every piece. ' +
      'DO NOT depict mackerel, Pacific saury, herring or any round-bodied fish.',
    presentation:
      'cut into 5 to 6 thick crosswise steaks about 6cm long (the way hairtail is sold and ' +
      'prepared for Korean braising), the cut pieces arranged in a loose overlapping row on ' +
      'crushed ice on a pale ceramic plate, shot from a high angle',
  },
};

function buildPrompt(name: string, category: Category): string {
  const hintEntry = IMAGE_HINTS[name];
  const variant = hintEntry?.presentation ?? getVariant(name, category);
  const hint = hintEntry?.species ? ` ${hintEntry.species} ` : '';
  return (
    `A 45-degree top-down natural light food photograph of fresh, raw, uncooked ${name} ` +
    `(Korean seasonal ingredient), ${variant}. ` +
    `Ingredient only — absolutely NO cooked or prepared dish, no plate of cooked food, no cooking. ` +
    hint +
    `Background: ivory linen, light wood, or neutral stone table. ` +
    `Soft natural daylight, warm muted color grading, minimal editorial styling, generous negative space, subtle soft shadow.` +
    SODAMI_VISUAL_STYLE
  );
}

async function generateImageBuffer(prompt: string): Promise<Buffer | null> {
  // --ref=<경로>로 참조 사진을 주면 어종/형태를 그 사진에 맞춰 생성한다.
  // (구도·배경은 그대로 시절소담 스타일로, 사진을 베끼지는 않도록 지시)
  const contents: unknown[] = [];
  if (refImagePath) {
    const refBuffer = readFileSync(refImagePath);
    const ext = refImagePath.split('.').pop()?.toLowerCase();
    const mimeType =
      ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    contents.push({
      inlineData: { mimeType, data: refBuffer.toString('base64') },
    });
    contents.push({
      text:
        'The attached photo is an ANATOMY REFERENCE ONLY, provided to show what this ' +
        'species actually looks like — its body shape, proportions, fins, head and colour. ' +
        'Match the species and anatomy exactly. Do NOT copy the reference photo itself: ' +
        'ignore its composition, framing, background, lighting and crowding, and instead ' +
        'create an entirely new original photograph as described below.\n\n' +
        prompt,
    });
  } else {
    contents.push({ text: prompt });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents: contents as any,
  });
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }
  return null;
}

/** 레시피 스크립트와 동일한 압축: WebP 1200px q80 — 장당 1~2MB -> 100~150KB */
async function compressToWebp(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

async function uploadToBlob(buffer: Buffer, pathname: string): Promise<string> {
  const webp = await compressToWebp(buffer);
  const webpPath = pathname.replace(/\.png$/, '.webp');
  if (useLocalStorage) {
    const localPath = join(__dirname, '..', 'public', 'images', webpPath);
    mkdirSync(dirname(localPath), { recursive: true });
    writeFileSync(localPath, webp);
    return `/images/${webpPath}`;
  }
  const blob = await put(webpPath, webp, {
    access: 'public',
    contentType: 'image/webp',
    addRandomSuffix: false,
    token: blobToken,
  });
  return blob.url;
}

function isAlreadyGenerated(url: string): boolean {
  if (url.startsWith('/images/ingredients/')) return true; // 로컬 저장분은 항상 건너뜀
  if (url.includes('blob.vercel-storage.com')) return !replaceBlob; // Blob은 --replace-blob 줘야 다시 생성
  return false;
}

function slugify(name: string): string {
  // @vercel/blob의 put()이 pathname을 내부적으로 한 번 인코딩하므로
  // 여기서 미리 encodeURIComponent를 하면 이중 인코딩(%25...)이 되어버림.
  // 한글 그대로 넘기면 put()이 깨끗하게 한 번만 인코딩해줌.
  return name;
}

async function main() {
  let successCount = 0;
  let failCount = 0;
  const filePath = join(__dirname, '..', 'src', 'data', 'months.ts');
  const lines = readFileSync(filePath, 'utf-8').split('\n');

  // 같은 식재료가 여러 줄(여러 달)에 걸쳐 나오면 한 번만 생성하기 위한 캐시
  const generatedUrlByName = new Map<string, string>();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nameMatch = line.match(/\{ name: '((?:[^'\\]|\\.)*)'/);
    if (!nameMatch) continue;
    const name = nameMatch[1];

    if (ingredientArg && name !== ingredientArg) continue;

    const categoryMatch = line.match(/category: '([^']*)'/);
    const category = (categoryMatch?.[1] as Category) ?? '기타';

    const imageUrlMatch = line.match(/imageUrl: '([^']*)'/);
    const currentUrl = imageUrlMatch?.[1] ?? '';

    if (!forceRegen) {
      if (isAlreadyGenerated(currentUrl)) {
        continue; // 로컬 저장분은 항상 건너뜀, Blob은 --replace-blob 없으면 건너뜀
      }
      if (currentUrl && !replaceExisting && !replaceBlob) {
        continue; // 기존 사진 있고 --replace-existing 안 줬으면 건너뜀
      }
    }

    let url = generatedUrlByName.get(name);
    if (!url) {
      console.log(`\n[${name}] (${category}) 이미지 생성 중...`);
      try {
        const prompt = buildPrompt(name, category);
        const buffer = await generateImageBuffer(prompt);
        if (!buffer) {
          console.warn('  이미지 생성 결과 없음, 건너뜀');
          continue;
        }
        url = await uploadToBlob(buffer, `ingredients/${slugify(name)}.png`);
        generatedUrlByName.set(name, url);
        console.log('  업로드 완료:', url);
      } catch (err) {
        console.error('  생성 에러:', err);
        failCount++;
        continue;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    if (imageUrlMatch) {
      lines[i] = line.replace(/imageUrl: '([^']*)'/, `imageUrl: '${url}'`);
    } else {
      // imageUrl 필드가 아예 없으면 category 뒤에 새로 삽입
      lines[i] = line.replace(
        /(category: '[^']*')/,
        `$1, imageUrl: '${url}'`
      );
    }
    writeFileSync(filePath, lines.join('\n'), 'utf-8');
    successCount++;
  }

  if (successCount === 0 && failCount > 0) {
    console.log(`\n생성된 이미지가 없습니다. (실패 ${failCount}건) 위 에러를 확인해주세요.`);
    process.exitCode = 1;
  } else {
    console.log(`\n완료! ${successCount}개 생성${failCount > 0 ? `, ${failCount}건 실패` : ''}`);
  }
}

main();

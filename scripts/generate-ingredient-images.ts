/**
 * 식재료 원물 사진을 Gemini(gemini-2.5-flash-image, "나노바나나")로 생성해
 * Vercel Blob에 업로드하고, 생성된 URL을 src/data/months.ts에 채워 넣는 스크립트.
 * 레시피용 scripts/generate-images.ts와 동일한 안전장치 패턴을 따릅니다.
 *
 * 실행 방법:
 *   GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-ingredient-images.ts --ingredient=햇감자
 *   (전체 실행: --all 플래그 필요)
 *   (이미 사진이 있는 것도 시절소담 톤으로 다시 만들고 싶으면: --replace-existing)
 *
 * 안전장치:
 *  - 기본은 1개 식재료(--ingredient=이름)만 처리하도록 강제. --all을 명시해야 전체 실행.
 *  - 기본은 imageUrl이 아예 없는 항목만 채움. 이미 사진(Unsplash 등)이 있는 항목은
 *    --replace-existing을 명시해야 다시 생성함.
 *  - 이미 Blob URL인 항목(blob.vercel-storage.com)은 항상 건너뜀(중복 생성 방지).
 *  - 같은 식재료가 여러 달에 중복 등장하면(예: 도다리) 한 번만 생성해서 모든 줄에 동일하게 적용.
 *  - 매 항목 처리 후 즉시 파일에 저장 → 중간에 끊겨도 그때까지 결과는 남음.
 */
import { GoogleGenAI } from '@google/genai';
import { put } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { SODAMI_VISUAL_STYLE } from '../src/lib/persona';

const apiKey = process.env.GEMINI_API_KEY;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!apiKey) {
  console.error('GEMINI_API_KEY 환경변수가 필요합니다.');
  process.exit(1);
}
if (!blobToken) {
  console.error('BLOB_READ_WRITE_TOKEN 환경변수가 필요합니다. (Vercel 프로젝트 > Storage > Blob)');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const args = process.argv.slice(2);
const ingredientArg = args.find((a) => a.startsWith('--ingredient='))?.split('=')[1];
const runAll = args.includes('--all');
const replaceExisting = args.includes('--replace-existing');

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

function buildPrompt(name: string, category: Category): string {
  const variant = getVariant(name, category);
  return (
    `A 45-degree top-down natural light food photograph of fresh, raw, uncooked ${name} ` +
    `(Korean seasonal ingredient), ${variant}. ` +
    `Ingredient only — absolutely NO cooked or prepared dish, no plate of cooked food, no cooking. ` +
    `Background: ivory linen, light wood, or neutral stone table. ` +
    `Soft natural daylight, warm muted color grading, minimal editorial styling, generous negative space, subtle soft shadow.` +
    SODAMI_VISUAL_STYLE
  );
}

async function generateImageBuffer(prompt: string): Promise<Buffer | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: prompt,
  });
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }
  return null;
}

async function uploadToBlob(buffer: Buffer, pathname: string): Promise<string> {
  const blob = await put(pathname, buffer, {
    access: 'public',
    contentType: 'image/png',
    addRandomSuffix: false,
    token: blobToken,
  });
  return blob.url;
}

function isAlreadyBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com');
}

function slugify(name: string): string {
  // @vercel/blob의 put()이 pathname을 내부적으로 한 번 인코딩하므로
  // 여기서 미리 encodeURIComponent를 하면 이중 인코딩(%25...)이 되어버림.
  // 한글 그대로 넘기면 put()이 깨끗하게 한 번만 인코딩해줌.
  return name;
}

async function main() {
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

    if (isAlreadyBlobUrl(currentUrl)) {
      continue; // 항상 건너뜀 (중복 생성 방지)
    }
    if (currentUrl && !replaceExisting) {
      continue; // 기존 사진 있고 --replace-existing 안 줬으면 건너뜀
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
  }

  console.log('\n완료!');
}

main();

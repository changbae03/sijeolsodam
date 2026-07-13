/**
 * 레시피 완성샷 및 단계별 이미지를 Gemini(gemini-2.5-flash-image, 일명 "나노바나나")로
 * 생성해 Vercel Blob에 업로드하고, 생성된 URL을 데이터 파일(recipes-qN.ts)에 채워 넣는 스크립트.
 *
 * 실행 방법:
 *   GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-images.ts --recipe=1-1
 *   (전체 60개 실행: --all 플래그, 완성샷만: --hero-only)
 *
 * 안전장치:
 *  - 기본은 1개 레시피(--recipe=ID)만 처리하도록 강제. --all을 명시해야 전체 실행.
 *  - 이미 Blob URL이 들어있는 항목(heroImage가 blob.vercel-storage.com 도메인)은 건너뜀.
 *  - 실행 중간에 에러가 나도 그 시점까지 결과는 파일에 저장됨(매 항목 처리 후 즉시 write).
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
const recipeIdArg = args.find((a) => a.startsWith('--recipe='))?.split('=')[1];
const runAll = args.includes('--all');
const heroOnly = args.includes('--hero-only');

if (!recipeIdArg && !runAll) {
  console.error(
    '안전장치: --recipe=ID 로 1개만 테스트하거나, 전체를 돌리려면 --all 을 명시하세요.\n' +
      '예: npx tsx scripts/generate-images.ts --recipe=1-1'
  );
  process.exit(1);
}

// "시절소담" 사진 톤은 src/lib/persona.ts의 SODAMI_VISUAL_STYLE을 공유합니다.

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

interface RecipeLineInfo {
  id: string;
  title: string;
  mainIngredient: string;
  heroImageLineIndex: number;
  stepLineIndices: { lineIndex: number; title: string; description: string }[];
}

function parseRecipes(lines: string[]): RecipeLineInfo[] {
  const recipes: RecipeLineInfo[] = [];
  let current: Partial<RecipeLineInfo> & { steps: RecipeLineInfo['stepLineIndices'] } = {
    steps: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const idMatch = line.match(/^\s{4}id:\s*'([^']+)'/);
    if (idMatch) {
      if (current.id) {
        recipes.push({
          id: current.id,
          title: current.title || '',
          mainIngredient: current.mainIngredient || '',
          heroImageLineIndex: current.heroImageLineIndex ?? -1,
          stepLineIndices: current.steps,
        });
      }
      current = { id: idMatch[1], steps: [] };
      continue;
    }

    const titleMatch = line.match(/^\s{4}title:\s*'((?:[^'\\]|\\.)*)'/);
    if (titleMatch && current.id && !current.title) {
      current.title = titleMatch[1];
    }

    const mainIngMatch = line.match(/^\s{4}mainIngredient:\s*'((?:[^'\\]|\\.)*)'/);
    if (mainIngMatch) {
      current.mainIngredient = mainIngMatch[1];
    }

    const heroMatch = line.match(/^\s{4}heroImage:\s*'/);
    if (heroMatch) {
      current.heroImageLineIndex = i;
    }

    const stepMatch = line.match(/^\s*\{\s*title:\s*'((?:[^'\\]|\\.)*)'.*description:\s*'((?:[^'\\]|\\.)*)'/);
    if (stepMatch && current.id) {
      current.steps.push({ lineIndex: i, title: stepMatch[1], description: stepMatch[2] });
    }
  }

  if (current.id) {
    recipes.push({
      id: current.id,
      title: current.title || '',
      mainIngredient: current.mainIngredient || '',
      heroImageLineIndex: current.heroImageLineIndex ?? -1,
      stepLineIndices: current.steps,
    });
  }

  return recipes;
}

function replaceStringLiteralOnLine(line: string, fieldName: string, newValue: string): string {
  const regex = new RegExp(`(${fieldName}:\\s*')((?:[^'\\\\]|\\\\.)*)(')`);
  return line.replace(regex, `$1${newValue.replace(/'/g, "\\'")}$3`);
}

function insertStepImageField(line: string, imageUrl: string): string {
  const trimmedEnd = line.trimEnd();
  if (!trimmedEnd.endsWith('},')) return line;
  if (/stepImage:\s*'/.test(line)) return line; // 이미 있으면 건너뜀
  const withoutTrailing = trimmedEnd.slice(0, -2).trimEnd();
  const escaped = imageUrl.replace(/'/g, "\\'");
  return `${withoutTrailing}, stepImage: '${escaped}' },`;
}

async function processFile(fileName: string) {
  const filePath = join(__dirname, '..', 'src', 'data', fileName);
  let lines = readFileSync(filePath, 'utf-8').split('\n');
  const recipes = parseRecipes(lines);

  for (const recipe of recipes) {
    if (recipeIdArg && recipe.id !== recipeIdArg) continue;

    console.log(`\n[${recipe.id}] ${recipe.title}`);

    // 1) 완성샷
    const currentHeroLine = lines[recipe.heroImageLineIndex] || '';
    const heroUrlMatch = currentHeroLine.match(/heroImage:\s*'([^']*)'/);
    const currentHeroUrl = heroUrlMatch?.[1] || '';

    if (!isAlreadyBlobUrl(currentHeroUrl)) {
      console.log('  완성샷 생성 중...');
      try {
        const prompt = `A beautifully plated Korean home-cooked dish: "${recipe.title}", made with ${recipe.mainIngredient}.${SODAMI_VISUAL_STYLE}`;
        const buffer = await generateImageBuffer(prompt);
        if (buffer) {
          const url = await uploadToBlob(buffer, `recipes/${recipe.id}/hero.png`);
          lines[recipe.heroImageLineIndex] = replaceStringLiteralOnLine(
            lines[recipe.heroImageLineIndex],
            'heroImage',
            url
          );
          writeFileSync(filePath, lines.join('\n'), 'utf-8');
          console.log('    완성샷 업로드 완료:', url);
        } else {
          console.warn('    이미지 생성 결과 없음, 건너뜀');
        }
      } catch (err) {
        console.error('    완성샷 생성 에러:', err);
      }
      await new Promise((r) => setTimeout(r, 1500));
    } else {
      console.log('  완성샷 이미 존재, 건너뜀');
    }

    if (heroOnly) continue;

    // 2) 단계별 이미지
    for (const step of recipe.stepLineIndices) {
      const line = lines[step.lineIndex];
      if (/stepImage:\s*'/.test(line)) {
        continue; // 이미 있음
      }
      console.log(`  단계 이미지 생성 중: ${step.title}`);
      try {
        const prompt = `A close-up food photography shot showing this cooking step in progress: "${step.title} - ${step.description}". This is one step while making "${recipe.title}".${SODAMI_VISUAL_STYLE}`;
        const buffer = await generateImageBuffer(prompt);
        if (buffer) {
          const url = await uploadToBlob(
            buffer,
            `recipes/${recipe.id}/step-${step.lineIndex}.png`
          );
          lines[step.lineIndex] = insertStepImageField(lines[step.lineIndex], url);
          writeFileSync(filePath, lines.join('\n'), 'utf-8');
          console.log('    완료:', url);
        } else {
          console.warn('    이미지 생성 결과 없음, 건너뜀');
        }
      } catch (err) {
        console.error('    에러:', err);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

async function main() {
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
  for (const file of files) {
    await processFile(file);
  }
  console.log('\n완료!');
}

main();

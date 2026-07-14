/**
 * 레시피 완성샷 및 단계별 이미지를 Gemini(gemini-2.5-flash-image, 일명 "나노바나나")로
 * 생성해 이미지를 저장하고, 생성된 경로를 데이터 파일(recipes-qN.ts)에 채워 넣는 스크립트.
 *
 * 저장 방식은 두 가지 중 하나가 자동으로 선택됩니다:
 *  - BLOB_READ_WRITE_TOKEN이 있으면: Vercel Blob에 업로드 (기존 방식)
 *  - 없으면: 프로젝트 안 /public/images/recipes/ 폴더에 직접 저장 (Blob 스토리지가
 *    정지되었거나 쓰고 싶지 않을 때의 대안). 이 경우 데이터에는 '/images/recipes/...'
 *    같은 상대 경로가 들어가고, Next.js가 정적 파일로 그대로 서빙합니다.
 *    이렇게 저장한 이미지는 git에 커밋해서 그대로 배포하면 됩니다.
 *
 * 실행 방법:
 *   GEMINI_API_KEY=키 npx tsx scripts/generate-images.ts --recipe=1-1                (완성샷 1개만, 로컬 저장)
 *   GEMINI_API_KEY=키 npx tsx scripts/generate-images.ts --all --limit=10             (아직 없는 완성샷 10개만)
 *   GEMINI_API_KEY=키 npx tsx scripts/generate-images.ts --recipe=abalone-weekend-1 --force  (특정 레시피 완성샷 1개만 강제로 재생성)
 *   GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-images.ts --recipe=1-1  (Blob 저장)
 *   (전체 다 실행: --all 플래그만)
 *
 * 기본값: 완성샷(hero)만 생성합니다. 조리 단계별 사진까지 원하면 --with-steps를 명시하세요.
 *
 * 안전장치:
 *  - 기본은 1개 레시피(--recipe=ID)만 처리하도록 강제. --all을 명시해야 전체 실행.
 *  - 이미 이미지 URL(Blob 또는 로컬 경로)이 들어있는 항목은 건너뜀.
 *  - --force: --recipe=ID와 함께일 때만 동작. 이미 이미지가 있어도 그 1개 레시피만
 *    다시 생성한다(생성된 사진이 요리와 안 맞을 때 다시 만들기 위한 용도). --all과
 *    함께 쓰면 전체를 다 재생성해버릴 위험이 있어 --recipe 없이는 무시된다.
 *  - --limit=N: 아직 이미지가 없는 항목을 N개까지만 새로 생성하고 멈춤. 조금씩 나눠서
 *    생성하고 싶을 때(--all과 함께) 쓴다. 이미 있는 항목을 건너뛰는 것과는 별개로,
 *    "새로 생성한 개수"만 세므로 여러 번 나눠 돌려도 정확히 이어서 진행된다.
 *  - 실행 중간에 에러가 나도 그 시점까지 결과는 파일에 저장됨(매 항목 처리 후 즉시 write).
 */
import { GoogleGenAI } from '@google/genai';
import { put } from '@vercel/blob';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { SODAMI_VISUAL_STYLE } from '../src/lib/persona';

const apiKey = process.env.GEMINI_API_KEY;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
const useLocalStorage = !blobToken;

if (!apiKey) {
  console.error('GEMINI_API_KEY 환경변수가 필요합니다.');
  process.exit(1);
}
if (useLocalStorage) {
  console.log('BLOB_READ_WRITE_TOKEN이 없어 /public/images/recipes/ 폴더에 로컬로 저장합니다.');
}

const ai = new GoogleGenAI({ apiKey });

const args = process.argv.slice(2);
const recipeIdArg = args.find((a) => a.startsWith('--recipe='))?.split('=')[1];
const runAll = args.includes('--all');
const withSteps = args.includes('--with-steps');
const heroOnly = !withSteps; // 기본값: 완성샷만. 단계별 사진까지 원하면 --with-steps 명시
const forceRegenerate = args.includes('--force');
const limitArg = args.find((a) => a.startsWith('--limit='))?.split('=')[1];
const limit = limitArg ? Number(limitArg) : Infinity;
let generatedCount = 0;

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
  if (useLocalStorage) {
    const localPath = join(__dirname, '..', 'public', 'images', pathname);
    mkdirSync(dirname(localPath), { recursive: true });
    writeFileSync(localPath, buffer);
    return `/images/${pathname}`;
  }
  const blob = await put(pathname, buffer, {
    access: 'public',
    contentType: 'image/png',
    addRandomSuffix: false,
    token: blobToken,
  });
  return blob.url;
}

function isAlreadyBlobUrl(url: string): boolean {
  return url.includes('blob.vercel-storage.com') || url.startsWith('/images/recipes/');
}

interface RecipeLineInfo {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  mainIngredient: string;
  cuisineCountry: string;
  platingGuide: string;
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
          subtitle: current.subtitle || '',
          category: current.category || '',
          description: current.description || '',
          mainIngredient: current.mainIngredient || '',
          cuisineCountry: current.cuisineCountry || '',
          platingGuide: current.platingGuide || '',
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

    const subtitleMatch = line.match(/subtitle:\s*'((?:[^'\\]|\\.)*)'/);
    if (subtitleMatch && current.id && !current.subtitle) {
      current.subtitle = subtitleMatch[1];
    }

    const categoryMatch = line.match(/category:\s*'((?:[^'\\]|\\.)*)'/);
    if (categoryMatch && current.id && !current.category) {
      current.category = categoryMatch[1];
    }

    const descriptionMatch = line.match(/^\s{4}description:\s*'((?:[^'\\]|\\.)*)'/);
    if (descriptionMatch && current.id && !current.description) {
      current.description = descriptionMatch[1];
    }

    const mainIngMatch = line.match(/^\s{4}mainIngredient:\s*'((?:[^'\\]|\\.)*)'/);
    if (mainIngMatch) {
      current.mainIngredient = mainIngMatch[1];
    }

    // cuisineContext: { country: '일본', note: '...' } — country만 뽑아온다
    const countryMatch = line.match(/cuisineContext:\s*\{\s*country:\s*'((?:[^'\\]|\\.)*)'/);
    if (countryMatch && current.id && !current.cuisineCountry) {
      current.cuisineCountry = countryMatch[1];
    }

    const platingMatch = line.match(/^\s{4}platingGuide:\s*'((?:[^'\\]|\\.)*)'/);
    if (platingMatch && current.id && !current.platingGuide) {
      current.platingGuide = platingMatch[1];
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
      subtitle: current.subtitle || '',
      category: current.category || '',
      description: current.description || '',
      mainIngredient: current.mainIngredient || '',
      cuisineCountry: current.cuisineCountry || '',
      platingGuide: current.platingGuide || '',
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
    if (generatedCount >= limit) break; // --limit에 도달하면 이 파일에서도 더 진행하지 않음

    console.log(`\n[${recipe.id}] ${recipe.title}`);

    // 1) 완성샷
    const currentHeroLine = lines[recipe.heroImageLineIndex] || '';
    const heroUrlMatch = currentHeroLine.match(/heroImage:\s*'([^']*)'/);
    const currentHeroUrl = heroUrlMatch?.[1] || '';

    const shouldForceThisOne = forceRegenerate && recipeIdArg === recipe.id;
    if (!isAlreadyBlobUrl(currentHeroUrl) || shouldForceThisOne) {
      console.log('  완성샷 생성 중...');
      try {
        const cuisineLine = recipe.cuisineCountry
          ? `This is an authentic ${recipe.cuisineCountry} dish — render it exactly the way it is actually served in ${recipe.cuisineCountry}, with the correct traditional plates, garnishes, and presentation style for that cuisine, not a Korean-style interpretation.`
          : `This is a home-style dish — render it in a natural, everyday plating style appropriate to what this specific dish actually is.`;
        const platingLine = recipe.platingGuide
          ? ` Exact plating to follow: ${recipe.platingGuide}`
          : '';
        const prompt = `A food photograph of a real, correctly-made dish called "${recipe.title}"${recipe.subtitle ? ` (${recipe.subtitle})` : ''}, a ${recipe.category} made with ${recipe.mainIngredient} as the main ingredient. What this dish actually is: ${recipe.description} ${cuisineLine}${platingLine} This may be an unfamiliar or unusual dish — research your knowledge of what it truly looks like rather than guessing from the name alone, and never substitute a different, more generic-looking dish.${SODAMI_VISUAL_STYLE}`;
        const buffer = await generateImageBuffer(prompt);
        if (buffer) {
          const url = await uploadToBlob(buffer, `recipes/${recipe.id}/hero.png`);
          lines[recipe.heroImageLineIndex] = replaceStringLiteralOnLine(
            lines[recipe.heroImageLineIndex],
            'heroImage',
            url
          );
          writeFileSync(filePath, lines.join('\n'), 'utf-8');
          generatedCount += 1;
          console.log(`    완성샷 업로드 완료(${generatedCount}/${limit === Infinity ? '∞' : limit}):`, url);
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
    if (generatedCount >= limit) break;

    // 2) 단계별 이미지
    for (const step of recipe.stepLineIndices) {
      if (generatedCount >= limit) break;
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
          generatedCount += 1;
          console.log(`    완료(${generatedCount}/${limit === Infinity ? '∞' : limit}):`, url);
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
  const dataDir = join(__dirname, '..', 'src', 'data');
  const files = readdirSync(dataDir).filter(
    (f) => f.startsWith('recipes-') && f.endsWith('.ts')
  );
  console.log(`대상 파일 ${files.length}개 발견`);
  for (const file of files) {
    if (generatedCount >= limit) break;
    await processFile(file);
  }
  console.log(`\n완료! 이번 실행에서 새로 생성한 이미지: ${generatedCount}개`);
}

main();

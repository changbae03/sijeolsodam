import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRecipeById, allRecipes } from '@/data/recipes';
import RecipeHero from '@/components/RecipeHero';
import RecipeBody from '@/components/RecipeBody';
import CookingCoach from '@/components/CookingCoach';
import CookedButton from '@/components/CookedButton';
import RecipeShareButton from '@/components/RecipeShareButton';
import RecipeViewLogger from '@/components/RecipeViewLogger';
import { CurrentStepProvider } from '@/lib/current-step-context';

export function generateStaticParams() {
  return allRecipes.map((r) => ({ id: r.id }));
}

/**
 * 링크 미리보기 — 공유 메시지에 요리 사진과 제목이 함께 뜨도록.
 * heroImage가 상대 경로(/images/...)일 수 있어 절대 주소로 바꿔준다.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) return {};

  const description = recipe.subtitle || `${recipe.cookTime}분 · ${recipe.difficulty} · 시절소담`;

  // og:image는 같은 폴더의 opengraph-image.tsx가 PNG로 생성한다.
  // (요리 사진은 WebP라 카카오톡 크롤러가 렌더하지 못해 빈 썸네일이 떴다)
  return {
    title: `${recipe.title} — 시절소담`,
    description,
    openGraph: {
      type: 'article',
      siteName: '시절소담',
      title: recipe.title,
      description,
      locale: 'ko_KR',
    },
    twitter: { card: 'summary_large_image', title: recipe.title, description },
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);

  if (!recipe) notFound();

  return (
    <CurrentStepProvider initialServings={recipe.servings}>
      <main className="max-w-md mx-auto">
        <RecipeViewLogger recipeId={recipe.id} mainIngredient={recipe.mainIngredient} />
        <RecipeHero heroImage={recipe.heroImage} title={recipe.title} recipeId={recipe.id} />
        <RecipeBody recipe={recipe} />

        {/* 요리를 다 본 지점 = 커뮤니티 진입의 최적 시점 */}
        <div className="px-5 pb-28 pt-2 space-y-2.5">
          <CookedButton recipeId={recipe.id} title={recipe.title} />
          <RecipeShareButton recipeId={recipe.id} title={recipe.title} />
        </div>

        <CookingCoach recipeId={recipe.id} totalSteps={recipe.steps.length} />
      </main>
    </CurrentStepProvider>
  );
}

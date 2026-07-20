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

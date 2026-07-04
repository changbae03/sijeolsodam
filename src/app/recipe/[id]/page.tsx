import { notFound } from 'next/navigation';
import { getRecipeById, allRecipes } from '@/data/recipes';
import RecipeHero from '@/components/RecipeHero';
import RecipeBody from '@/components/RecipeBody';
import CookingCoach from '@/components/CookingCoach';
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
        <CookingCoach recipeId={recipe.id} totalSteps={recipe.steps.length} />
      </main>
    </CurrentStepProvider>
  );
}

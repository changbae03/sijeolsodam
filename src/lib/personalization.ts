import { sql } from '@/lib/db';
import { getRecipeById } from '@/data/recipes';

/**
 * 즐겨찾기(가중치 2) + 최근 본 레시피(가중치 1) + 소담이에게 물어본 기록(가중치 1)을
 * 합산해서, 이 유저가 요즘 가장 관심 있어 하는 재료 하나를 추정한다.
 * 세 가지 실제 데이터를 모두 반영하므로, 사용할수록 추천이 더 정확해진다.
 */
export async function getUserTopIngredient(userId: number): Promise<string | null> {
  try {
    const [favoriteRows, viewRows, agentRows] = await Promise.all([
      sql`SELECT recipe_id FROM favorites WHERE user_id = ${userId}`,
      sql`SELECT main_ingredient FROM recipe_views WHERE user_id = ${userId} AND main_ingredient IS NOT NULL ORDER BY created_at DESC LIMIT 30`,
      sql`SELECT matched_ingredient FROM agent_queries WHERE user_id = ${userId} AND matched_ingredient IS NOT NULL ORDER BY created_at DESC LIMIT 30`,
    ]);

    const counts = new Map<string, number>();
    for (const row of favoriteRows) {
      const recipe = getRecipeById(row.recipe_id as string);
      if (recipe) counts.set(recipe.mainIngredient, (counts.get(recipe.mainIngredient) ?? 0) + 2);
    }
    for (const row of viewRows) {
      const ingredient = row.main_ingredient as string;
      counts.set(ingredient, (counts.get(ingredient) ?? 0) + 1);
    }
    for (const row of agentRows) {
      const ingredient = row.matched_ingredient as string;
      counts.set(ingredient, (counts.get(ingredient) ?? 0) + 1);
    }

    let top: string | null = null;
    let topCount = 0;
    for (const [ingredient, count] of counts) {
      if (count > topCount) {
        top = ingredient;
        topCount = count;
      }
    }
    return top;
  } catch (error) {
    console.error('getUserTopIngredient error:', error);
    return null;
  }
}

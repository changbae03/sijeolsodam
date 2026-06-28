import { Recipe } from './types';
import { recipesQ1 } from './recipes-q1';
import { recipesQ2 } from './recipes-q2';
import { recipesQ3 } from './recipes-q3';
import { recipesQ1Extra } from './recipes-q1-extra';
import { recipesQ2Extra } from './recipes-q2-extra';
import { recipesQ3Extra } from './recipes-q3-extra';
import { recipesQ1Extra2 } from './recipes-q1-extra2';
import { recipesQ2Extra2 } from './recipes-q2-extra2';
import { recipesQ3Extra2 } from './recipes-q3-extra2';
import { recipesIngredientCoverage } from './recipes-ingredient-coverage';
import { recipesLevelExpansion2 } from './recipes-level-expansion-2';
import { recipesLevelExpansion3 } from './recipes-level-expansion-3';
import { recipesPotatoExpansion } from './recipes-potato-expansion';
import { recipesPotatoExpansion2 } from './recipes-potato-expansion-2';
import { recipesAppleExpansion } from './recipes-apple-expansion';
import { recipesRadishTomatoExpansion } from './recipes-radish-tomato-expansion';
import { recipesCabbageCucumberExpansion } from './recipes-cabbage-cucumber-expansion';
import { recipesPearExpansion } from './recipes-pear-expansion';
import { recipesSweetpotatoStrawberryExpansion } from './recipes-sweetpotato-strawberry-expansion';
import { recipesAppleRadishBoost } from './recipes-apple-radish-boost';
import { recipesTomatoCabbageCucumberBoost } from './recipes-tomato-cabbage-cucumber-boost';
import { recipesEggplantExpansion } from './recipes-eggplant-expansion';
import { recipesSpinachExpansion } from './recipes-spinach-expansion';
import { recipesBeansproutExpansion } from './recipes-beansprout-expansion';

export const allRecipes: Recipe[] = [
  ...recipesQ1,
  ...recipesQ2,
  ...recipesQ3,
  ...recipesQ1Extra,
  ...recipesQ2Extra,
  ...recipesQ3Extra,
  ...recipesQ1Extra2,
  ...recipesQ2Extra2,
  ...recipesQ3Extra2,
  ...recipesIngredientCoverage,
  ...recipesLevelExpansion2,
  ...recipesLevelExpansion3,
  ...recipesPotatoExpansion,
  ...recipesPotatoExpansion2,
  ...recipesAppleExpansion,
  ...recipesRadishTomatoExpansion,
  ...recipesCabbageCucumberExpansion,
  ...recipesPearExpansion,
  ...recipesSweetpotatoStrawberryExpansion,
  ...recipesAppleRadishBoost,
  ...recipesTomatoCabbageCucumberBoost,
  ...recipesEggplantExpansion,
  ...recipesSpinachExpansion,
  ...recipesBeansproutExpansion,
];

export function getRecipeById(id: string): Recipe | undefined {
  return allRecipes.find((r) => r.id === id);
}

export function getRecipesByMonth(month: number): Recipe[] {
  return allRecipes.filter((r) => r.month === month);
}

export function getRecipesByIds(ids: string[]): Recipe[] {
  return ids
    .map((id) => getRecipeById(id))
    .filter((r): r is Recipe => r !== undefined);
}

export function searchRecipes(query: string): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allRecipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.mainIngredient.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  );
}

/**
 * 식재료 이름(예: "감자", "햇감자")으로 그 재료를 주재료로 쓰는 레시피를 모두 찾음.
 * 양방향 부분일치 (레시피의 mainIngredient에 입력명이 포함되거나, 입력명에 mainIngredient가 포함).
 */
export function getRecipesByIngredient(ingredientName: string): Recipe[] {
  const normalized = ingredientName.trim();
  if (!normalized) return [];
  // 접미사 매칭만 허용: "알배추"는 "배추"와 매칭되지만(끝이 같음),
  // "배"는 "알배추"에 글자가 포함되어도 끝이 다르므로 매칭되지 않음.
  // 단순 includes()는 "배"가 "알배추" 안에 글자로 들어있다는 이유로
  // 잘못 매칭시키는 버그가 있었음(예: 알배추 페이지에 배 샐러드가 노출).
  return allRecipes.filter(
    (r) =>
      r.mainIngredient === normalized ||
      r.mainIngredient.endsWith(normalized) ||
      normalized.endsWith(r.mainIngredient)
  );
}

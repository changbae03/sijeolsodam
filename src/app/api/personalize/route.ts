import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { getRecipeById, getRecipesByIngredient } from '@/data/recipes';
import { getCurrentMonthData } from '@/lib/season';

function pickTodaySeasonalIngredient() {
  const monthData = getCurrentMonthData();
  if (!monthData || monthData.ingredients.length === 0) return null;
  // 날짜 기준으로 하루에 하나씩 살짝 바뀌도록(매일 같은 것만 나오지 않게) 날짜로 인덱스를 정함
  const dayIndex = new Date().getDate() % monthData.ingredients.length;
  return monthData.ingredients[dayIndex];
}

function greetingByHour() {
  const hour = new Date().getHours();
  if (hour < 11) return '좋은 아침이에요';
  if (hour < 17) return '오늘 점심은 드셨어요';
  if (hour < 21) return '저녁 시간이 다가와요';
  return '하루를 마무리하는 시간이네요';
}

export async function GET(request: NextRequest) {
  const todayIngredient = pickTodaySeasonalIngredient();
  const user = getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({
      loggedIn: false,
      greeting: greetingByHour(),
      todayIngredient,
      topIngredient: null,
      recommendedRecipe: null,
    });
  }

  try {
    // 즐겨찾기 + 최근 조회 기록을 합쳐서 이 유저가 어떤 재료에 관심이 많은지 추정
    const favoriteRows = await sql`
      SELECT recipe_id FROM favorites WHERE user_id = ${user.userId}
    `;
    const viewRows = await sql`
      SELECT main_ingredient FROM recipe_views
      WHERE user_id = ${user.userId} AND main_ingredient IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 30
    `;

    const ingredientCounts = new Map<string, number>();
    for (const row of favoriteRows) {
      const recipe = getRecipeById(row.recipe_id as string);
      if (recipe) {
        ingredientCounts.set(
          recipe.mainIngredient,
          (ingredientCounts.get(recipe.mainIngredient) ?? 0) + 2 // 즐겨찾기는 더 강한 신호로 가중치 2배
        );
      }
    }
    for (const row of viewRows) {
      const ingredient = row.main_ingredient as string;
      ingredientCounts.set(ingredient, (ingredientCounts.get(ingredient) ?? 0) + 1);
    }

    let topIngredient: string | null = null;
    let topCount = 0;
    for (const [ingredient, count] of ingredientCounts) {
      if (count > topCount) {
        topIngredient = ingredient;
        topCount = count;
      }
    }

    const favoritedIds = new Set(favoriteRows.map((r) => r.recipe_id as string));
    let recommendedRecipe = null;
    if (topIngredient) {
      const candidates = getRecipesByIngredient(topIngredient).filter((r) => !favoritedIds.has(r.id));
      if (candidates.length > 0) {
        const recipe = candidates[Math.floor(Math.random() * candidates.length)];
        recommendedRecipe = { id: recipe.id, title: recipe.title, heroImage: recipe.heroImage };
      }
    }

    return NextResponse.json({
      loggedIn: true,
      greeting: greetingByHour(),
      todayIngredient,
      topIngredient,
      recommendedRecipe,
    });
  } catch (error) {
    console.error('Personalize error:', error);
    return NextResponse.json({
      loggedIn: true,
      greeting: greetingByHour(),
      todayIngredient,
      topIngredient: null,
      recommendedRecipe: null,
    });
  }
}

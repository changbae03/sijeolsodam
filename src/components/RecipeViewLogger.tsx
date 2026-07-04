'use client';

import { useEffect } from 'react';

/**
 * 화면에는 아무것도 그리지 않고, 레시피 상세 페이지가 열릴 때 조회 기록만 조용히 남긴다.
 * 로그인 안 한 방문자는 서버에서 자동으로 무시되므로 여기서 따로 분기하지 않는다.
 */
export default function RecipeViewLogger({
  recipeId,
  mainIngredient,
}: {
  recipeId: string;
  mainIngredient: string;
}) {
  useEffect(() => {
    fetch('/api/recipe-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId, mainIngredient }),
    }).catch(() => {
      // 조회 기록은 부가 기능이라 실패해도 무시
    });
  }, [recipeId, mainIngredient]);

  return null;
}

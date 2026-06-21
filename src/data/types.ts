export interface Ingredient {
  name: string;
  amount: string;
}

export interface RecipeStep {
  title: string;
  description: string;
  tip?: string;
  timerSeconds?: number;
  /** 이 단계가 끝났을 때 확인할 수 있는 상태 (AI 코칭 멘트, 선택적) */
  checkpoint?: string;
  /** 이 단계를 보여주는 AI 생성 이미지 URL (선택적) */
  stepImage?: string;
}

export interface Recipe {
  id: string;
  month: number;
  title: string;
  subtitle: string;
  category: string;
  difficulty: '아주 쉬움' | '쉬움' | '보통';
  cookTime: number; // 분
  servings: number;
  heroImage: string;
  mainIngredient: string;
  description: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tips: string[];
  youtubeQuery: string;
}

export type IngredientCategory = '채소' | '과일' | '해산물' | '기타';

export interface SeasonalIngredient {
  name: string;
  emoji: string;
  description: string;
  /** 분류 (채소/과일/생선/해산물/기타) */
  category: IngredientCategory;
  /** 영양 성분이나 효능 (선택적, 상세 보기에 표시) */
  nutrition?: string;
  /** 신선한 것을 고르는 방법 (선택적) */
  howToChoose?: string;
  /** 손질이나 보관 시 알아두면 좋은 팁 (선택적) */
  tip?: string;
  /** 잘 어울리는 조리법이나 양념 (선택적) */
  goesWellWith?: string;
  /** 대표 산지 (선택적, 예: "제주", "경남 고성") */
  origin?: string;
  /** Pinterest 스타일 카드에 쓰는 실제 사진 URL (선택적) */
  imageUrl?: string;
}

export interface MonthData {
  month: number;
  season: string;
  solarTerm: string; // 24절기
  headline: string;
  description: string;
  ingredients: SeasonalIngredient[];
  recipeIds: string[];
  /** 홈 화면 배너 전용 대표 사진 (없으면 레시피 완성샷으로 대체) */
  bannerImage?: string;
}

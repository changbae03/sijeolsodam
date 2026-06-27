export interface Ingredient {
  name: string;
  amount: string;
}

export interface RecipeStep {
  title: string;
  description: string;
  tip?: string;
  timerSeconds?: number;
  /** 이 단계가 끝났을 때 확인할 수 있는 상태 (감각적 신호: 색/냄새/소리/질감, 선택적) */
  checkpoint?: string;
  /** 초보자가 이 단계에서 흔히 저지르는 실수에 대한 경고 (선택적) */
  warning?: string;
  /** 그 실수를 이미 했을 때 되돌리거나 만회하는 방법 (선택적) */
  recoveryTip?: string;
  /** 이 단계를 보여주는 AI 생성 이미지 URL (선택적) */
  stepImage?: string;
}

export type RecipeLevel = 'home' | 'weekend' | 'world' | 'chef';

/**
 * "마스터클래스 레시피" — 최고 품질의 요리 가이드.
 * 레시피 개수보다 가이드의 깊이를 우선한다는 원칙 아래, 일부 선별된 레시피에만 적용.
 */
export interface MasterclassContent {
  /** 셰프의 소개 — 왜 지금 이 제철 식재료에 이 요리가 가장 잘 맞는지 */
  chefIntro: string;
  /** 좋은 재료를 고르는 법 (일반적인 "고르는 법"보다 이 요리에 특화된 기준) */
  ingredientSelection: string;
  /** 손질/사전 준비(미즈 앙 플라스) 가이드 */
  miseEnPlace: string;
  /** 추천 조리도구와 대체 가능한 도구 */
  cookware: { recommended: string; alternatives: string[] };
  /** 펼쳐보는 "셰프의 노트" — 고급 기법이나 조리 과학 설명 (선택적) */
  chefsNotes?: string;
  /** 플레이팅과 서빙 제안 */
  platingAndServing: string;
  /** 곁들이면 좋은 음료/사이드 추천 */
  pairing: string;
  /** 보관 및 재가열 방법 */
  storageAndReheating: string;
  /** 남았을 때 활용 아이디어 */
  leftoverIdeas: string;
  /** 셰프의 마무리 한 마디 */
  closingNote: string;
}

export interface Recipe {
  id: string;
  month: number;
  title: string;
  subtitle: string;
  category: string;
  difficulty: '아주 쉬움' | '쉬움' | '보통';
  /** 4단계 난이도 컬렉션: home(데일리 홈쿡) -> weekend(주말 요리) -> world(세계 요리) -> chef(셰프 컬렉션) */
  level: RecipeLevel;
  /** world 레벨일 때, 어느 나라/지역 요리인지와 그 배경 설명 (선택적) */
  cuisineContext?: { country: string; note: string };
  /** chef 레벨일 때, 플레이팅 가이드(선택적) — masterclass가 있으면 그 안의 platingAndServing이 우선됨 */
  platingGuide?: string;
  /** 마스터클래스급 콘텐츠 (선택적 — 선별된 레시피에만 작성) */
  masterclass?: MasterclassContent;
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

export type IngredientCategory = '채소' | '과일' | '해산물' | '버섯' | '곡물' | '기타';

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

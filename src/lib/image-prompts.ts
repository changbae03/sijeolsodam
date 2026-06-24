import { SeasonalIngredient } from '@/data/types';

/**
 * 식재료 AI 이미지 생성 프롬프트 빌더
 *
 * 공유받은 "햇감자 AI 이미지 생성 가이드"의 구조를 그대로 코드화했습니다.
 * 모든 식재료 사진이 같은 톤(자연광/아이보리 리넨/45도 상단 앵글)으로
 * 나오도록, 식재료 이름만 넣으면 가이드와 동일한 형식의 프롬프트가 나옵니다.
 *
 * 사용법:
 *   import { buildIngredientImagePrompt } from '@/lib/image-prompts';
 *   const { positive, negative } = buildIngredientImagePrompt(ingredient, 0);
 */

export interface IngredientImagePrompt {
  /** 그대로 이미지 생성 도구에 붙여넣을 긍정 프롬프트 */
  positive: string;
  /** 네거티브 프롬프트 (제외할 요소) */
  negative: string;
  /** 어떤 연출 변주를 썼는지 (참고용) */
  variant: string;
}

const NEGATIVE_PROMPT =
  'text, logo, watermark, packaging, plastic, metal, dark background, ' +
  'overexposed, artificial light, cooked, fried, grilled, too many props, ' +
  'cluttered, cropped, blurry, low quality, cartoon, 3d render';

/** 채소·과일류 — 가이드의 "다양한 연출 예시" 4종 */
const PRODUCE_VARIANTS = [
  { label: '바구니 + 리넨 연출', composition: '나무 바구니에 소복이 담긴 모습, 옆에 부드러운 리넨 천' },
  { label: '나무 볼 연출', composition: '나무 볼(wooden bowl)에 담긴 모습, 위에서 내려다보는 구도' },
  { label: '자른 단면 연출', composition: '하나는 반으로 잘라 단면이 보이게, 나머지는 온전한 모습으로 함께 배치' },
  { label: '허브 포인트 연출', composition: '바구니에 담긴 모습, 옆에 허브 잎을 살짝 곁들여 포인트' },
];

/** 해산물류 — 식재료 특성에 맞춘 연출 (바구니 대신 도마/얼음/신문지) */
const SEAFOOD_VARIANTS = [
  { label: '나무 도마 연출', composition: '나무 도마 위에 자연스럽게 놓인 모습, 옆에 허브 잎' },
  { label: '얼음 위 연출', composition: '잘게 부순 얼음 위에 신선하게 놓인 모습, 위에서 내려다보는 구도' },
  { label: '리넨 위 연출', composition: '아이보리 리넨 천 위에 가지런히 놓인 모습' },
  { label: '나무 트레이 연출', composition: '나무 트레이에 담긴 모습, 옆에 레몬 한 조각으로 포인트' },
];

function getVariants(category: SeasonalIngredient['category']) {
  return category === '해산물' ? SEAFOOD_VARIANTS : PRODUCE_VARIANTS;
}

/**
 * 식재료와 변주 인덱스(0~3)를 받아 가이드 구조 그대로의 프롬프트를 생성합니다.
 * index를 안 주면 이름 기반으로 자동 분배되어, 같은 카테고리 안에서도 골고루 섞입니다.
 */
export function buildIngredientImagePrompt(
  ingredient: SeasonalIngredient,
  index?: number
): IngredientImagePrompt {
  const variants = getVariants(ingredient.category);
  const seed =
    index ?? ingredient.name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const variant = variants[seed % variants.length];

  const positive = [
    `신선한 ${ingredient.name}를 ${variant.composition}`,
    '45도 상단 앵글, 안정적인 구도',
    '배경: 아이보리 리넨 또는 라이트 우드 테이블',
    '조명: 자연광(창가 빛), 부드러운 그림자',
    '분위기: 따뜻하고 미니멀한 분위기, 채도 낮은 톤',
    '품질: 고해상도, 사진 품질(photo-realistic)',
  ].join(', ');

  return { positive, negative: NEGATIVE_PROMPT, variant: variant.label };
}

/** 여러 식재료에 대해 한 번에 프롬프트를 생성 (배치 작업용) */
export function buildIngredientImagePrompts(
  ingredients: SeasonalIngredient[]
): (IngredientImagePrompt & { name: string })[] {
  return ingredients.map((ing, i) => ({
    name: ing.name,
    ...buildIngredientImagePrompt(ing, i),
  }));
}

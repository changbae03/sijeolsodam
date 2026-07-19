import { Recipe } from './types';

// 9~12월 추가 레시피 20개 (각 월 11~15번)
export const recipesQ3Extra2: Recipe[] = [
  // ===== 9월 =====
  // ===== 10월 =====
  {
    id: '10-11', month: 10, title: '단호박라떼', subtitle: '부드럽고 따뜻한 가을철 음료',
    category: '음료', difficulty: '쉬움', level: 'home', cookTime: 25, servings: 2,
    heroImage: '/images/recipes/10-11/hero.webp',
    mainIngredient: '단호박',
    description: '달콤하고 부드러운 단호박을 우유와 함께 끓여낸, 따뜻한 가을철 음료예요.',
    masterclass: {
      chefIntro: '단호박라떼는 진한 단맛과 부드러운 질감이 매력적인 가을 대표 음료예요.',
      ingredientSelection: '단호박은 껍질이 단단하고 묵직한 것을 고르세요.',
      miseEnPlace: '단호박은 씨를 제거해 준비하세요.',
      cookware: { recommended: '찜기, 블렌더', alternatives: ['전자레인지로 쪄도 좋아요.'] },
      chefsNotes: '단호박을 완전히 부드럽게 쪄야 곱게 갈려요.',
      platingAndServing: '따뜻하게 담아 시나몬가루를 뿌리세요.',
      pairing: '생크림을 올리면 더 고급스러운 맛을 즐길 수 있어요.',
      storageAndReheating: '냉장 1~2일, 약불로 데우세요.',
      leftoverIdeas: '차갑게 마시고 싶다면 얼음을 넣어도 좋아요.',
      closingNote: '단호박을 완전히 찌는 것이 이 라떼의 부드러움을 결정해요.',
    },
    ingredients: [
      { name: '단호박', amount: '1/2개' }, { name: '우유', amount: '2컵' }, { name: '꿀', amount: '2큰술' }, { name: '시나몬가루', amount: '약간' },
    ],
    steps: [
      { title: '단호박 손질', description: '단호박은 씨를 제거하고 찜기에 부드럽게 찝니다.', timerSeconds: 900 },
      { title: '갈기', description: '찐 단호박과 우유를 블렌더에 곱게 갑니다.' },
      { title: '완성', description: '냄비에 옮겨 약불로 데우다가 꿀을 넣고 시나몬가루를 뿌려 완성합니다.', timerSeconds: 300 },
    ],
    tips: ['대체 재료: 차갑게 마시고 싶다면 얼음을 넣어도 좋아요.', '보관/활용: 냉장 1~2일 이내로 드세요.'],
    youtubeQuery: '단호박라떼 만들기',
  },
  {
    id: '10-15', month: 10, title: '단호박죽', subtitle: '부드럽고 든든한 가을철 보양 죽',
    category: '죽', difficulty: '쉬움', level: 'home', cookTime: 35, servings: 2,
    heroImage: '/images/recipes/10-15/hero.webp',
    mainIngredient: '단호박',
    description: '부드러운 단호박을 푹 끓여낸, 따뜻하고 든든한 가을철 보양 죽이에요.',
    masterclass: {
      chefIntro: '단호박죽은 부드럽게 넘어가는 식감과 자연스러운 단맛이 매력적인 보양식이에요.',
      ingredientSelection: '단호박은 묵직하고 단단한 것을 고르세요.',
      miseEnPlace: '쌀은 씻어서 30분간 불려 준비하세요.',
      cookware: { recommended: '찜기, 냄비', alternatives: ['압력솥으로도 만들 수 있어요.'] },
      chefsNotes: '믹서로 곱게 갈면 더 부드러운 죽이 돼요.',
      platingAndServing: '그릇에 담아 따뜻하게 서빙하세요.',
      pairing: '단호박씨를 볶아 토핑으로 올리면 고소함이 더해져요.',
      storageAndReheating: '냉장 1~2일, 물을 더해 데우세요.',
      leftoverIdeas: '남으면 다음날 아침 대용으로 먹기 좋아요.',
      closingNote: '단호박을 완전히 찌는 것이 이 죽의 부드러움을 결정해요.',
    },
    ingredients: [
      { name: '단호박', amount: '1/2개' }, { name: '쌀', amount: '1/2컵' }, { name: '물', amount: '4컵' }, { name: '찹쌀가루', amount: '2큰술' },
    ],
    steps: [
      { title: '단호박 손질', description: '단호박은 씨를 제거하고 부드럽게 찝니다.', timerSeconds: 900 },
      { title: '쌀 불리기', description: '쌀은 씻어서 30분간 불립니다.', timerSeconds: 1800 },
      { title: '끓이기', description: '찐 단호박과 불린 쌀, 물을 넣고 20분간 푹 끓입니다.', timerSeconds: 1200 },
      { title: '완성', description: '찹쌀가루를 풀어 농도를 맞추고 소금으로 간해 완성합니다.' },
    ],
    tips: ['대체 재료: 믹서로 곱게 갈면 더 부드러워요.', '보관/활용: 냉장 1~2일 이내로 드세요.'],
    youtubeQuery: '단호박죽 만들기',
  },

  // ===== 11월 =====
  {
    id: '11-11', month: 11, title: '시래기된장국', subtitle: '깊은 맛이 우러난 겨울 초입 보양 국',
    category: '국&찌개', difficulty: '쉬움', level: 'home', cookTime: 30, servings: 2,
    heroImage: '/images/recipes/11-11/hero.webp',
    mainIngredient: '시래기',
    description: '말린 시래기를 푹 삶아 끓인, 깊은 맛으로 속을 든든하게 채워주는 구수한 된장국이에요.',
    masterclass: {
      chefIntro: '시래기된장국은 구수한 된장과 부드럽게 삶은 시래기가 만나는 겨울철 보양 국이에요.',
      ingredientSelection: '시래기는 이미 삶아진 것을 준비하면 편해요.',
      miseEnPlace: '시래기는 먹기 좋은 크기로 잘라 준비하세요.',
      cookware: { recommended: '냄비', alternatives: ['뚝배기로 끓이면 더 오래 따뜻해요.'] },
      chefsNotes: '시래기는 오래 끓일수록 부드럽고 깊은 맛이 나요.',
      platingAndServing: '그릇에 담아 뜨겁게 서빙하세요.',
      pairing: '소고기를 넣으면 더 든든한 국이 돼요.',
      storageAndReheating: '냉장 1~2일, 데워서 드세요.',
      leftoverIdeas: '남으면 밥을 말아 먹어도 좋아요.',
      closingNote: '오래 끓이는 것이 이 국의 깊은 맛을 결정해요.',
    },
    ingredients: [
      { name: '삶은시래기', amount: '200g' }, { name: '된장', amount: '2큰술' }, { name: '들깨가루', amount: '2큰술' }, { name: '다진마늘', amount: '1작은술' }, { name: '멸치육수', amount: '4컵' },
    ],
    steps: [
      { title: '시래기 손질', description: '삶은 시래기는 먹기 좋은 크기로 자릅니다.' },
      { title: '끓이기', description: '멸치육수에 된장을 풀어 끓이다가 시래기와 다진마늘을 넣고 15분간 끓입니다.', timerSeconds: 900 },
      { title: '완성', description: '들깨가루를 넣고 한 번 더 끓여 완성합니다.' },
    ],
    tips: ['대체 재료: 소고기를 넣으면 더 든든해져요.', '보관/활용: 냉장 1~2일 이내로 드세요.'],
    youtubeQuery: '시래기된장국 만들기',
  },
  {
    id: '11-14', month: 11, title: '시래기나물밥', subtitle: '구수한 시래기를 듬뿍 올린 영양밥',
    category: '밥', difficulty: '쉬움', level: 'home', cookTime: 40, servings: 2,
    heroImage: '/images/recipes/11-14/hero.webp',
    mainIngredient: '시래기',
    description: '구수한 시래기를 양념해 밥에 올려 비벼 먹는, 든든한 겨울철 한 끼예요.',
    masterclass: {
      chefIntro: '시래기나물밥은 양념한 시래기를 밥과 함께 지어 향이 밥알에 배어드는 영양밥이에요.',
      ingredientSelection: '시래기는 이미 삶아진 것을 준비하면 편해요.',
      miseEnPlace: '시래기는 들기름 양념에 미리 버무려 준비하세요.',
      cookware: { recommended: '팬, 밥솥', alternatives: ['따로 대체 도구는 없어요.'] },
      chefsNotes: '들기름을 충분히 넣어야 고소한 향이 살아나요.',
      platingAndServing: '그릇에 담아 완성하세요.',
      pairing: '양념장을 따로 만들어 비벼 먹으면 더 깊은 맛을 즐길 수 있어요.',
      storageAndReheating: '냉장 1~2일, 전자레인지로 데우세요.',
      leftoverIdeas: '남으면 볶음밥으로 활용해도 좋아요.',
      closingNote: '들기름의 양이 이 밥의 고소함을 결정해요.',
    },
    ingredients: [
      { name: '쌀', amount: '1컵' }, { name: '삶은시래기', amount: '150g' }, { name: '들기름', amount: '2큰술' }, { name: '국간장', amount: '1큰술' }, { name: '다진마늘', amount: '1작은술' },
    ],
    steps: [
      { title: '시래기 양념', description: '시래기는 들기름, 국간장, 다진마늘로 양념합니다.' },
      { title: '볶기', description: '팬에 양념한 시래기를 5분간 볶습니다.', timerSeconds: 300 },
      { title: '완성', description: '쌀을 씻어 밥솥에 안치고 볶은 시래기를 올려 밥을 지어 완성합니다.', timerSeconds: 1800 },
    ],
    tips: ['대체 재료: 양념장을 따로 만들어 비벼 먹으면 더 깊은 맛이 나요.', '보관/활용: 냉장 1~2일 이내로 드세요.'],
    youtubeQuery: '시래기나물밥 만들기',
  },

  // ===== 12월 =====
  {
    id: '12-13', month: 12, title: '곶감샐러드', subtitle: '농축된 단맛이 매력인 겨울 별미 샐러드',
    category: '샐러드', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 2,
    heroImage: '/images/recipes/12-13/hero.webp',
    mainIngredient: '곶감',
    description: '말려서 단맛이 농축된 곶감을 채소와 함께 즐기는, 색다른 겨울철 샐러드예요.',
    masterclass: {
      chefIntro: '곶감샐러드는 농축된 단맛의 곶감과 신선한 채소가 만나는 의외의 조합이에요.',
      ingredientSelection: '곶감은 말랑하고 겉면에 하얀 분이 살짝 앉은 것을 고르세요.',
      miseEnPlace: '곶감은 씨를 제거하고 먹기 좋게 썰어 준비하세요.',
      cookware: { recommended: '볼', alternatives: ['따로 조리도구가 필요 없어요.'] },
      chefsNotes: '치즈를 곁들이면 더 풍부한 맛을 즐길 수 있어요.',
      platingAndServing: '루꼴라 위에 곶감과 호두를 올려 완성하세요.',
      pairing: '곶감 대신 단감으로도 만들 수 있어요.',
      storageAndReheating: '만든 즉시 드세요.',
      leftoverIdeas: '남으면 다음날 빵에 곁들여도 좋아요.',
      closingNote: '곶감을 얇게 써는 것이 이 샐러드의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '곶감', amount: '3개' }, { name: '루꼴라', amount: '50g' }, { name: '호두', amount: '20g' }, { name: '올리브오일', amount: '2큰술' }, { name: '발사믹식초', amount: '1큰술' },
    ],
    steps: [
      { title: '곶감 손질', description: '곶감은 씨를 제거하고 먹기 좋게 썹니다.' },
      { title: '드레싱 만들기', description: '올리브오일과 발사믹식초를 섞어 드레싱을 만듭니다.' },
      { title: '완성', description: '루꼴라 위에 곶감과 호두를 올리고 드레싱을 뿌려 완성합니다.' },
    ],
    tips: ['대체 재료: 곶감 대신 단감으로도 만들 수 있어요.', '보관/활용: 만든 즉시 드세요.'],
    youtubeQuery: '곶감샐러드 만들기',
  },
];

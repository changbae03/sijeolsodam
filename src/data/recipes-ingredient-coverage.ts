import { Recipe } from './types';

export const recipesIngredientCoverage: Recipe[] = [
  // ===== 채소 =====
  {
    id: 'ing-부추-1', month: 5, title: '고소한 부추전', subtitle: '향긋한 부추로 부쳐낸 바삭한 전',
    category: '브런치', difficulty: '쉬움', level: 'home', cookTime: 20, servings: 2, heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '부추', description: '부추 향이 가득한 반죽을 바삭하게 부쳐낸, 막걸리와 잘 어울리는 전이에요.',
    masterclass: {
      chefIntro: '부추전은 재료도 손질도 간단하지만, 부추 향이 살아있어야 진짜 맛있는 전이에요.',
      ingredientSelection: '부추는 잎이 가늘고 색이 진한 것을 고르세요.',
      miseEnPlace: '부추는 4~5cm 길이로 썰어 준비하세요.',
      cookware: { recommended: '팬', alternatives: ['전용 부침팬으로도 좋아요.'] },
      chefsNotes: '반죽을 얇게 펴야 바삭함이 살아나요.',
      platingAndServing: '접시에 담고 초간장을 곁들이세요.',
      pairing: '막걸리 안주로 잘 어울려요.',
      storageAndReheating: '냉장 1~2일, 팬에 데우면 바삭함이 살아나요.',
      leftoverIdeas: '식으면 잘게 썰어 볶음밥에 넣어도 좋아요.',
      closingNote: '반죽을 얇게 펴는 것이 이 전의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '부추', amount: '150g' }, { name: '부침가루', amount: '1컵' }, { name: '물', amount: '1컵' }, { name: '식용유', amount: '3큰술' },
    ],
    steps: [
      { title: '반죽', description: '부침가루와 물을 섞어 반죽을 만들고 부추를 썰어 넣습니다.' },
      { title: '부치기', description: '팬에 기름을 두르고 반죽을 얇게 펴 중불로 양면을 노릇하게 부쳐 완성합니다.', timerSeconds: 360, checkpoint: '가장자리가 바삭해지면 뒤집을 때예요.' },
    ],
    tips: ['대체 재료: 홍고추를 채 썰어 올리면 색이 예뻐요.', '보관/활용: 냉장 1~2일 이내로 드세요.'],
    youtubeQuery: '부추전 부치기',
  },
  {
    id: 'ing-애호박-1', month: 6, title: '부드러운 애호박볶음', subtitle: '간단하고 부드러운 여름 호박 볶음',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 3, heroImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '애호박', description: '새우젓으로 간을 한 애호박볶음은 부드럽고 감칠맛이 좋은 기본 반찬이에요.',
    masterclass: {
      chefIntro: '애호박볶음은 새우젓 한 스푼으로 감칠맛을 확 끌어올리는 한식 기본기 반찬이에요.',
      ingredientSelection: '애호박은 껍질에 윤기가 돌고 단단한 것을 고르세요.',
      miseEnPlace: '애호박은 반달 모양으로 얇게 썰어 준비하세요.',
      cookware: { recommended: '팬', alternatives: ['웍으로도 만들 수 있어요.'] },
      chefsNotes: '소금을 약간 넣고 절였다가 볶으면 물이 덜 나와요.',
      platingAndServing: '접시에 담아 완성하세요.',
      pairing: '새우젓 대신 소금으로 간해도 좋아요.',
      storageAndReheating: '냉장 2일 이내로 드세요.',
      leftoverIdeas: '남으면 볶음밥에 넣어도 좋아요.',
      closingNote: '중불에서 짧게 볶는 것이 이 반찬의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '애호박', amount: '1개' }, { name: '식용유', amount: '1큰술' }, { name: '새우젓', amount: '1작은술' }, { name: '다진마늘', amount: '1작은술' }, { name: '대파', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '애호박은 반달모양으로 얇게 썹니다.' },
      { title: '완성', description: '팬에 기름을 두르고 애호박을 중불에서 3분간 볶다가 새우젓, 다진마늘, 대파를 넣어 1분 더 볶아 완성합니다.', timerSeconds: 240 },
    ],
    tips: ['대체 재료: 새우젓 대신 소금으로 간해도 좋아요.', '보관/활용: 냉장 2일 이내로 드세요.'],
    youtubeQuery: '애호박볶음',
  },

  // ===== 과일 =====

  // ===== 곡물 =====
  {
    id: 'ing-검은콩-1', month: 2, title: '고소한 검은콩밥', subtitle: '구수하고 영양 가득한 검은콩 잡곡밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 40, servings: 3, heroImage: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '검은콩', description: '쌀에 검은콩을 섞어 지으면 구수한 맛과 영양을 한 번에 챙길 수 있어요.',
    masterclass: {
      chefIntro: '검은콩밥은 콩을 불리는 정성만 들이면 실패 없이 구수하게 완성되는 잡곡밥이에요.',
      ingredientSelection: '검은콩은 알이 통통하고 껍질에 윤기가 도는 것을 고르세요.',
      miseEnPlace: '검은콩은 미리 1시간 정도 물에 불려 준비하세요.',
      cookware: { recommended: '밥솥 또는 냄비', alternatives: ['압력솥으로도 만들 수 있어요.'] },
      chefsNotes: '콩 불린 물은 버리지 말고 밥물로 같이 쓰면 콩의 구수한 맛이 밥에 그대로 배어들어요.',
      platingAndServing: '그릇에 담아 완성하세요.',
      pairing: '소금을 약간 더하면 콩 맛이 살아나요.',
      storageAndReheating: '식은 밥은 한 끼 분량씩 냉동해두면 나중에 데워서 바로 먹을 수 있어요.',
      leftoverIdeas: '남으면 누룽지로 눌려 먹어도 좋아요.',
      closingNote: '콩을 충분히 불리는 것이 이 밥의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '쌀', amount: '2컵' }, { name: '검은콩', amount: '1/2컵' }, { name: '물', amount: '2컵' },
    ],
    steps: [
      { title: '불리기', description: '검은콩은 미리 1시간 정도 물에 불립니다.', timerSeconds: 3600, checkpoint: '불린 콩을 눌러봤을 때 약간 도톰해지고 손톱으로 쉽게 눌러지면 잘 불려진 거예요.' },
      { title: '안치기', description: '씻은 쌀과 불린 콩을 솥에 담고 물을 맞춥니다.', tip: '콩물을 밥물에 섞으면 향이 더 진해져요.' },
      { title: '완성', description: '평소처럼 밥을 지어 완성합니다.', timerSeconds: 1800, checkpoint: '밥알 사이로 콩이 통통하게 부풀어 있으면 잘 지어진 거예요.', warning: '뚜껑을 자꾸 열면 밥이 설익을 수 있어요.' },
    ],
    tips: ['대체 재료: 검은콩이 없으면 서리태나 강낭콩으로도 비슷하게 만들 수 있어요.', '보관/활용: 식은 밥은 한 끼 분량씩 냉동 보관하세요.'],
    youtubeQuery: '검은콩밥 짓기',
  },
  {
    id: 'ing-들깨-1', month: 1, title: '고소한 들깨미역국', subtitle: '들깨가루로 더 구수해진 국',
    category: '국&찌개', difficulty: '아주 쉬움', level: 'home', cookTime: 25, servings: 3, heroImage: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '들깨', description: '미역국에 들깨가루를 더하면 더 구수하고 고소한 맛이 살아나요.',
    masterclass: {
      chefIntro: '들깨미역국은 평범한 미역국에 들깨가루 한 줌으로 훨씬 진한 풍미를 더하는 요리예요.',
      ingredientSelection: '들깨가루는 갓 볶아 간 것이 향이 가장 진해요.',
      miseEnPlace: '미역은 찬물에 충분히 불려 준비하세요.',
      cookware: { recommended: '냄비', alternatives: ['따로 대체 도구는 없어요.'] },
      chefsNotes: '들깨가루는 마지막에 넣어야 향이 살아있어요.',
      platingAndServing: '그릇에 담아 뜨겁게 서빙하세요.',
      pairing: '들깨가루 대신 들깻물을 써도 좋아요.',
      storageAndReheating: '냉장 1~2일, 데울 때 오래 끓이지 마세요.',
      leftoverIdeas: '남으면 밥을 말아 먹어도 좋아요.',
      closingNote: '들깨가루를 마지막에 넣는 것이 이 국의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '마른미역', amount: '20g' }, { name: '들깨가루', amount: '3큰술' }, { name: '국간장', amount: '1큰술' }, { name: '다진마늘', amount: '1작은술' }, { name: '참기름', amount: '1큰술' },
    ],
    steps: [
      { title: '미역 준비', description: '미역을 불려 자르고 참기름에 볶습니다.' },
      { title: '끓이기', description: '물을 붓고 국간장, 다진마늘을 넣어 15분간 끓입니다.', timerSeconds: 900 },
      { title: '완성', description: '들깨가루를 풀어 넣고 한소끔 더 끓여 완성합니다.', warning: '오래 끓이면 향이 날아가요.' },
    ],
    tips: ['대체 재료: 들깨가루 대신 들깻물을 써도 좋아요.', '보관/활용: 냉장 1~2일 이내로 드세요.'],
    youtubeQuery: '들깨미역국',
  },
  {
    id: 'ing-흑미-1', month: 1, title: '고소한 흑미밥', subtitle: '안토시아닌이 풍부한 건강 잡곡밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 35, servings: 3, heroImage: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '흑미', description: '쌀에 흑미를 섞어 지으면 은은한 보랏빛과 구수한 맛을 함께 즐길 수 있어요.',
    masterclass: {
      chefIntro: '흑미밥은 색과 영양 두 가지를 한 번에 챙길 수 있는 건강 잡곡밥이에요.',
      ingredientSelection: '흑미는 알이 고르고 윤기 나는 것을 고르세요.',
      miseEnPlace: '흑미는 30분 정도 물에 불려 준비하세요.',
      cookware: { recommended: '밥솥 또는 냄비', alternatives: ['압력솥으로도 만들 수 있어요.'] },
      chefsNotes: '흑미 비율을 높이면 색이 더 진해져요.',
      platingAndServing: '그릇에 담아 완성하세요.',
      pairing: '잡곡을 더 섞어도 잘 어울려요.',
      storageAndReheating: '식은 밥은 한 끼 분량씩 냉동 보관하세요.',
      leftoverIdeas: '남으면 누룽지로 눌려 먹어도 좋아요.',
      closingNote: '흑미를 충분히 불리는 것이 이 밥의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '쌀', amount: '2컵' }, { name: '흑미', amount: '1/4컵' }, { name: '물', amount: '2컵' },
    ],
    steps: [
      { title: '불리기', description: '흑미는 30분 정도 물에 불립니다.', timerSeconds: 1800 },
      { title: '안치기', description: '쌀과 흑미를 섞어 솥에 담고 물을 맞춥니다.' },
      { title: '완성', description: '평소처럼 밥을 지어 완성합니다.', timerSeconds: 1800 },
    ],
    tips: ['대체 재료: 흑미 비율을 높이면 색이 더 진해져요.', '보관/활용: 식은 밥은 한 끼 분량씩 냉동 보관하세요.'],
    youtubeQuery: '흑미밥 짓기',
  },
];

import { Recipe } from './types';

/**
 * 138개로 늘어난 식재료 중 레시피가 하나도 없던 46개 품목에 대해
 * 각 1개씩 현실적인 레시피를 추가한 파일.
 *
 * heroImage는 임시 플레이스홀더(기존 코드베이스에서 확인된 안전한 Unsplash URL)를
 * 재사용했습니다. 실제 음식 사진으로 바꾸려면:
 *   GEMINI_API_KEY=키 BLOB_READ_WRITE_TOKEN=토큰 npx tsx scripts/generate-images.ts --recipe={id} --hero-only
 */
const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80';

export const recipesIngredientCoverage: Recipe[] = [
  // ===== 해산물 =====
  {
    id: 'ing-대게-1', month: 1, title: '쫄깃 살 가득 대게찜', subtitle: '쪄낸 살이 탱글하게 빠지는 겨울 별미',
    category: '메인', difficulty: '보통', level: 'home', cookTime: 25, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '대게', description: '손질한 대게를 통째로 쪄서 살을 발라먹는 가장 간단하고 확실한 방법이에요.',
    ingredients: [
      { name: '대게', amount: '1마리(800g~1kg)' }, { name: '맛술', amount: '2큰술' }, { name: '소금', amount: '약간' }, { name: '레몬', amount: '1/2개' },
    ],
    steps: [
      { title: '손질', description: '대게는 칫솔로 깨끗이 씻고 등딱지를 한 번 떼었다 붙여 찜기에 올리기 쉽게 합니다.' },
      { title: '찌기', description: '김 오른 찜기에 맛술을 두르고 대게를 올려 15~20분 찝니다.', timerSeconds: 1200, tip: '등딱지를 위로 두면 육즙이 안 빠져요.' },
      { title: '플레이팅', description: '다리를 가위로 갈라 살을 바로 발라먹기 좋게 담고, 레몬을 곁들입니다.' },
    ],
    tips: ['게딱지에 밥을 비벼 먹으면 별미예요.', '찐 후 바로 먹어야 살이 가장 촉촉해요.'],
    youtubeQuery: '대게찜 손질법',
  },
  {
    id: 'ing-대구-1', month: 1, title: '담백한 대구탕', subtitle: '시원한 국물이 일품인 겨울 생선탕',
    category: '국&찌개', difficulty: '쉬움', level: 'home', cookTime: 30, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '대구', description: '무와 콩나물을 넣고 맑게 끓여 대구살 본연의 담백함을 살린 탕이에요.',
    ingredients: [
      { name: '대구', amount: '400g(토막)' }, { name: '무', amount: '200g' }, { name: '콩나물', amount: '100g' }, { name: '대파', amount: '1대' }, { name: '다진마늘', amount: '1큰술' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      { title: '육수 끓이기', description: '물에 무를 넣고 끓이다 무가 투명해지면 대구를 넣습니다.' },
      { title: '끓이기', description: '콩나물과 다진마늘을 넣고 중불에서 15분 정도 끓입니다.', timerSeconds: 900 },
      { title: '마무리', description: '대파를 넣고 소금으로 간을 맞춰 한소끔 더 끓입니다.' },
    ],
    tips: ['생강을 살짝 넣으면 비린내가 잡혀요.', '청양고추를 더하면 칼칼한 맛이 더해져요.'],
    youtubeQuery: '맑은 대구탕 끓이는 법',
  },
  {
    id: 'ing-청어-1', month: 1, title: '고소한 청어구이', subtitle: '기름지고 고소한 등푸른 생선구이',
    category: '메인', difficulty: '쉬움', level: 'home', cookTime: 20, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '청어', description: '소금만 뿌려 노릇하게 구워내면 청어 특유의 기름진 맛이 가장 살아나요.',
    ingredients: [
      { name: '청어', amount: '2마리' }, { name: '소금', amount: '1작은술' }, { name: '식용유', amount: '1큰술' },
    ],
    steps: [
      { title: '손질', description: '청어는 내장을 제거하고 깨끗이 씻어 칼집을 살짝 냅니다.' },
      { title: '밑간', description: '소금을 골고루 뿌려 10분 정도 재웁니다.' },
      { title: '굽기', description: '팬에 기름을 두르고 중불에서 앞뒤로 노릇하게 굽습니다.', timerSeconds: 600, tip: '뚜껑을 덮고 구우면 속까지 잘 익어요.' },
    ],
    tips: ['무즙을 곁들이면 느끼함이 잡혀요.', '레몬즙을 살짝 뿌려도 좋아요.'],
    youtubeQuery: '청어구이 손질',
  },
  {
    id: 'ing-도다리-1', month: 3, title: '향긋한 도다리쑥국', subtitle: '봄을 알리는 대표 생선국',
    category: '국&찌개', difficulty: '쉬움', level: 'home', cookTime: 25, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '도다리', description: '쑥의 향긋함과 도다리의 담백함이 어우러진 봄철 대표 국이에요.',
    ingredients: [
      { name: '도다리', amount: '2마리' }, { name: '쑥', amount: '100g' }, { name: '된장', amount: '1큰술' }, { name: '다진마늘', amount: '1큰술' }, { name: '대파', amount: '1대' },
    ],
    steps: [
      { title: '육수', description: '물에 된장을 풀어 끓이다 손질한 도다리를 넣습니다.' },
      { title: '끓이기', description: '중불에서 10분 정도 끓여 생선이 익으면 다진마늘을 넣습니다.', timerSeconds: 600 },
      { title: '쑥 넣기', description: '씻은 쑥과 대파를 넣고 2~3분만 더 끓여 향을 살립니다.' },
    ],
    tips: ['쑥은 오래 끓이면 향이 날아가니 마지막에 넣어요.', '청양고추를 더하면 칼칼해져요.'],
    youtubeQuery: '도다리쑥국 끓이는 법',
  },
  {
    id: 'ing-새조개-1', month: 3, title: '쫄깃 새조개 샤브샤브', subtitle: '데치면 쫄깃해지는 봄 조개의 별미',
    category: '메인', difficulty: '보통', level: 'home', cookTime: 30, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '새조개', description: '맑은 육수에 살짝 데쳐 먹는 새조개 샤브샤브는 봄철 별미예요.',
    ingredients: [
      { name: '새조개', amount: '300g' }, { name: '쑥갓', amount: '50g' }, { name: '팽이버섯', amount: '1봉' }, { name: '다시마육수', amount: '4컵' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '새조개는 소금물에 흔들어 씻어 모래를 제거합니다.' },
      { title: '육수 준비', description: '다시마육수를 끓이고 소금으로 살짝 간합니다.' },
      { title: '데치기', description: '팔팔 끓는 육수에 새조개를 5~10초만 데쳐 바로 먹습니다.', timerSeconds: 10, tip: '오래 데치면 질겨지니 살짝만 데쳐요.' },
    ],
    tips: ['초고추장이나 참기름장에 찍어 드세요.', '남은 육수에 칼국수를 넣어 마무리해도 좋아요.'],
    youtubeQuery: '새조개 샤브샤브',
  },
  {
    id: 'ing-숭어-1', month: 3, title: '쫄깃한 숭어회', subtitle: '봄 숭어로 즐기는 쫄깃한 회 한 접시',
    category: '메인', difficulty: '보통', level: 'home', cookTime: 20, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '숭어', description: '봄에 살이 차오른 숭어는 회로 떠서 쫄깃한 식감을 즐기기 좋아요.',
    ingredients: [
      { name: '숭어회', amount: '300g(손질된 것)' }, { name: '깻잎', amount: '10장' }, { name: '미나리', amount: '한줌' }, { name: '초고추장', amount: '적당량' },
    ],
    steps: [
      { title: '준비', description: '손질된 숭어회를 먹기 좋은 두께로 슬라이스합니다.' },
      { title: '채소 손질', description: '깻잎과 미나리는 깨끗이 씻어 물기를 뺍니다.' },
      { title: '플레이팅', description: '회와 채소를 함께 담고 초고추장을 곁들입니다.' },
    ],
    tips: ['먹기 직전에 회를 썰어야 신선해요.', '마늘과 청양고추를 곁들이면 더 깔끔해요.'],
    youtubeQuery: '숭어회 뜨는 법',
  },
  {
    id: 'ing-멍게-1', month: 4, title: '향긋한 멍게 비빔밥', subtitle: '바다 향 가득한 봄철 별미 비빔밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 1, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '멍게', description: '멍게 특유의 향과 참기름이 어우러진 간단하고 향긋한 비빔밥이에요.',
    ingredients: [
      { name: '멍게', amount: '150g(손질된 것)' }, { name: '밥', amount: '1공기' }, { name: '김가루', amount: '약간' }, { name: '참기름', amount: '1큰술' }, { name: '깨소금', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '멍게는 잘게 썰어 준비합니다.' },
      { title: '비비기', description: '밥에 멍게, 참기름, 깨소금을 넣고 골고루 비빕니다.' },
      { title: '마무리', description: '김가루를 올려 완성합니다.' },
    ],
    tips: ['초장을 살짝 곁들이면 더 감칠맛이 나요.', '오이를 채 썰어 더하면 식감이 좋아져요.'],
    youtubeQuery: '멍게 비빔밥',
  },
  {
    id: 'ing-뱅어-1', month: 5, title: '바삭한 뱅어포 무침', subtitle: '간단하게 무쳐먹는 봄 밑반찬',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 10, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '뱅어', description: '구운 뱅어포에 고춧가루 양념을 더해 바삭하고 짭짤하게 즐기는 밑반찬이에요.',
    ingredients: [
      { name: '뱅어포', amount: '5장' }, { name: '고춧가루', amount: '1작은술' }, { name: '간장', amount: '1작은술' }, { name: '물엿', amount: '1작은술' }, { name: '참기름', amount: '1작은술' },
    ],
    steps: [
      { title: '굽기', description: '뱅어포를 마른 팬에 살짝 구워 바삭하게 합니다.', timerSeconds: 60 },
      { title: '자르기', description: '먹기 좋은 크기로 부숩니다.' },
      { title: '무치기', description: '양념을 모두 섞어 뱅어포에 골고루 무칩니다.' },
    ],
    tips: ['너무 오래 구우면 타니 살짝만 구워요.', '깨를 더하면 고소함이 살아요.'],
    youtubeQuery: '뱅어포 무침',
  },
  {
    id: 'ing-병어-1', month: 5, title: '고소한 병어조림', subtitle: '살이 부드러운 봄 병어를 매콤하게 조린 메인',
    category: '메인', difficulty: '보통', level: 'home', cookTime: 25, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '병어', description: '간장양념에 졸여낸 병어는 살이 부드럽고 양념이 잘 배어들어요.',
    ingredients: [
      { name: '병어', amount: '2마리' }, { name: '간장', amount: '3큰술' }, { name: '고춧가루', amount: '1큰술' }, { name: '다진마늘', amount: '1큰술' }, { name: '대파', amount: '1대' }, { name: '물', amount: '1/2컵' },
    ],
    steps: [
      { title: '손질', description: '병어는 비늘과 내장을 제거하고 칼집을 냅니다.' },
      { title: '양념', description: '간장, 고춧가루, 다진마늘, 물을 섞어 양념장을 만듭니다.' },
      { title: '조리기', description: '냄비에 병어와 양념장을 넣고 중불에서 15분간 조립니다.', timerSeconds: 900, tip: '중간에 양념을 끼얹어주면 골고루 배요.' },
    ],
    tips: ['대파를 마지막에 올려 향을 살려요.', '감자를 깔고 조리면 더 든든해요.'],
    youtubeQuery: '병어조림',
  },
  {
    id: 'ing-민어-1', month: 6, title: '담백한 민어탕', subtitle: '여름 보양식으로 으뜸인 맑은 생선탕',
    category: '국&찌개', difficulty: '쉬움', level: 'home', cookTime: 30, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '민어', description: '맑게 끓여낸 민어탕은 담백하고 부드러운 살 맛이 일품인 여름 보양식이에요.',
    ingredients: [
      { name: '민어', amount: '400g(토막)' }, { name: '애호박', amount: '1/2개' }, { name: '무', amount: '150g' }, { name: '대파', amount: '1대' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      { title: '육수', description: '물에 무를 넣고 끓이다 민어를 넣습니다.' },
      { title: '끓이기', description: '중불에서 15분간 끓여 생선을 익힙니다.', timerSeconds: 900 },
      { title: '마무리', description: '애호박과 대파를 넣고 소금으로 간을 맞춥니다.' },
    ],
    tips: ['미나리를 곁들이면 향이 더 좋아져요.', '국물만 따로 떠서 죽을 끓여도 좋아요.'],
    youtubeQuery: '민어탕 끓이는 법',
  },
  {
    id: 'ing-전갱이-1', month: 6, title: '고소한 전갱이 소금구이', subtitle: '기름지고 고소한 초여름 등푸른 생선구이',
    category: '메인', difficulty: '쉬움', level: 'home', cookTime: 20, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '전갱이', description: '소금만으로 간을 해 구워도 충분히 고소한 전갱이 본연의 맛을 즐길 수 있어요.',
    ingredients: [
      { name: '전갱이', amount: '2마리' }, { name: '소금', amount: '1작은술' }, { name: '식용유', amount: '1큰술' }, { name: '레몬', amount: '1/4개' },
    ],
    steps: [
      { title: '손질', description: '전갱이는 비늘과 내장을 제거하고 깨끗이 씻습니다.' },
      { title: '밑간', description: '소금을 골고루 뿌려 10분간 재웁니다.' },
      { title: '굽기', description: '팬에 기름을 두르고 앞뒤로 노릇하게 굽습니다.', timerSeconds: 600 },
    ],
    tips: ['레몬을 곁들이면 풍미가 살아나요.', '에어프라이어 200도 12분도 좋아요.'],
    youtubeQuery: '전갱이 소금구이',
  },
  {
    id: 'ing-보리새우-1', month: 7, title: '탱탱한 보리새우 소금구이', subtitle: '고소하고 탱탱한 여름 새우구이',
    category: '메인', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '보리새우', description: '소금만 뿌려 구워도 탱탱한 살과 고소한 맛이 그대로 살아나는 간단한 안주예요.',
    ingredients: [
      { name: '보리새우', amount: '300g' }, { name: '굵은소금', amount: '1줌' },
    ],
    steps: [
      { title: '팬 달구기', description: '마른 팬에 굵은소금을 깔고 달굽니다.' },
      { title: '굽기', description: '소금 위에 새우를 올려 앞뒤로 5분씩 굽습니다.', timerSeconds: 600, tip: '껍질이 붉어지면 다 익은 신호예요.' },
    ],
    tips: ['머리부터 통째로 먹으면 더 고소해요.', '레몬즙을 살짝 뿌려도 좋아요.'],
    youtubeQuery: '보리새우 소금구이',
  },
  {
    id: 'ing-장어-1', month: 7, title: '고소한 장어구이', subtitle: '복날 대표 보양식, 양념장에 구운 장어',
    category: '메인', difficulty: '보통', level: 'home', cookTime: 30, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '장어', description: '달콤짭짤한 양념을 발라 구운 장어는 여름철 대표 보양식이에요.',
    ingredients: [
      { name: '장어', amount: '2마리(손질된 것)' }, { name: '간장', amount: '3큰술' }, { name: '맛술', amount: '2큰술' }, { name: '설탕', amount: '1큰술' }, { name: '다진마늘', amount: '1작은술' },
    ],
    steps: [
      {
        title: '양념장',
        description: '간장, 맛술, 설탕, 다진마늘을 섞어 양념장을 끓여 졸입니다. 미리 한 번 끓여서 졸여두면 알코올과 비린내가 날아가고, 당분이 살짝 캐러멜화되면서 단순히 짠맛이 아니라 깊은 단짠 맛이 생겨요.',
        checkpoint: '숟가락으로 떠봤을 때 주르륵 흐르지 않고 묵직하게 떨어지는 점도가 되면 졸임이 끝난 거예요.',
      },
      {
        title: '굽기 1차',
        description: '장어를 석쇄나 팬에 먼저 노릇하게 굽습니다. 양념 없이 먼저 굽는 이유는, 장어 자체의 기름을 먼저 빼주는 거예요 — 그래야 나중에 양념을 발랐을 때 느끼하지 않고 양념 맛이 또렷하게 살아요.',
        timerSeconds: 600,
        checkpoint: '껍질 쪽이 살짝 오그라들면서 노릇한 갈색이 돌고, 지글지글 기름 빠지는 소리가 잦아들면 1차로 충분히 구워진 거예요.',
        warning: '센불에서 급하게 구우면 겉만 타고 속은 안 익어요. 중불에서 천천히 구워야 골고루 익어요.',
      },
      {
        title: '양념 바르기',
        description: '양념장을 발라가며 2~3번 더 구워 윤기나게 마무리합니다. 한 번에 양념을 많이 바르면 타기 쉬우니, 얇게 여러 번 덧발라 가며 윤기가 쌓이듯 입혀주세요.',
        tip: '양념을 바른 후엔 불 옆에서 자리를 뜨지 마세요. 당분이 들어간 양념은 순식간에 타버려요.',
      },
    ],
    tips: [
      '생강채를 곁들이면 느끼함이 잡혀요.',
      '깻잎에 싸먹으면 더 깔끔해요.',
      '대체 재료: 손질된 장어가 없다면 미꾸라지나 붕장어로도 비슷한 양념을 활용할 수 있어요.',
      '보관/활용: 남은 양념장은 밀폐용기에 담아 냉장보관하면 다른 구이 요리에도 두루 쓸 수 있어요.',
    ],
    youtubeQuery: '장어구이 양념',
  },
  {
    id: 'ing-우럭-1', month: 8, title: '시원한 우럭미역국', subtitle: '담백한 흰살생선과 미역이 어우러진 국',
    category: '국&찌개', difficulty: '쉬움', level: 'home', cookTime: 25, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '우럭', description: '우럭의 담백함과 미역의 부드러움이 잘 어울리는 시원한 국이에요.',
    ingredients: [
      { name: '우럭', amount: '1마리(토막)' }, { name: '마른미역', amount: '20g' }, { name: '참기름', amount: '1큰술' }, { name: '국간장', amount: '1큰술' }, { name: '다진마늘', amount: '1작은술' },
    ],
    steps: [
      { title: '미역 불리기', description: '마른미역을 물에 불려 먹기 좋게 자릅니다.' },
      { title: '볶기', description: '참기름에 미역을 볶다가 물을 붓고 끓입니다.' },
      { title: '끓이기', description: '우럭과 국간장, 다진마늘을 넣고 15분간 끓입니다.', timerSeconds: 900 },
    ],
    tips: ['끓이는 중간 거품을 걷어내면 국물이 깔끔해요.', '소금으로 부족한 간을 맞춰요.'],
    youtubeQuery: '우럭미역국',
  },
  {
    id: 'ing-성게-1', month: 8, title: '향긋한 성게 비빔밥', subtitle: '바다향 가득한 고급스러운 별미 비빔밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 10, servings: 1, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '성게', description: '신선한 성게알을 밥 위에 올려 참기름과 간장으로 간단히 즐기는 별미예요.',
    ingredients: [
      { name: '성게알', amount: '50g' }, { name: '밥', amount: '1공기' }, { name: '김가루', amount: '약간' }, { name: '참기름', amount: '1작은술' }, { name: '간장', amount: '1작은술' },
    ],
    steps: [
      { title: '밥 준비', description: '갓 지은 밥을 그릇에 담습니다.' },
      { title: '올리기', description: '성게알을 밥 위에 소복히 올립니다.' },
      { title: '마무리', description: '참기름과 간장을 살짝 두르고 김가루를 뿌립니다.' },
    ],
    tips: ['와사비를 살짝 곁들이면 풍미가 더 깊어져요.', '비비지 않고 그대로 떠먹어도 맛있어요.'],
    youtubeQuery: '성게 비빔밥',
  },
  {
    id: 'ing-연어-1', month: 9, title: '담백한 연어 스테이크', subtitle: '겉은 바삭, 속은 부드러운 연어 요리',
    category: '메인', difficulty: '쉬움', level: 'home', cookTime: 20, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '연어', description: '팬에 구워 겉은 바삭하고 속은 부드럽게 즐기는 가장 기본적인 연어 요리예요.',
    ingredients: [
      { name: '연어', amount: '2토막' }, { name: '올리브오일', amount: '1큰술' }, { name: '소금, 후추', amount: '약간씩' }, { name: '레몬', amount: '1/2개' },
    ],
    steps: [
      { title: '밑간', description: '연어에 소금, 후추로 밑간을 합니다.' },
      { title: '굽기', description: '달군 팬에 올리브오일을 두르고 껍질 쪽부터 바삭하게 굽습니다.', timerSeconds: 240, tip: '한쪽당 3~4분씩 구우면 적당해요.' },
      { title: '마무리', description: '레몬즙을 뿌려 산뜻하게 마무리합니다.' },
    ],
    tips: ['버터를 약간 더하면 풍미가 깊어져요.', '아스파라거스를 곁들이면 보기 좋아요.'],
    youtubeQuery: '연어 스테이크 굽기',
  },
  {
    id: 'ing-전어-1', month: 9, title: '고소한 전어구이', subtitle: '가을이 되면 가장 맛있는 전어 소금구이',
    category: '메인', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '전어', description: '"가을 전어는 며느리도 안 준다"는 말처럼, 통째로 구워 고소하게 즐겨요.',
    ingredients: [
      { name: '전어', amount: '4마리' }, { name: '굵은소금', amount: '1작은술' },
    ],
    steps: [
      { title: '손질', description: '전어는 비늘만 살짝 긁어내고 통째로 준비합니다.' },
      { title: '밑간', description: '소금을 골고루 뿌려 10분간 둡니다.' },
      { title: '굽기', description: '석쇠나 팬에 앞뒤로 노릇하게 굽습니다.', timerSeconds: 600 },
    ],
    tips: ['뼈가 부드러워 통째로 먹어도 좋아요.', '깻잎에 싸서 먹으면 더 향긋해요.'],
    youtubeQuery: '전어구이',
  },
  {
    id: 'ing-주꾸미-1', month: 2, title: '매콤한 주꾸미볶음', subtitle: '쫄깃한 주꾸미를 매콤하게 볶아낸 별미',
    category: '메인', difficulty: '보통', level: 'home', cookTime: 25, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '주꾸미', description: '매콤달콤한 양념에 볶아낸 주꾸미는 쫄깃한 식감이 일품인 술안주예요.',
    ingredients: [
      { name: '주꾸미', amount: '400g' }, { name: '양파', amount: '1/2개' }, { name: '고추장', amount: '2큰술' }, { name: '고춧가루', amount: '1큰술' }, { name: '다진마늘', amount: '1큰술' }, { name: '설탕', amount: '1큰술' },
    ],
    steps: [
      { title: '손질', description: '주꾸미는 내장을 제거하고 밀가루로 바락바락 씻어 헹굽니다.' },
      { title: '양념', description: '고추장, 고춧가루, 다진마늘, 설탕을 섞어 양념장을 만듭니다.' },
      { title: '볶기', description: '팬에 양파를 볶다가 주꾸미와 양념장을 넣고 센불에서 5분간 볶습니다.', timerSeconds: 300, tip: '너무 오래 볶으면 질겨지니 주의해요.' },
    ],
    tips: ['깻잎이나 부추를 더하면 향이 좋아져요.', '볶음밥으로 마무리해도 맛있어요.'],
    youtubeQuery: '주꾸미볶음',
  },
  {
    id: 'ing-방어-1', month: 10, title: '고소한 방어회', subtitle: '기름지고 고소한 가을·겨울 대표 회',
    category: '메인', difficulty: '보통', level: 'home', cookTime: 20, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '방어', description: '기름이 올라 고소한 방어는 두툼하게 썰어 회로 즐기는 게 제일이에요.',
    ingredients: [
      { name: '방어회', amount: '300g(손질된 것)' }, { name: '쪽파', amount: '약간' }, { name: '양파', amount: '1/4개' }, { name: '초고추장', amount: '적당량' },
    ],
    steps: [
      { title: '준비', description: '손질된 방어회를 두툼하게 슬라이스합니다.' },
      { title: '곁들임 준비', description: '쪽파와 양파를 채 썰어 준비합니다.' },
      { title: '플레이팅', description: '회 위에 쪽파와 양파를 올리고 초고추장을 곁들입니다.' },
    ],
    tips: ['방어는 뱃살 부위가 가장 기름지고 고소해요.', '김에 싸서 먹어도 별미예요.'],
    youtubeQuery: '방어회 먹는 법',
  },

  // ===== 채소 =====
  {
    id: 'ing-마늘쫑-1', month: 6, title: '아삭한 마늘쫑볶음', subtitle: '밥반찬으로 좋은 아삭한 볶음',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '마늘쫑', description: '간장양념에 새우젓을 더해 짭짤하고 고소하게 볶아낸 밑반찬이에요.',
    ingredients: [
      { name: '마늘쫑', amount: '200g' }, { name: '식용유', amount: '1큰술' }, { name: '간장', amount: '1큰술' }, { name: '새우젓', amount: '1작은술' }, { name: '깨소금', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '마늘쫑은 5cm 길이로 자릅니다.' },
      { title: '볶기', description: '팬에 기름을 두르고 마늘쫑을 중불에서 3분간 볶습니다.', timerSeconds: 180 },
      { title: '양념', description: '간장과 새우젓을 넣고 1~2분 더 볶은 뒤 깨소금을 뿌립니다.' },
    ],
    tips: ['너무 오래 볶으면 색이 누레지니 짧게 볶아요.', '베이컨을 더하면 풍미가 깊어져요.'],
    youtubeQuery: '마늘쫑볶음',
  },
  {
    id: 'ing-무순-1', month: 9, title: '알싱한 무순 샐러드', subtitle: '간단하게 곁들이는 알싱한 새싹 샐러드',
    category: '샐러드', difficulty: '아주 쉬움', level: 'home', cookTime: 10, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '무순', description: '아삭한 무순에 간장 드레싱을 더해 가볍게 곁들이기 좋은 샐러드예요.',
    ingredients: [
      { name: '무순', amount: '1팩' }, { name: '간장', amount: '1큰술' }, { name: '식초', amount: '1큰술' }, { name: '참기름', amount: '1작은술' }, { name: '깨소금', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '무순은 찬물에 씻어 물기를 충분히 뺍니다.' },
      { title: '드레싱', description: '간장, 식초, 참기름을 섞어 드레싱을 만듭니다.' },
      { title: '버무리기', description: '먹기 직전에 무순과 드레싱을 가볍게 섞습니다.' },
    ],
    tips: ['고기 요리에 곁들이면 알싱한 맛이 잘 어울려요.', '미리 무치면 숨이 죽으니 먹기 직전에 무쳐요.'],
    youtubeQuery: '무순 샐러드',
  },
  {
    id: 'ing-부추-1', month: 5, title: '고소한 부추전', subtitle: '향긋한 부추로 부쳐낸 바삭한 전',
    category: '브런치', difficulty: '쉬움', level: 'home', cookTime: 20, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '부추', description: '부추 향이 가득한 반죽을 바삭하게 부쳐낸, 막걸리와 잘 어울리는 전이에요.',
    ingredients: [
      { name: '부추', amount: '150g' }, { name: '부침가루', amount: '1컵' }, { name: '물', amount: '1컵' }, { name: '식용유', amount: '3큰술' },
    ],
    steps: [
      { title: '반죽', description: '부침가루와 물을 섞어 반죽을 만들고 부추를 썰어 넣습니다.' },
      { title: '부치기 1차', description: '팬에 기름을 두르고 반죽을 얇게 펴서 굽습니다.', timerSeconds: 180 },
      { title: '부치기 2차', description: '한쪽이 노릇해지면 뒤집어 바삭하게 마무리합니다.', timerSeconds: 180 },
    ],
    tips: ['반죽을 얇게 펴야 더 바삭해요.', '간장초식초를 곁들이면 좋아요.'],
    youtubeQuery: '부추전 부치기',
  },
  {
    id: 'ing-씀바귀-1', month: 3, title: '쌉싸름한 씀바귀무침', subtitle: '입맛을 돋우는 새콤달콤 봄나물 무침',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '씀바귀', description: '쌉싸름한 씀바귀를 고춧가루 양념에 새콤달콤하게 무쳐 입맛을 돋워줘요.',
    ingredients: [
      { name: '씀바귀', amount: '200g' }, { name: '고춧가루', amount: '1큰술' }, { name: '식초', amount: '1큰술' }, { name: '설탕', amount: '1작은술' }, { name: '다진마늘', amount: '1작은술' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '씀바귀는 다듬어 씻은 뒤 소금물에 살짝 절여 쓴맛을 줄입니다.' },
      { title: '헹구기', description: '찬물에 헹궈 물기를 꼭 짜냅니다.' },
      { title: '무치기', description: '고춧가루, 식초, 설탕, 다진마늘을 넣고 골고루 무칩니다.' },
    ],
    tips: ['쓴맛이 부담스러우면 절이는 시간을 늘려요.', '미나리를 더하면 향이 좋아져요.'],
    youtubeQuery: '씀바귀무침',
  },
  {
    id: 'ing-애호박-1', month: 6, title: '부드러운 애호박볶음', subtitle: '간단하고 부드러운 여름 호박 볶음',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '애호박', description: '새우젓으로 간을 한 애호박볶음은 부드럽고 감칠맛이 좋은 기본 반찬이에요.',
    ingredients: [
      { name: '애호박', amount: '1개' }, { name: '식용유', amount: '1큰술' }, { name: '새우젓', amount: '1작은술' }, { name: '다진마늘', amount: '1작은술' }, { name: '대파', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '애호박은 반달모양으로 얇게 썹니다.' },
      { title: '볶기', description: '팬에 기름을 두르고 애호박을 중불에서 3분간 볶습니다.', timerSeconds: 180 },
      { title: '간하기', description: '새우젓과 다진마늘, 대파를 넣고 1분 더 볶습니다.' },
    ],
    tips: ['소금을 약간 넣고 절였다가 볶으면 물이 덜 나와요.', '새우젓 대신 소금으로 간해도 좋아요.'],
    youtubeQuery: '애호박볶음',
  },
  {
    id: 'ing-참나물-1', month: 3, title: '향긋한 참나물무침', subtitle: '향긋하게 무쳐낸 봄나물 반찬',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 10, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '참나물', description: '참기름과 국간장으로 슴슴하게 무쳐 참나물 본연의 향을 살린 반찬이에요.',
    ingredients: [
      { name: '참나물', amount: '200g' }, { name: '국간장', amount: '1큰술' }, { name: '참기름', amount: '1큰술' }, { name: '다진마늘', amount: '1작은술' }, { name: '깨소금', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '참나물은 깨끗이 씻어 먹기 좋게 자릅니다.' },
      { title: '무치기', description: '국간장, 참기름, 다진마늘을 넣고 골고루 무칩니다.' },
      { title: '마무리', description: '깨소금을 뿌려 마무리합니다.' },
    ],
    tips: ['생으로 무쳐야 향이 가장 좋아요.', '초고추장으로 무쳐도 잘 어울려요.'],
    youtubeQuery: '참나물무침',
  },
  {
    id: 'ing-토란-1', month: 9, title: '구수한 토란국', subtitle: '부드럽고 구수한 가을 대표 국',
    category: '국&찌개', difficulty: '쉬움', level: 'home', cookTime: 30, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '토란', description: '소고기와 함께 끓여낸 토란국은 부드럽고 구수한 맛이 일품인 가을철 국이에요.',
    ingredients: [
      { name: '토란', amount: '300g' }, { name: '소고기(국거리)', amount: '100g' }, { name: '국간장', amount: '2큰술' }, { name: '다진마늘', amount: '1큰술' }, { name: '참기름', amount: '1큰술' },
    ],
    steps: [
      { title: '손질', description: '토란은 껍질을 벗기고 소금물에 살짝 씻어 미끈거림을 줄입니다.' },
      { title: '볶기', description: '참기름에 소고기를 볶다가 물을 붓고 끓입니다.' },
      { title: '끓이기', description: '토란과 국간장, 다진마늘을 넣고 20분간 끓입니다.', timerSeconds: 1200, tip: '토란이 푹 익을 때까지 끓여야 부드러워요.' },
    ],
    tips: ['손으로 만졌을 때 가려우면 장갑을 끼고 손질해요.', '들깨가루를 더하면 더 구수해져요.'],
    youtubeQuery: '토란국 끓이는 법',
  },
  {
    id: 'ing-풋마늘-1', month: 5, title: '아삭한 풋마늘무침', subtitle: '알싱하고 아삭한 초여름 마늘 무침',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '풋마늘', description: '아삭한 풋마늘을 고춧가루 양념에 새콤하게 무쳐낸 알싱한 반찬이에요.',
    ingredients: [
      { name: '풋마늘', amount: '200g' }, { name: '고춧가루', amount: '1큰술' }, { name: '액젓', amount: '1큰술' }, { name: '설탕', amount: '1작은술' }, { name: '깨소금', amount: '약간' },
    ],
    steps: [
      { title: '손질', description: '풋마늘은 다듬어 씻고 먹기 좋은 길이로 자릅니다.' },
      { title: '절이기', description: '소금을 살짝 뿌려 5분간 절여 숨을 죽입니다.' },
      { title: '무치기', description: '고춧가루, 액젓, 설탕을 넣고 골고루 무친 뒤 깨소금을 뿌립니다.' },
    ],
    tips: ['너무 매운맛이 부담스러우면 양념을 줄여요.', '쪽파를 더해도 잘 어울려요.'],
    youtubeQuery: '풋마늘무침',
  },

  // ===== 과일 =====
  {
    id: 'ing-레드향-1', month: 1, title: '레드향 화채', subtitle: '향긋하고 시원한 겨울 과일 화채',
    category: '디저트', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '레드향', description: '향긋한 레드향을 사이다와 함께 시원하게 즐기는 간단한 화채예요.',
    ingredients: [
      { name: '레드향', amount: '2개' }, { name: '사이다', amount: '1컵' }, { name: '꿀', amount: '1큰술' }, { name: '얼음', amount: '약간' },
    ],
    steps: [
      { title: '과육 준비', description: '레드향은 껍질을 까서 알맹이를 분리합니다.' },
      { title: '섞기', description: '그릇에 과육을 담고 사이다와 꿀을 부어줍니다.' },
      { title: '마무리', description: '얼음을 띄워 시원하게 즐깁니다.' },
    ],
    tips: ['민트잎을 올리면 더 산뜻해요.', '탄산수로 대체하면 덜 달아요.'],
    youtubeQuery: '레드향 화채',
  },
  {
    id: 'ing-멜론-1', month: 7, title: '멜론 프로슈토', subtitle: '달콤한 멜론과 짭짤한 햄의 조화',
    category: '브런치', difficulty: '아주 쉬움', level: 'home', cookTime: 10, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '멜론', description: '달콤한 멜론에 짭짤한 프로슈토(또는 생햄)를 곁들이는 간단한 전채요리예요.',
    ingredients: [
      { name: '멜론', amount: '1/2개' }, { name: '프로슈토(또는 생햄)', amount: '6장' }, { name: '후추', amount: '약간' },
    ],
    steps: [
      { title: '멜론 손질', description: '멜론은 씨를 제거하고 한입 크기로 자릅니다.' },
      { title: '감싸기', description: '멜론 조각을 프로슈토로 감쌉니다.' },
      { title: '마무리', description: '후추를 살짝 뿌려 완성합니다.' },
    ],
    tips: ['멜론은 차갑게 식혀서 만들면 더 맛있어요.', '발사믹 글레이즈를 살짝 뿌려도 좋아요.'],
    youtubeQuery: '멜론 프로슈토',
  },
  {
    id: 'ing-살구-1', month: 5, title: '향긋한 살구잼', subtitle: '새콤달콤한 초여름 살구로 만드는 홈메이드 잼',
    category: '디저트', difficulty: '쉬움', level: 'home', cookTime: 40, servings: 4, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '살구', description: '살구와 설탕만으로 만드는 향긋한 잼은 빵에 발라먹기 좋아요.',
    ingredients: [
      { name: '살구', amount: '500g' }, { name: '설탕', amount: '250g' }, { name: '레몬즙', amount: '1큰술' },
    ],
    steps: [
      {
        title: '손질',
        description: '살구는 씨를 제거하고 잘게 자릅니다. 너무 크게 자르면 졸이는 동안 과육이 끝까지 안 풀어져서 잼이 아니라 과일조림처럼 돼버려요.',
      },
      {
        title: '설탕 절이기',
        description: '설탕을 넣고 30분 정도 절여 즙이 나오게 합니다. 설탕이 삼투 작용으로 과육 속 수분을 끌어내는 과정이라, 이 단계를 건너뛰면 나중에 졸이는 시간이 훨씬 길어지고 과육이 뭉개지기 쉬워요.',
        checkpoint: '그릇 바닥에 옅은 갈색 즙이 흥건하게 고여 있으면 충분히 절여진 거예요.',
      },
      {
        title: '졸이기',
        description: '냄비에 넣고 중약불에서 저어가며 20분간 졸입니다. 거품이 보글보글 올라오다가 점점 큰 기포로 천천히 터지는 소리로 바뀌면, 수분이 줄면서 점도가 잡히고 있다는 신호예요.',
        timerSeconds: 1200,
        tip: '레몬즙을 마지막에 넣으면 색과 산미가 살아요. 펙틴 작용을 도와 잼이 더 잘 굳기도 해요.',
        checkpoint: '나무 숟가락으로 떠서 차가운 접시에 한 방울 떨어뜨려 봤을 때, 흐르지 않고 모양을 유지하면 다 된 거예요.',
        warning: '불을 세게 켜고 자리를 비우면 바닥부터 타기 쉬워요. 중약불을 유지하면서 계속 저어줘야 해요.',
      },
    ],
    tips: [
      '소독한 유리병에 담아 식혀 보관하면 오래 즐길 수 있어요.',
      '요거트에 곁들이면 잘 어울려요.',
      '대체 재료: 살구가 끝물이라 구하기 어렵다면 자두나 천도복숭아로도 비슷하게 만들 수 있어요.',
      '보관/활용: 밀폐해 냉장보관하면 2~3주 정도 즐길 수 있고, 더 오래 두려면 소독한 병에 뜨거울 때 바로 채워 밀봉하세요.',
    ],
    youtubeQuery: '살구잼 만들기',
  },
  {
    id: 'ing-키위-1', month: 2, title: '키위 스무디', subtitle: '비타민 가득한 새콤달콤 키위 스무디',
    category: '디저트', difficulty: '아주 쉬움', level: 'home', cookTime: 10, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '키위', description: '키위와 우유, 꿀만 있으면 5분 안에 만들 수 있는 비타민 가득 스무디예요.',
    ingredients: [
      { name: '키위', amount: '3개' }, { name: '우유(또는 요거트)', amount: '1컵' }, { name: '꿀', amount: '1큰술' }, { name: '얼음', amount: '5조각' },
    ],
    steps: [
      { title: '손질', description: '키위는 껍질을 벗기고 적당히 자릅니다.' },
      { title: '블렌딩', description: '모든 재료를 블렌더에 넣고 곱게 갑니다.' },
    ],
    tips: ['요거트로 만들면 더 꾸덕해요.', '꿀 양은 키위의 단맛에 맞춰 조절해요.'],
    youtubeQuery: '키위 스무디',
  },
  {
    id: 'ing-천혜향-1', month: 2, title: '천혜향 청', subtitle: '향이 진한 만감류로 만드는 홈메이드 과일청',
    category: '디저트', difficulty: '쉬움', level: 'home', cookTime: 30, servings: 6, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '천혜향', description: '천혜향을 설탕에 재워 만든 과일청은 차로 마시거나 탄산수에 타 마시기 좋아요.',
    ingredients: [
      { name: '천혜향', amount: '3개' }, { name: '설탕', amount: '같은 무게' },
    ],
    steps: [
      { title: '손질', description: '천혜향은 껍질째 얇게 슬라이스하거나 과육만 분리합니다.' },
      { title: '재우기', description: '설탕과 1:1 비율로 켜켜이 담아 재웁니다.' },
      { title: '숙성', description: '하루 정도 실온에 두었다가 냉장 보관하며 숙성시킵니다.' },
    ],
    tips: ['소독한 병에 담아야 오래 보관할 수 있어요.', '뜨거운 물에 타면 향긋한 차가 돼요.'],
    youtubeQuery: '천혜향 청 만들기',
  },
  {
    id: 'ing-황금향-1', month: 4, title: '황금향 샐러드', subtitle: '향긋하고 달콤한 봄 만감류 샐러드',
    category: '샐러드', difficulty: '아주 쉬움', level: 'home', cookTime: 10, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '황금향', description: '황금향의 달콤한 과즙과 채소를 곁들여 산뜻하게 즐기는 샐러드예요.',
    ingredients: [
      { name: '황금향', amount: '1개' }, { name: '루꼴라(또는 양상추)', amount: '한줌' }, { name: '올리브오일', amount: '1큰술' }, { name: '소금, 후추', amount: '약간씩' },
    ],
    steps: [
      { title: '손질', description: '황금향은 껍질을 까서 과육을 분리합니다.' },
      { title: '담기', description: '루꼴라를 깔고 황금향 과육을 올립니다.' },
      { title: '드레싱', description: '올리브오일, 소금, 후추를 뿌려 마무리합니다.' },
    ],
    tips: ['견과류를 더하면 식감이 좋아져요.', '발사믹 식초를 살짝 더해도 잘 어울려요.'],
    youtubeQuery: '황금향 샐러드',
  },

  // ===== 곡물 =====
  {
    id: 'ing-검은콩-1', month: 2, title: '고소한 검은콩밥', subtitle: '구수하고 영양 가득한 검은콩 잡곡밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 40, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '검은콩', description: '쌀에 검은콩을 섞어 지으면 구수한 맛과 영양을 한 번에 챙길 수 있어요.',
    ingredients: [
      { name: '쌀', amount: '2컵' }, { name: '검은콩', amount: '1/2컵' }, { name: '물', amount: '2컵' },
    ],
    steps: [
      {
        title: '불리기',
        description: '검은콩은 미리 1시간 정도 물에 불립니다. 콩은 껍질이 단단해서 안 불리고 바로 밥을 지으면 쌀이 다 익어도 콩 속까지 물이 안 들어가 설익은 채로 씹혀요.',
        checkpoint: '불린 콩을 눌러봤을 때 약간 도톰해지고 손톱으로 쉽게 눌러지면 잘 불려진 거예요.',
      },
      {
        title: '안치기',
        description: '씻은 쌀과 불린 콩을 솥에 담고 물을 맞춥니다. 콩 불린 물은 버리지 말고 밥물로 같이 써도 좋아요 — 콩의 구수한 맛이 이미 그 물에 녹아있거든요.',
        tip: '콩물을 밥물에 섞으면 밥알에 옅은 보랏빛이 살짝 돌면서 향도 더 진해져요.',
      },
      {
        title: '밥짓기',
        description: '평소처럼 밥을 짓습니다. 뚜껑을 덮고 끓이는 동안 고소한 콩 냄새가 솥 밖으로 슬슬 새어 나오기 시작하면 거의 다 됐다는 신호예요.',
        timerSeconds: 1800,
        checkpoint: '뚜껑을 열었을 때 밥알 사이로 콩이 통통하게 부풀어 있고, 밥 표면에 윤기가 흐르면 잘 지어진 거예요.',
        warning: '뚜껑을 자꾸 열어보면 그때마다 김이 빠져나가 밥이 설익을 수 있어요. 취사가 끝났다는 신호(밥솥 알림, 또는 물이 졸아드는 소리가 멈춤) 전까지는 열지 마세요.',
      },
    ],
    tips: [
      '콩을 안 불려도 되지만 불리면 더 부드러워요.',
      '소금을 약간 더하면 콩 맛이 살아나요.',
      '대체 재료: 검은콩이 없으면 서리태나 강낭콩으로도 비슷하게 만들 수 있어요.',
      '보관/활용: 식은 밥은 한 끼 분량씩 냉동해두면 나중에 데워서 바로 먹을 수 있어요.',
    ],
    youtubeQuery: '검은콩밥 짓기',
  },
  {
    id: 'ing-들깨-1', month: 1, title: '고소한 들깨미역국', subtitle: '들깨가루로 더 구수해진 국',
    category: '국&찌개', difficulty: '아주 쉬움', level: 'home', cookTime: 25, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '들깨', description: '미역국에 들깨가루를 더하면 더 구수하고 고소한 맛이 살아나요.',
    ingredients: [
      { name: '마른미역', amount: '20g' }, { name: '들깨가루', amount: '3큰술' }, { name: '국간장', amount: '1큰술' }, { name: '다진마늘', amount: '1작은술' }, { name: '참기름', amount: '1큰술' },
    ],
    steps: [
      { title: '미역 준비', description: '미역을 불려 자르고 참기름에 볶습니다.' },
      { title: '끓이기', description: '물을 붓고 국간장, 다진마늘을 넣어 15분간 끓입니다.', timerSeconds: 900 },
      { title: '마무리', description: '들깨가루를 풀어 넣고 한소끔 더 끓입니다.' },
    ],
    tips: ['들깨가루는 마지막에 넣어야 향이 살아요.', '들깨가루 대신 들깻물을 써도 좋아요.'],
    youtubeQuery: '들깨미역국',
  },
  {
    id: 'ing-보리-1', month: 3, title: '구수한 보리비빔밥', subtitle: '식이섬유 가득한 구수한 보리밥 비빔밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 30, servings: 2, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '보리', description: '구수한 보리밥에 나물과 고추장을 더해 비벼먹는 건강한 한 끼예요.',
    ingredients: [
      { name: '보리밥', amount: '2공기' }, { name: '나물(취나물 등)', amount: '1컵' }, { name: '고추장', amount: '2큰술' }, { name: '참기름', amount: '1큰술' }, { name: '계란프라이', amount: '2개' },
    ],
    steps: [
      { title: '밥 짓기', description: '보리를 쌀과 섞어 평소보다 물을 좀 더 넣고 밥을 짓습니다.', timerSeconds: 1800 },
      { title: '나물 준비', description: '나물은 간장, 참기름으로 무쳐둡니다.' },
      { title: '비비기', description: '그릇에 밥, 나물, 계란프라이를 올리고 고추장과 참기름을 더해 비빕니다.' },
    ],
    tips: ['보리는 쌀보다 물을 1.2배 정도 더 넣어요.', '여러 나물을 섞으면 더 풍성해요.'],
    youtubeQuery: '보리비빔밥',
  },
  {
    id: 'ing-풋콩-1', month: 7, title: '담백한 풋콩찜', subtitle: '소금물에 삶아 즐기는 여름 맥주 안주',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '풋콩', description: '소금물에 삶기만 하면 끝나는 가장 간단한 여름 별미예요.',
    ingredients: [
      { name: '풋콩', amount: '300g' }, { name: '굵은소금', amount: '2큰술' }, { name: '물', amount: '5컵' },
    ],
    steps: [
      { title: '손질', description: '풋콩 꼬투리 끝을 살짝 잘라 소금물이 잘 배게 합니다.' },
      { title: '삶기', description: '소금물을 끓여 풋콩을 넣고 8~10분간 삶습니다.', timerSeconds: 540, tip: '너무 오래 삶으면 물러지니 시간을 지켜요.' },
      { title: '헹구기', description: '찬물에 헹궈 한 번 더 소금을 살짝 뿌려줍니다.' },
    ],
    tips: ['삶은 후 바로 찬물에 헹구면 더 아삭해요.', '맥주 안주로 잘 어울려요.'],
    youtubeQuery: '풋콩 삶는 법',
  },
  {
    id: 'ing-햅쌀-1', month: 9, title: '윤기나는 햅쌀밥', subtitle: '그해 첫 수확한 쌀로 짓는 향긋한 밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 30, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '햅쌀', description: '특별한 양념 없이 그냥 지어도 향긋하고 차진 햅쌀밥 자체가 별미예요.',
    ingredients: [
      { name: '햅쌀', amount: '2컵' }, { name: '물', amount: '2컵' },
    ],
    steps: [
      { title: '씻기', description: '햅쌀은 2~3번 가볍게 씻습니다.' },
      { title: '불리기', description: '30분 정도 물에 불립니다.' },
      { title: '밥짓기', description: '평소보다 물을 살짝 적게 잡고 밥을 짓습니다.', timerSeconds: 1800, tip: '햅쌀은 수분이 많아 물을 약간 줄여요.' },
    ],
    tips: ['갓 지은 밥은 그 자체로 가장 맛있어요.', '소금을 살짝 넣고 지으면 단맛이 더 살아요.'],
    youtubeQuery: '햅쌀밥 짓기',
  },
  {
    id: 'ing-햇마늘-1', month: 6, title: '알 굵은 햇마늘 장아찌', subtitle: '아삭하게 절여 두고 먹는 마늘 장아찌',
    category: '반찬', difficulty: '쉬움', level: 'home', cookTime: 20, servings: 6, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '햇마늘', description: '알이 통통한 햇마늘을 간장물에 절여두면 아삭하고 알싱한 밑반찬이 돼요.',
    ingredients: [
      { name: '햇마늘', amount: '500g' }, { name: '간장', amount: '1컵' }, { name: '식초', amount: '1컵' }, { name: '물', amount: '1컵' }, { name: '설탕', amount: '1/2컵' },
    ],
    steps: [
      { title: '손질', description: '햇마늘은 껍질을 까서 깨끗이 씻습니다.' },
      { title: '절임물', description: '간장, 식초, 물, 설탕을 넣고 끓여 절임물을 만듭니다.' },
      { title: '절이기', description: '식힌 절임물을 마늘에 부어 2주 정도 숙성시킵니다.', tip: '2주 후부터 아삭하게 즐길 수 있어요.' },
    ],
    tips: ['소독한 병에 담아야 오래 보관할 수 있어요.', '숙성될수록 매운맛이 부드러워져요.'],
    youtubeQuery: '햇마늘 장아찌',
  },
  {
    id: 'ing-흑미-1', month: 1, title: '고소한 흑미밥', subtitle: '안토시아닌이 풍부한 건강 잡곡밥',
    category: '밥', difficulty: '아주 쉬움', level: 'home', cookTime: 35, servings: 3, heroImage: PLACEHOLDER_IMAGE,
    mainIngredient: '흑미', description: '쌀에 흑미를 섞어 지으면 은은한 보라빛과 구수한 맛을 함께 즐길 수 있어요.',
    ingredients: [
      { name: '쌀', amount: '2컵' }, { name: '흑미', amount: '1/4컵' }, { name: '물', amount: '2컵' },
    ],
    steps: [
      { title: '불리기', description: '흑미는 30분 정도 물에 불립니다.' },
      { title: '안치기', description: '쌀과 흑미를 섞어 솥에 담고 물을 맞춥니다.' },
      { title: '밥짓기', description: '평소처럼 밥을 짓습니다.', timerSeconds: 1800 },
    ],
    tips: ['흑미 비율을 높이면 색이 더 진해져요.', '잡곡을 더 섞어도 잘 어울려요.'],
    youtubeQuery: '흑미밥 짓기',
  },
];

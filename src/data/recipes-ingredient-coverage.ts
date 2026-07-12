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
  // ===== 채소 =====
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

  // ===== 과일 =====

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

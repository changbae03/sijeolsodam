import { Recipe } from './types';

/**
 * 사과 4단계 컬렉션 보강 (KAMIS 9개 핵심 식재료 확장 1차분).
 * 직전: home 3(이미 충족), weekend 1, world 1, chef 1
 * 추가: weekend +2, world +2, chef +2 → 전부 3개씩으로 맞춤
 */
export const recipesAppleExpansion: Recipe[] = [
  // ===== 주말 요리 =====
  {
    id: 'apple-weekend-2', month: 10, title: '사과 크럼블', subtitle: '바삭한 토핑과 부드러운 사과의 대비를 즐기는 베이킹',
    category: '디저트', difficulty: '보통', level: 'weekend', cookTime: 60, servings: 4,
    heroImage: 'https://v38estqimd9lwwub.public.blob.vercel-storage.com/recipes/apple-weekend-2/hero.webp',
    mainIngredient: '사과', description: '계피향 가득한 사과 위에 버터 크럼블을 올려 구운, 따뜻하게 먹는 영국식 디저트예요.',
    masterclass: {
      chefIntro: '오븐만 있으면 만들 수 있는, 비교적 손이 덜 가는 베이킹이에요. 가을 사과로 만들면 졸이는 동안 단맛이 더 깊어져요.',
      ingredientSelection: '단단한 품종(아오리, 홍로)이 오래 구워도 모양이 유지돼 좋아요. 너무 무른 사과는 죽처럼 풀어져요.',
      miseEnPlace: '크럼블 토핑(버터·밀가루·설탕)은 차가운 상태로 손끝으로 비벼 부슬부슬하게 만들어두세요.',
      cookware: { recommended: '오븐용 그라탕 그릇', alternatives: ['일반 내열 유리그릇도 괜찮아요.'] },
      platingAndServing: '그릇 그대로 식탁에 올리고 바닐라 아이스크림을 한 스쿱 곁들이세요.',
      pairing: '따뜻한 차나 바닐라 아이스크림과 잘 어울려요.',
      storageAndReheating: '냉장 3일, 오븐이나 에어프라이어에 데우면 토핑이 다시 바삭해져요.',
      leftoverIdeas: '아침에 요거트와 함께 그래놀라처럼 먹어도 좋아요.',
      closingNote: '크럼블 토핑은 너무 매끈하게 섞지 않는 게 비결이에요. 살짝 덩어리진 채로 올려보세요.',
    },
    ingredients: [
      { name: '사과', amount: '4개' }, { name: '버터(차가운 것)', amount: '80g' }, { name: '밀가루', amount: '100g' }, { name: '황설탕', amount: '60g' }, { name: '계피가루', amount: '1작은술' }, { name: '오트밀(선택)', amount: '30g' },
    ],
    steps: [
      {
        title: '사과 손질',
        description: '사과는 껍질을 벗기고 한입 크기로 잘라 계피가루, 설탕 1/3을 섞어 재워둡니다. 미리 재워두면 즙이 배어나오면서 구울 때 더 촉촉해져요.',
      },
      {
        title: '크럼블 만들기',
        description: '차가운 버터를 밀가루, 남은 설탕과 함께 손끝으로 비벼 부슬부슬한 모래 질감으로 만듭니다. 버터가 녹으면 끈적해지니, 손이 따뜻하다면 잠깐씩 멈춰가며 작업하세요.',
        warning: '버터가 녹아 반죽처럼 뭉치면 구웠을 때 바삭한 크럼블 대신 딱딱한 비스킷처럼 돼요.',
        recoveryTip: '녹았다면 냉장고에 10분 넣어 다시 굳힌 후 작업하세요.',
      },
      {
        title: '쌓고 굽기',
        description: '그라탕 용기에 사과를 깔고 크럼블을 골고루 덮어 180도에서 35~40분 굽습니다. 표면이 짙은 갈색으로 변하고 사과 끓는 냄새가 올라오면 다 된 거예요.',
        timerSeconds: 2200,
        checkpoint: '꼬치로 사과를 찔렀을 때 부드럽게 들어가면 완성이에요.',
      },
    ],
    tips: ['대체 재료: 오트밀을 더하면 더 바삭하고 고소해져요.', '보관/활용: 식어도 맛있지만, 데우면 토핑이 다시 살아나요.'],
    youtubeQuery: '사과 크럼블 만들기',
  },
  {
    id: 'apple-weekend-3', month: 10, title: '구운 사과와 캐러멜소스', subtitle: '속을 채워 통째로 구워내는 따뜻한 디저트',
    category: '디저트', difficulty: '쉬움', level: 'weekend', cookTime: 50, servings: 4,
    heroImage: 'https://v38estqimd9lwwub.public.blob.vercel-storage.com/recipes/apple-weekend-3/hero.webp',
    mainIngredient: '사과', description: '사과 속을 파내 견과류와 버터를 채워 통째로 구운, 따뜻하고 향긋한 디저트예요.',
    masterclass: {
      chefIntro: '사과 한 알이 그대로 디저트가 되는 메뉴예요. 통째로 구워서 사과 본연의 모양과 향을 다 즐길 수 있어요.',
      ingredientSelection: '속을 파내야 하니 크고 단단한 사과가 좋아요. 너무 작으면 속을 채울 공간이 부족해요.',
      miseEnPlace: '사과 속을 파내는 도구(애플코어러나 작은 칼)를 미리 준비하고, 견과류는 굵게 다져두세요.',
      cookware: { recommended: '오븐 팬', alternatives: ['에어프라이어로도 비슷하게 구울 수 있어요.'] },
      platingAndServing: '구운 사과를 그릇에 세워 담고 캐러멜소스를 끼얹으면 윤기가 살아나요.',
      pairing: '바닐라 아이스크림이나 휘핑크림을 곁들이면 좋아요.',
      storageAndReheating: '냉장 2일, 오븐에 다시 데우면 향이 살아나요.',
      leftoverIdeas: '속을 으깨어 요거트에 섞어 먹어도 좋아요.',
      closingNote: '속을 너무 깊게 파지 않는 것만 주의하세요. 바닥이 뚫리면 속이 다 흘러나와요.',
    },
    ingredients: [
      { name: '사과', amount: '4개' }, { name: '버터', amount: '30g' }, { name: '호두(또는 피칸)', amount: '40g' }, { name: '황설탕', amount: '3큰술' }, { name: '계피가루', amount: '약간' },
    ],
    steps: [
      {
        title: '속 파내기',
        description: '사과 꼭지 부분을 잘라내고 속을 둥글게 파냅니다. 바닥은 남겨둬야 속재료가 흘러나오지 않아요.',
        warning: '바닥까지 뚫으면 굽는 동안 속이 다 새어나가요. 1cm 정도는 남겨두세요.',
      },
      {
        title: '속 채우기',
        description: '다진 견과류, 버터, 설탕, 계피가루를 섞어 파낸 자리에 채웁니다.',
      },
      {
        title: '굽기',
        description: '180도 오븐에서 30분 굽습니다. 사과 껍질이 살짝 갈라지고 속에서 끓는 냄새가 올라오면 다 익은 신호예요.',
        timerSeconds: 1800,
        checkpoint: '꼬치로 옆면을 찔렀을 때 부드럽게 들어가면 완성이에요.',
      },
      {
        title: '캐러멜소스',
        description: '설탕을 약불에서 갈색이 될 때까지 녹이고 생크림을 조심스럽게 부어 섞습니다.',
        warning: '뜨거운 캐러멜에 생크림을 부으면 순간적으로 끓어오를 수 있어요. 조금씩 부으세요.',
      },
    ],
    tips: ['대체 재료: 견과류 없이 건포도만 채워도 충분히 맛있어요.', '보관/활용: 캐러멜소스는 따로 보관해 다른 디저트에도 활용할 수 있어요.'],
    youtubeQuery: '구운 사과 캐러멜소스',
  },

  // ===== 세계 요리 =====
  {
    id: 'apple-world-2', month: 10, title: '아메리칸 애플파이', subtitle: '미국 가정의 상징, 격자무늬 사과 파이',
    category: '디저트', difficulty: '보통', level: 'world', cookTime: 100, servings: 8,
    cuisineContext: {
      country: '미국',
      note: '애플파이는 "미국만큼 미국적인 것"이라는 표현이 있을 정도로 미국 가정식의 상징이에요. 추수감사절 식탁에 빠지지 않고, 격자무늬 파이지가 특징적인 비주얼을 만들어요.',
    },
    heroImage: 'https://v38estqimd9lwwub.public.blob.vercel-storage.com/recipes/apple-world-2/hero.webp',
    mainIngredient: '사과', description: '계피향 가득한 사과 필링을 격자무늬 파이지로 감싸 구운, 미국의 대표적인 명절 디저트예요.',
    masterclass: {
      chefIntro: '미국 가정의 명절 식탁을 상징하는 디저트예요. 가을 사과로 만들면 필링의 단맛과 산미가 균형을 이뤄요.',
      ingredientSelection: '새콤한 품종과 단 품종을 섞어 쓰면 풍미가 더 복합적이에요. 그래니스미스 같은 산미 있는 사과가 있으면 더 좋아요.',
      miseEnPlace: '파이지는 차가운 상태를 유지해야 하니, 작업 직전까지 냉장고에 두세요. 격자무늬를 위한 칼이나 파이커터도 준비해두세요.',
      cookware: { recommended: '파이팬', alternatives: ['오븐용 둥근 그릇으로도 만들 수 있어요.'] },
      chefsNotes: '파이지가 바삭한 이유는 차가운 버터 조각이 굽는 동안 수증기를 내며 작은 층을 만들기 때문이에요. 반죽이 따뜻해지면 이 층이 사라져요.',
      platingAndServing: '한 조각씩 잘라 따뜻하게 내고, 바닐라 아이스크림을 곁들이면 미국식 그대로예요.',
      pairing: '바닐라 아이스크림, 따뜻한 커피와 잘 어울려요.',
      storageAndReheating: '실온 1일, 냉장 4일. 데울 땐 오븐이 가장 바삭해요.',
      leftoverIdeas: '식은 파이는 토스터에 살짝 데워 아침으로 즐겨도 좋아요.',
      closingNote: '격자무늬가 삐뚤어져도 괜찮아요. 처음 만드는 거라면 그 자체로 충분히 자랑할 만해요.',
    },
    ingredients: [
      { name: '사과', amount: '6개' }, { name: '파이지(2장 분량)', amount: '1세트' }, { name: '설탕', amount: '100g' }, { name: '계피가루', amount: '1작은술' }, { name: '전분', amount: '2큰술' }, { name: '버터', amount: '20g' },
    ],
    steps: [
      {
        title: '필링 만들기',
        description: '사과는 슬라이스해 설탕, 계피가루, 전분과 섞어 30분 재웁니다. 전분이 사과즙과 만나 굽는 동안 걸쭉하게 잡아줘요.',
        timerSeconds: 1800,
      },
      {
        title: '파이지 깔기',
        description: '파이팬에 한 장을 깔고 가장자리를 정리합니다.',
      },
      {
        title: '필링 채우고 덮기',
        description: '필링을 채우고 다른 한 장을 격자무늬로 잘라 덮습니다. 격자 사이로 필링이 살짝 보이게 해야 구울 때 수증기가 빠져나가요.',
        tip: '격자 사이 틈이 없으면 안에서 수증기가 차서 파이지가 눅눅해질 수 있어요.',
      },
      {
        title: '굽기',
        description: '190도 오븐에서 45~50분 굽습니다. 격자무늬 표면이 짙은 갈색이 되고 가장자리에서 필링이 보글보글 올라오면 다 된 거예요.',
        timerSeconds: 2800,
        checkpoint: '파이지를 두드렸을 때 바삭한 소리가 나면 잘 구워진 거예요.',
        warning: '표면이 너무 빨리 타면 가장자리를 알루미늄포일로 가려 마무리하세요.',
      },
    ],
    tips: ['대체 재료: 시판 파이지를 써도 충분히 맛있어요.', '보관/활용: 한 김 식힌 후 잘라야 필링이 흘러나오지 않아요.'],
    youtubeQuery: '아메리칸 애플파이 만들기',
  },
  {
    id: 'apple-world-3', month: 10, title: '아펠슈트루델', subtitle: '오스트리아의 얇은 페이스트리로 감싼 사과 디저트',
    category: '디저트', difficulty: '보통', level: 'world', cookTime: 90, servings: 6,
    cuisineContext: {
      country: '오스트리아',
      note: '아펠슈트루델은 오스트리아 빈을 대표하는 디저트로, 종이처럼 얇게 늘린 반죽으로 사과 필링을 말아 구워요. 오스트리아-헝가리 제국 시절부터 전해진 전통 디저트예요.',
    },
    heroImage: 'https://v38estqimd9lwwub.public.blob.vercel-storage.com/recipes/apple-world-3/hero.webp',
    mainIngredient: '사과', description: '얇게 늘린 페이스트리로 사과와 건포도 필링을 말아 구운, 오스트리아 빈의 대표 디저트예요.',
    masterclass: {
      chefIntro: '빈의 카페 문화를 대표하는 디저트예요. 가을 사과의 산미가 슈트루델 특유의 산뜻한 맛을 잘 살려줘요.',
      ingredientSelection: '산미 있는 사과가 잘 어울려요. 너무 단 사과만 쓰면 전체적으로 무겁게 느껴져요.',
      miseEnPlace: '시판 필로 페이스트리를 쓴다면 마르지 않게 젖은 천으로 덮어두고 작업하세요.',
      cookware: { recommended: '큰 작업대(반죽을 늘릴 공간), 오븐 팬', alternatives: ['시판 필로 페이스트리를 쓰면 반죽 늘리는 과정을 생략할 수 있어요.'] },
      chefsNotes: '전통적으로는 반죽을 손으로 늘려 신문 글씨가 보일 정도로 얇게 만들어요. 시판 필로 페이스트리를 쓰면 이 과정 없이도 비슷한 결과를 낼 수 있어요.',
      platingAndServing: '슬라이스해서 슈가파우더를 살짝 뿌리고 바닐라소스를 곁들이세요.',
      pairing: '빈식이라면 진한 커피와 잘 어울려요.',
      storageAndReheating: '냉장 2일, 오븐에 데우면 페이스트리가 다시 바삭해져요.',
      leftoverIdeas: '식은 슈트루델은 잘라서 따뜻한 우유에 적셔 먹어도 별미예요.',
      closingNote: '반죽이 찢어져도 괜찮아요. 겹쳐서 메우면 구운 후엔 거의 안 보여요.',
    },
    ingredients: [
      { name: '사과', amount: '4개' }, { name: '필로 페이스트리(또는 슈트루델 반죽)', amount: '6장' }, { name: '건포도', amount: '40g' }, { name: '설탕', amount: '60g' }, { name: '계피가루', amount: '1작은술' }, { name: '버터(녹인 것)', amount: '50g' }, { name: '빵가루', amount: '2큰술' },
    ],
    steps: [
      {
        title: '필링 만들기',
        description: '사과는 채 썰어 건포도, 설탕, 계피가루, 빵가루와 섞습니다. 빵가루가 사과즙을 흡수해줘서 구울 때 페이스트리가 눅눅해지지 않아요.',
      },
      {
        title: '페이스트리 겹치기',
        description: '필로 페이스트리를 한 장씩 버터를 발라가며 여러 장 겹칩니다. 한 장만 쓰면 얇아서 필링의 수분에 쉽게 찢어져요.',
        warning: '페이스트리가 마르면 부서지기 쉬워요. 작업하지 않는 부분은 천으로 덮어두세요.',
      },
      {
        title: '말기',
        description: '한쪽 끝에 필링을 길게 올리고 김밥처럼 둥글게 말아줍니다.',
      },
      {
        title: '굽기',
        description: '버터를 겉면에 바르고 190도에서 35분, 표면이 짙은 황금빛이 될 때까지 굽습니다.',
        timerSeconds: 2100,
        checkpoint: '겉면을 두드렸을 때 바삭한 소리가 나면 완성이에요.',
      },
    ],
    tips: ['대체 재료: 필로 페이스트리 대신 시판 파이지로도 비슷하게 만들 수 있어요.', '보관/활용: 냉동 보관 후 오븐에 바로 구워도 좋아요.'],
    youtubeQuery: '아펠슈트루델 만들기',
  },

  // ===== 셰프 컬렉션 =====
  {
    id: 'apple-chef-2', month: 10, title: '사과 콩포트와 푸아그라', subtitle: '단맛과 풍미가 만나는 프랑스 클래식 페어링',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 40, servings: 2,
    platingGuide: '접시에 콩포트를 작은 동그라미로 펴 담고, 그 위에 시어드한 푸아그라를 살짝 올려보세요. 발사믹 글레이즈를 점으로 몇 방울 떨어뜨리면 완성이에요.',
    heroImage: 'https://v38estqimd9lwwub.public.blob.vercel-storage.com/recipes/apple-chef-2/hero.webp',
    mainIngredient: '사과', description: '사과 콩포트의 단맛과 푸아그라의 풍부함이 만나는, 프랑스 파인다이닝의 고전적인 조합이에요.',
    masterclass: {
      chefIntro: '프랑스 요리에서 사과와 푸아그라는 클래식한 짝이에요. 사과의 산미가 푸아그라의 풍부한 기름기를 정리해줘요.',
      ingredientSelection: '산미 있는 사과가 좋아요. 푸아그라는 신선도가 중요하니 구입 즉시 사용하세요.',
      miseEnPlace: '푸아그라는 사용 직전까지 차갑게 보관하고, 콩포트는 미리 만들어 식혀두면 시간이 절약돼요.',
      cookware: { recommended: '코팅 안 된 무쇠팬(푸아그라용)', alternatives: ['일반 스테인리스 팬도 괜찮아요.'] },
      chefsNotes: '푸아그라를 구울 때 팬에 기름을 따로 두르지 않는 이유는, 푸아그라 자체에서 충분한 기름이 나오기 때문이에요. 기름을 더하면 너무 느끼해져요.',
      platingAndServing: '콩포트 위에 푸아그라를 올리고 발사믹 글레이즈로 마무리하세요.',
      pairing: '소테른 같은 스위트 화이트 와인과 클래식하게 어울려요.',
      storageAndReheating: '푸아그라는 구운 즉시 먹어야 해요. 콩포트만 따로 냉장 보관 가능해요.',
      leftoverIdeas: '남은 콩포트는 치즈와 함께 먹어도 좋아요.',
      closingNote: '푸아그라는 정말 짧게, 강한 불에 구워야 해요. 자신감 있게 빠르게 구워보세요.',
    },
    ingredients: [
      { name: '사과', amount: '2개' }, { name: '푸아그라', amount: '150g' }, { name: '버터', amount: '20g' }, { name: '설탕', amount: '2큰술' }, { name: '발사믹 글레이즈', amount: '1큰술' }, { name: '소금, 후추', amount: '약간씩' },
    ],
    steps: [
      {
        title: '콩포트 만들기',
        description: '사과는 잘게 썰어 버터, 설탕과 함께 약불로 으깨질 만큼 졸입니다.',
        timerSeconds: 900,
        checkpoint: '숟가락으로 으깼을 때 부드럽게 뭉개지면 완성이에요.',
      },
      {
        title: '푸아그라 손질',
        description: '푸아그라는 2cm 두께로 썰고 양면에 칼집을 살짝 냅니다. 칼집을 내면 구울 때 안쪽까지 고르게 열이 전달돼요.',
        warning: '푸아그라는 따뜻해지면 쉽게 뭉개져요. 차가운 상태로 작업하세요.',
      },
      {
        title: '시어링',
        description: '뜨거운 팬에 기름 없이 푸아그라를 올려 한쪽당 1분씩만 굽습니다. 표면이 짙은 갈색이 되는 순간 바로 뒤집어야 해요.',
        timerSeconds: 60,
        checkpoint: '가장자리가 살짝 녹아 윤기가 돌면 알맞게 구워진 거예요.',
        warning: '오래 구우면 푸아그라가 다 녹아 기름만 남아요. 정말 짧게 구워야 해요.',
        recoveryTip: '너무 오래 구워 녹았다면, 그 기름은 따로 모아 다른 요리의 풍미를 더하는 데 써보세요.',
      },
    ],
    tips: ['대체 재료: 푸아그라가 부담스럽다면 닭간으로도 비슷한 구조를 만들 수 있어요.', '보관/활용: 콩포트는 일주일 정도 냉장 보관 가능해요.'],
    youtubeQuery: '사과 콩포트 푸아그라',
  },
  {
    id: 'apple-chef-3', month: 10, title: '사과 셔벗과 캐러멜 크럼블', subtitle: '차가움과 바삭함의 모던 디저트 구성',
    category: '디저트', difficulty: '보통', level: 'chef', cookTime: 80, servings: 4,
    platingGuide: '작은 유리잔에 크럼블을 깔고 셔벗을 한 스쿱 올린 뒤, 캐러멜소스를 가늘게 한 줄 그어보세요. 사과칩 한 조각을 꽂으면 입체감이 살아나요.',
    heroImage: 'https://v38estqimd9lwwub.public.blob.vercel-storage.com/recipes/apple-chef-3/hero.webp',
    mainIngredient: '사과', description: '차가운 사과 셔벗과 바삭한 캐러멜 크럼블을 함께 구성한, 온도와 질감의 대비를 즐기는 모던 디저트예요.',
    masterclass: {
      chefIntro: '코스 요리의 마지막을 장식할 만한 구성이에요. 차가운 셔벗과 바삭한 크럼블, 두 가지 대비를 한 그릇에 담아요.',
      ingredientSelection: '향이 진한 사과 품종(아오리 등)이 셔벗에 향을 더 잘 남겨요.',
      miseEnPlace: '셔벗은 얼리는 시간이 필요하니 가장 먼저 시작하세요. 크럼블은 미리 구워 식혀두면 마지막 조립이 빨라져요.',
      cookware: { recommended: '아이스크림 메이커(또는 냉동실+포크)', alternatives: ['아이스크림 메이커가 없으면 얼리는 중간중간 포크로 긁어주면 비슷한 질감이 나와요.'] },
      chefsNotes: '셔벗이 부드러운 이유는 얼리는 동안 계속 저어줘서 얼음 결정이 작게 유지되기 때문이에요. 가만히 얼리면 결정이 커져서 거칠어져요.',
      platingAndServing: '차가운 그릇에 담아야 셔벗이 빨리 녹지 않아요.',
      pairing: '디저트 와인이나 칼바도스(사과 브랜디)와 잘 어울려요.',
      storageAndReheating: '셔벗은 냉동 2주, 크럼블은 밀폐해 실온 1주일 보관 가능해요.',
      leftoverIdeas: '셔벗만 남았다면 탄산수에 띄워 플로트처럼 즐겨도 좋아요.',
      closingNote: '셔벗은 미리 만들어두면 당일엔 조립만 하면 되니, 여유 있게 준비해보세요.',
    },
    ingredients: [
      { name: '사과', amount: '4개' }, { name: '설탕', amount: '80g' }, { name: '레몬즙', amount: '1큰술' }, { name: '버터', amount: '40g' }, { name: '밀가루', amount: '40g' }, { name: '황설탕(크럼블용)', amount: '30g' },
    ],
    steps: [
      {
        title: '셔벗 베이스',
        description: '사과는 갈아 설탕, 레몬즙과 섞어 끓인 뒤 식힙니다.',
        timerSeconds: 600,
      },
      {
        title: '얼리기',
        description: '식힌 베이스를 얼리며 1시간마다 포크로 긁어줍니다. 결정이 커지기 전에 자주 긁어줘야 부드러운 셔벗이 돼요.',
        timerSeconds: 14400,
        checkpoint: '숟가락으로 떴을 때 부드럽게 긁히면 완성이에요.',
      },
      {
        title: '크럼블 굽기',
        description: '버터, 밀가루, 황설탕을 비벼 부슬부슬하게 만들어 180도에서 15분 굽습니다.',
        timerSeconds: 900,
        checkpoint: '짙은 갈색이 돌고 고소한 냄새가 나면 완성이에요.',
      },
      {
        title: '조립',
        description: '차가운 그릇에 크럼블을 깔고 셔벗을 올려 바로 냅니다.',
      },
    ],
    tips: ['대체 재료: 셔벗 대신 시판 바닐라 아이스크림으로도 구성할 수 있어요.', '보관/활용: 크럼블은 따로 보관해 다른 디저트 토핑으로도 활용 가능해요.'],
    youtubeQuery: '사과 셔벗 캐러멜 크럼블',
  },
];

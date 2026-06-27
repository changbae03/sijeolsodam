import { Recipe } from './types';

/**
 * 햇감자(6-1 시리즈) 4단계 컬렉션을 각 최소 5개로 확장.
 * 직전 상태: home 3, weekend 3, world 3, chef 2
 * 추가: home +2, weekend +2, world +2(독일/페루), chef +3
 */
export const recipesPotatoExpansion2: Recipe[] = [
  // ===== 데일리 홈쿡 =====
  {
    id: '6-1-home-4', month: 6, title: '감자채볶음', subtitle: '아삭하게 볶아낸 기본 밑반찬',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 15, servings: 3,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '채 썬 감자를 아삭하게 볶아낸, 가장 기본적인 한식 반찬이에요.',
    masterclass: {
      chefIntro: '집집마다 한 번쯤 만들어본 반찬일 거예요. 햇감자는 전분이 적어서, 채 썰어 볶아도 아삭한 식감이 더 잘 살아요.',
      ingredientSelection: '단단하고 푸른빛 없는 감자를 고르세요. 너무 무른 감자는 채 썰기도 어렵고 볶을 때 끊어져요.',
      miseEnPlace: '감자는 채 썰어 찬물에 담가 전분기를 살짝 빼두면 더 아삭해져요. 당근, 양파도 미리 같은 두께로 썰어두세요.',
      cookware: { recommended: '넓은 팬(웍이면 더 좋아요)', alternatives: ['일반 프라이팬도 괜찮아요.'] },
      platingAndServing: '그릇에 담고 깨를 살짝 뿌리면 끝이에요.',
      pairing: '흰쌀밥, 어떤 국물 요리와도 무난하게 잘 어울려요.',
      storageAndReheating: '냉장 2~3일, 다시 볶듯이 데우면 좋아요.',
      leftoverIdeas: '볶음밥에 넣어도 식감이 재밌게 살아요.',
      closingNote: '센불에서 짧게 볶는 것, 그것만 기억하면 충분해요.',
    },
    ingredients: [
      { name: '햇감자', amount: '2개' }, { name: '당근', amount: '1/4개' }, { name: '양파', amount: '1/4개' }, { name: '식용유', amount: '1큰술' }, { name: '소금', amount: '약간' }, { name: '깨', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 채썰기',
        description: '감자는 얇게 채 썰어 찬물에 5분 담가둡니다. 전분기를 미리 빼주면 볶을 때 서로 들러붙지 않고 아삭함이 더 오래가요.',
        checkpoint: '물이 뽀얗게 흐려지면 전분이 잘 빠지고 있는 거예요.',
      },
      {
        title: '볶기',
        description: '물기를 잘 털어낸 감자를 센불에서 짧게 볶습니다. 물기가 남아있으면 기름이 튀고 볶음이 아니라 찜처럼 익어버려요.',
        timerSeconds: 180,
        checkpoint: '감자가 반투명해지고 가장자리가 살짝 투명해지면 다 익은 거예요.',
        warning: '너무 오래 볶으면 아삭함이 사라지고 물러져요. 짧고 센불로 빠르게가 원칙이에요.',
        recoveryTip: '너무 오래 볶아 물러졌다면 다음엔 소금을 마지막에 넣어 절이는 시간을 줄여보세요.',
      },
      {
        title: '마무리',
        description: '소금으로 간하고 깨를 뿌려 완성합니다.',
      },
    ],
    tips: ['대체 재료: 당근 대신 피망을 넣어도 색이 예뻐요.', '보관/활용: 냉장 2~3일 이내로 드세요.'],
    youtubeQuery: '감자채볶음 만들기',
  },
  {
    id: '6-1-home-5', month: 6, title: '감자전', subtitle: '바삭하게 부쳐낸 감자 부침개',
    category: '브런치', difficulty: '쉬움', level: 'home', cookTime: 25, servings: 2,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '갈아낸 감자를 노릇하게 부쳐낸, 비 오는 날 생각나는 한식 부침개예요.',
    masterclass: {
      chefIntro: '비 오는 날이면 자연스럽게 생각나는 메뉴예요. 햇감자는 수분이 많아서 갈았을 때 더 부드러운 반죽이 나와요.',
      ingredientSelection: '전분 적은 감자가 좋아요. 너무 오래된 감자는 갈았을 때 갈변이 빨리 와요.',
      miseEnPlace: '감자를 갈아둔 뒤엔 바로 부쳐야 색이 변하지 않아요. 팬을 먼저 달궈두고 마지막에 가는 게 좋아요.',
      cookware: { recommended: '넓은 프라이팬', alternatives: ['전기팬으로도 괜찮아요.'] },
      platingAndServing: '반으로 잘라 접시에 겹쳐 담고 간장초식초를 곁들이세요.',
      pairing: '막걸리나 동치미와 잘 어울려요.',
      storageAndReheating: '냉장 2일, 에어프라이어에 데우면 바삭함이 돌아와요.',
      leftoverIdeas: '잘게 잘라 다음날 볶음 요리에 넣어도 좋아요.',
      closingNote: '반죽 농도만 맞으면 실패하기 어려운 메뉴예요. 편하게 시작해보세요.',
    },
    ingredients: [
      { name: '햇감자', amount: '3개' }, { name: '감자전분(또는 밀가루)', amount: '2큰술' }, { name: '소금', amount: '약간' }, { name: '식용유', amount: '적당량' },
    ],
    steps: [
      {
        title: '감자 갈기',
        description: '감자는 강판이나 믹서로 곱게 갑니다. 너무 곱게 갈면 전분물만 남으니, 약간 입자가 느껴지는 정도가 식감에 좋아요.',
      },
      {
        title: '물기 빼기',
        description: '간 감자를 체에 걸러 윗물은 따라내고 가라앉은 전분만 다시 섞습니다. 이 전분이 반죽을 잡아주는 역할을 해요.',
        checkpoint: '체 아래 뽀얀 전분이 가라앉으면 윗물만 조심스레 따라내세요.',
      },
      {
        title: '부치기',
        description: '팬에 기름을 넉넉히 두르고 중불에서 앞뒤로 노릇하게 부칩니다. 가장자리가 살짝 들뜨고 갈색이 돌면 뒤집을 때예요.',
        timerSeconds: 360,
        checkpoint: '뒤집었을 때 노릇한 갈색 면이 보이면 잘 부쳐지고 있는 거예요.',
        warning: '불이 약하면 색은 안 나는데 기름만 흡수해 느끼해져요. 중불 이상을 유지하세요.',
        recoveryTip: '속이 덜 익었다면 약불로 낮춰 뚜껑을 덮고 2분 더 익히세요.',
      },
    ],
    tips: ['대체 재료: 부추를 약간 채 썰어 넣으면 향이 좋아져요.', '보관/활용: 냉동 보관 후 에어프라이어에 바로 구워도 괜찮아요.'],
    youtubeQuery: '감자전 부치기',
  },

  // ===== 주말 요리 =====
  {
    id: '6-1-weekend-4', month: 6, title: '감자 고로케', subtitle: '겉은 바삭, 속은 부드러운 튀김 요리',
    category: '브런치', difficulty: '보통', level: 'weekend', cookTime: 70, servings: 4,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '으깬 감자에 속을 채워 빵가루를 입혀 튀긴, 겉바속촉의 정석을 보여주는 요리예요.',
    masterclass: {
      chefIntro: '시간 들여 만드는 보람이 있는 주말 메뉴예요. 햇감자는 으깼을 때 더 부드럽고 끈기가 적어 속을 채우기 좋아요.',
      ingredientSelection: '전분 적은 왁시 품종이 좋아요. 으깬 감자가 너무 끈적하면 모양 잡기가 어려워요.',
      miseEnPlace: '튀김 순서(밀가루-달걀물-빵가루)대로 그릇을 나란히 준비해두면 작업이 훨씬 수월해요.',
      cookware: { recommended: '튀김용 깊은 냄비, 온도계', alternatives: ['온도계가 없으면 나무젓가락 기포로 온도를 가늠하세요.'] },
      chefsNotes: '튀김옷을 세 단계(밀가루-달걀물-빵가루)로 입히는 이유는, 각 층이 서로 다른 역할을 해서예요. 밀가루는 접착, 달걀물은 매개, 빵가루는 바삭함을 만들어요.',
      platingAndServing: '반으로 잘라 단면을 보이게 담으면 속이 살짝 드러나 먹음직스러워요.',
      pairing: '돈가스 소스나 케첩을 곁들이면 잘 어울려요.',
      storageAndReheating: '튀기기 전 상태로 냉동 가능해요. 튀긴 후엔 에어프라이어로 데우는 게 가장 바삭해요.',
      leftoverIdeas: '식은 고로케는 잘라서 카레에 곁들여도 별미예요.',
      closingNote: '모양이 안 예뻐도 맛은 똑같아요. 튀김 온도만 잘 지키면 충분히 성공이에요.',
    },
    ingredients: [
      { name: '햇감자', amount: '4개' }, { name: '다진 돼지고기', amount: '100g' }, { name: '양파', amount: '1/4개' }, { name: '밀가루, 달걀물, 빵가루', amount: '적당량씩' }, { name: '식용유(튀김용)', amount: '적당량' },
    ],
    steps: [
      {
        title: '속 준비',
        description: '감자는 삶아 으깨고, 양파와 다진 고기를 볶아 섞습니다. 고기는 미리 볶아 익혀둬야 튀기는 짧은 시간에 속까지 안전하게 데워져요.',
        timerSeconds: 1200,
      },
      {
        title: '모양 잡기',
        description: '식힌 속을 동그랗게 빚습니다. 따뜻할 때 빚으면 손에 다 붙으니, 한 김 식힌 뒤 작업하세요.',
        warning: '너무 뜨거울 때 만지면 모양이 안 잡혀요. 식혀서 작업하는 게 핵심이에요.',
      },
      {
        title: '튀김옷 입히기',
        description: '밀가루, 달걀물, 빵가루 순서로 골고루 입힙니다. 빵가루는 살짝 눌러 붙여야 튀길 때 떨어지지 않아요.',
      },
      {
        title: '튀기기',
        description: '170도 기름에서 겉면이 노릇해질 때까지 튀깁니다. 속은 이미 익어있으니, 겉만 바삭하게 튀기면 충분해요.',
        timerSeconds: 240,
        checkpoint: '진한 황금빛이 돌고 기름 거품이 잦아들면 다 된 거예요.',
        recoveryTip: '색이 너무 빨리 들면 불을 약간 낮추고 더 짧게 튀기세요.',
      },
    ],
    tips: ['대체 재료: 고기 없이 채소만으로도 만들 수 있어요.', '보관/활용: 냉동 보관 후 에어프라이어 180도 15분이면 바로 즐길 수 있어요.'],
    youtubeQuery: '감자 고로케 만들기',
  },
  {
    id: '6-1-weekend-5', month: 6, title: '베이컨 감자말이', subtitle: '짭짤한 베이컨을 두른 한입 메뉴',
    category: '메인', difficulty: '쉬움', level: 'weekend', cookTime: 40, servings: 3,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '한입 크기 감자를 베이컨으로 말아 구운, 손님 초대상에도 좋은 메뉴예요.',
    masterclass: {
      chefIntro: '비주얼이 좋아서 손님 초대 자리에 내기 좋은 메뉴예요. 햇감자는 크기가 작아 한입 크기로 손질하기도 편해요.',
      ingredientSelection: '작고 동글동글한 햇감자가 모양 잡기에 좋아요.',
      miseEnPlace: '감자를 미리 삶아 식혀두고, 베이컨도 길이를 맞춰 잘라두면 작업이 빨라져요.',
      cookware: { recommended: '오븐 팬 또는 에어프라이어', alternatives: ['일반 프라이팬으로 굴려가며 구워도 괜찮아요.'] },
      platingAndServing: '꼬치에 꽂아 담으면 핑거푸드처럼 먹기 좋아요.',
      pairing: '맥주나 화이트 와인과 잘 맞는 안주예요.',
      storageAndReheating: '냉장 2일, 에어프라이어에 데우면 베이컨이 다시 바삭해져요.',
      leftoverIdeas: '잘게 썰어 볶음밥 토핑으로 써도 좋아요.',
      closingNote: '베이컨이 단단히 감겨 있는지만 확인하면, 나머지는 오븐이 다 해줘요.',
    },
    ingredients: [
      { name: '햇감자(작은 것)', amount: '12개' }, { name: '베이컨', amount: '12줄' }, { name: '후추', amount: '약간' }, { name: '올리브오일', amount: '1큰술' },
    ],
    steps: [
      {
        title: '감자 삶기',
        description: '작은 감자를 통째로 삶아 살짝 덜 익힌 상태로 건집니다. 완전히 익히면 베이컨을 두르고 구울 때 너무 물러져요.',
        timerSeconds: 600,
        checkpoint: '꼬치로 찔렀을 때 살짝 단단함이 남아있으면 적당해요.',
      },
      {
        title: '베이컨 말기',
        description: '식힌 감자에 베이컨을 한 바퀴 돌려 감고 이쑤시개로 고정합니다.',
        warning: '베이컨을 너무 헐겁게 감으면 구울 때 풀려요. 끝을 단단히 고정하세요.',
      },
      {
        title: '굽기',
        description: '오븐 200도에서 20분, 또는 베이컨이 바삭해질 때까지 굽습니다. 베이컨 기름이 자글자글 끓는 소리가 나면 잘 익고 있는 신호예요.',
        timerSeconds: 1200,
        checkpoint: '베이컨이 짙은 갈색으로 오그라들면 다 된 거예요.',
        recoveryTip: '베이컨이 덜 바삭하면 마지막 3분은 그릴 모드로 마무리하세요.',
      },
    ],
    tips: ['대체 재료: 메이플시럽을 살짝 발라 구우면 단짠 맛이 더해져요.', '보관/활용: 도시락 반찬으로도 잘 어울려요.'],
    youtubeQuery: '베이컨 감자말이 만들기',
  },

  // ===== 세계 요리 =====
  {
    id: '6-1-world-4', month: 6, title: '카토펠푸퍼', subtitle: '독일의 바삭한 감자 팬케이크',
    category: '브런치', difficulty: '쉬움', level: 'world', cookTime: 35, servings: 3,
    cuisineContext: {
      country: '독일',
      note: '카토펠푸퍼는 독일과 오스트리아에서 즐겨 먹는 감자 팬케이크예요. 사과소스나 사워크림을 곁들여 메인으로도, 사이드로도 먹는 독일 가정식의 대표적인 메뉴예요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '간 감자에 양파를 더해 바삭하게 부쳐낸 독일식 감자 팬케이크예요.',
    masterclass: {
      chefIntro: '독일 가정에서 평범하게 만들어 먹는 메뉴예요. 햇감자로 만들면 한국 감자전보다 더 바삭하고 고소한 맛이 나요.',
      ingredientSelection: '전분 많은 감자가 오히려 이 요리엔 더 좋아요. 반죽이 더 잘 뭉쳐지거든요.',
      miseEnPlace: '감자와 양파를 갈아둔 뒤 물기를 최대한 짜내는 게 핵심이라, 면포를 미리 준비해두세요.',
      cookware: { recommended: '넓은 프라이팬', alternatives: ['전기팬도 괜찮아요.'] },
      platingAndServing: '사과소스나 사워크림을 곁들여 따뜻할 때 내세요.',
      pairing: '독일식이라면 맥주와 가장 잘 어울려요.',
      storageAndReheating: '냉장 2일, 팬에 다시 구우면 바삭함이 돌아와요.',
      leftoverIdeas: '식은 건 샌드위치 속재료로 활용해도 좋아요.',
      closingNote: '물기를 얼마나 잘 짜내느냐가 바삭함을 결정해요. 그 한 가지만 신경 써주세요.',
    },
    ingredients: [
      { name: '햇감자', amount: '4개' }, { name: '양파', amount: '1/2개' }, { name: '달걀', amount: '1개' }, { name: '밀가루', amount: '2큰술' }, { name: '소금, 후추', amount: '약간씩' }, { name: '식용유', amount: '적당량' },
    ],
    steps: [
      {
        title: '갈기',
        description: '감자와 양파를 강판이나 푸드프로세서로 곱게 갑니다.',
      },
      {
        title: '물기 짜기',
        description: '면포에 싸서 물기를 최대한 짜냅니다. 수분이 많이 남아있으면 부칠 때 기름이 튀고 바삭하게 안 구워져요.',
        checkpoint: '면포를 짰을 때 물이 더 안 나오면 충분해요.',
        warning: '물기를 덜 짜면 반죽이 질척해서 모양이 안 잡혀요.',
      },
      {
        title: '반죽하기',
        description: '짜낸 감자에 달걀, 밀가루, 소금, 후추를 섞습니다.',
      },
      {
        title: '부치기',
        description: '팬에 기름을 넉넉히 두르고 얇게 펴 양면을 바삭하게 굽습니다. 가장자리가 레이스처럼 바삭하게 일어나면 잘 구워지고 있는 거예요.',
        timerSeconds: 360,
        checkpoint: '짙은 갈색이 돌고 가장자리가 바스락거리면 완성이에요.',
        recoveryTip: '속이 덜 익었다면 불을 낮추고 뚜껑을 덮어 2분 더 익히세요.',
      },
    ],
    tips: ['대체 재료: 사과소스가 없으면 설탕을 살짝 뿌려 먹어도 좋아요.', '보관/활용: 냉동 후 토스터에 구우면 간단하게 즐길 수 있어요.'],
    youtubeQuery: '카토펠푸퍼 독일 감자 팬케이크',
  },
  {
    id: '6-1-world-5', month: 6, title: '까우사 리메냐', subtitle: '페루의 화려한 감자 켜 요리',
    category: '샐러드', difficulty: '보통', level: 'world', cookTime: 60, servings: 4,
    cuisineContext: {
      country: '페루',
      note: '까우사 리메냐는 페루 리마 지역의 대표 요리로, 노란 감자를 으깨 아보카도, 참치나 닭고기를 켜켜이 쌓아 만들어요. 페루가 감자의 원산지인 만큼, 감자 요리에 대한 자부심이 담긴 메뉴예요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '으깬 감자와 아보카도, 참치를 켜켜이 쌓아 만든, 페루의 화려한 색감을 가진 차가운 요리예요.',
    masterclass: {
      chefIntro: '감자의 원산지인 페루를 대표하는 요리예요. 햇감자로 만들면 으깼을 때 더 부드럽고 단맛이 또렷하게 느껴져요.',
      ingredientSelection: '아히 아마리요(노란 고추)가 있으면 정통의 맛이 나지만, 없으면 약간의 머스타드로 대신할 수 있어요.',
      miseEnPlace: '감자는 미리 삶아 으깨두고, 틀(작은 그릇이나 무스링)을 준비해두면 모양 잡기가 쉬워져요.',
      cookware: { recommended: '작은 무스링 또는 컵', alternatives: ['둥근 그릇으로 모양을 잡아도 괜찮아요.'] },
      platingAndServing: '틀에서 빼내 켜가 보이게 세로로 담고, 올리브와 삶은 달걀로 장식하면 페루 가정식 느낌이 살아요.',
      pairing: '시원한 맥주나 피스코 사워(페루 칵테일)와 잘 어울려요.',
      storageAndReheating: '차갑게 먹는 요리라 냉장 보관, 1~2일 내로 드세요.',
      leftoverIdeas: '남은 감자 베이스만 따로 보관해 샐러드에 활용해도 좋아요.',
      closingNote: '색을 켜켜이 쌓는 재미가 있는 요리예요. 틀에서 빼낼 때 조심스럽게만 하시면 충분히 근사해요.',
    },
    ingredients: [
      { name: '햇감자', amount: '5개' }, { name: '아보카도', amount: '1개' }, { name: '참치(캔)', amount: '1캔' }, { name: '라임즙', amount: '2큰술' }, { name: '올리브오일', amount: '2큰술' }, { name: '마요네즈', amount: '2큰술' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 베이스',
        description: '감자는 삶아 곱게 으깨고 라임즙, 올리브오일, 소금을 섞습니다. 라임즙이 들어가면서 감자 특유의 향긋한 산미가 생겨요.',
        timerSeconds: 1200,
      },
      {
        title: '참치 속 준비',
        description: '참치는 기름을 빼고 마요네즈와 섞습니다.',
      },
      {
        title: '쌓기',
        description: '틀에 감자, 참치, 으깬 아보카도, 다시 감자 순서로 눌러 담습니다. 한 켜씩 꾹꾹 눌러야 빼낼 때 무너지지 않아요.',
        checkpoint: '눌렀을 때 단단하게 다져지는 느낌이면 잘 쌓이고 있는 거예요.',
        warning: '헐겁게 담으면 틀에서 뺄 때 주저앉아요.',
      },
      {
        title: '틀 빼기',
        description: '냉장고에서 30분 굳힌 뒤 틀을 살짝 데워 조심스럽게 빼냅니다.',
        tip: '틀 바깥쪽에 따뜻한 물수건을 잠깐 대면 더 쉽게 빠져요.',
      },
    ],
    tips: ['대체 재료: 참치 대신 삶은 닭가슴살로도 만들 수 있어요.', '보관/활용: 만든 날 바로 먹는 게 가장 신선해요.'],
    youtubeQuery: 'Causa Limeña 까우사 리메냐',
  },

  // ===== 셰프 컬렉션 =====
  {
    id: '6-1-chef-3', month: 6, title: '트러플 감자 라비올로', subtitle: '얇은 감자로 감싸낸 모던 한입 요리',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 50, servings: 2,
    platingGuide: '하얀 접시 중앙에 라비올로를 하나씩 단정하게 올리고, 트러플 오일을 점점이 두세 방울 떨어뜨려보세요. 마이크로그린 한 잎이면 충분합니다.',
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '얇게 썬 감자로 트러플 크림을 감싸 만든, 파스타가 아닌 감자로 빚어내는 모던 라비올리예요.',
    masterclass: {
      chefIntro: '감자를 파스타처럼 사용하는 모던 키친의 발상이 담긴 요리예요. 햇감자는 얇게 썰었을 때 더 매끈하고 투명하게 잘려요.',
      ingredientSelection: '크고 둥근 감자를 고르면 큰 원형 슬라이스를 뜨기 좋아요.',
      miseEnPlace: '감자는 만돌린으로 미리 얇게 썰어 찬물에 담가두고, 트러플 크림도 미리 만들어 짤주머니에 채워두세요.',
      cookware: { recommended: '만돌린, 짤주머니', alternatives: ['짤주머니가 없으면 작은 숟가락으로 짜내도 괜찮아요.'] },
      chefsNotes: '감자 슬라이스를 데치는 시간이 짧은 이유는, 너무 오래 데치면 부서지기 쉬워서예요. 살짝 부드러워지는 정도, 그 타이밍이 중요해요.',
      platingAndServing: '하얀 접시에 단정하게 올리고 트러플 오일을 점점이 뿌리면 충분해요.',
      pairing: '가벼운 화이트 와인이나 샴페인과 잘 어울려요.',
      storageAndReheating: '만든 직후 바로 내는 게 가장 좋아요. 따뜻한 물에 살짝 데우는 정도만 가능해요.',
      leftoverIdeas: '남은 트러플 크림은 파스타나 리소토에 활용해도 좋아요.',
      closingNote: '감자 한 장 한 장이 얇을수록 우아해져요. 천천히, 정성을 들여보세요.',
    },
    ingredients: [
      { name: '햇감자(큰 것)', amount: '2개' }, { name: '크림치즈', amount: '50g' }, { name: '트러플 오일', amount: '1큰술' }, { name: '파마산 치즈', amount: '2큰술' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 슬라이스',
        description: '감자는 만돌린으로 1mm 두께로 얇고 둥글게 슬라이스합니다. 너무 두꺼우면 라비올로 모양이 잘 안 잡혀요.',
      },
      {
        title: '데치기',
        description: '끓는 소금물에 30초만 살짝 데쳐 건집니다. 살짝 휘어질 정도로만 데쳐야, 다음 단계에서 접을 때 부서지지 않아요.',
        timerSeconds: 30,
        checkpoint: '슬라이스가 부드럽게 휘어지면 충분히 데쳐진 거예요.',
        warning: '오래 데치면 부서져서 속을 채울 수 없어요. 짧게만 데치세요.',
      },
      {
        title: '속 채우기',
        description: '크림치즈, 트러플 오일, 파마산을 섞어 감자 슬라이스 위에 짜고, 다른 슬라이스로 덮어 가장자리를 살짝 눌러 붙입니다.',
        tip: '가장자리에 물을 살짝 발라주면 더 잘 붙어요.',
      },
      {
        title: '마무리',
        description: '접시에 올려 트러플 오일을 뿌려 바로 냅니다.',
      },
    ],
    tips: ['대체 재료: 트러플 오일이 없으면 버섯향 오일로 대신해도 좋아요.', '보관/활용: 모양이 흐트러지기 쉬워 보관보다는 바로 먹는 걸 추천해요.'],
    youtubeQuery: '감자 라비올로 트러플',
  },
  {
    id: '6-1-chef-4', month: 6, title: '감자 크리스프와 사워크림 캐비어', subtitle: '한입에 즐기는 고급스러운 핑거푸드',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 40, servings: 4,
    platingGuide: '평평한 접시나 트레이에 크리스프를 한 줄로 가지런히 배열하고, 작은 스푼으로 사워크림과 캐비어를 정확히 중앙에 올려보세요. 균일한 배열 자체가 플레이팅이에요.',
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '바삭하게 구운 감자 크리스프 위에 사워크림과 캐비어를 올린, 파티 자리에 잘 어울리는 고급 핑거푸드예요.',
    masterclass: {
      chefIntro: '작은 한입이지만 만드는 과정엔 정성이 필요한 요리예요. 햇감자로 만들면 크리스프가 더 가볍고 바삭하게 구워져요.',
      ingredientSelection: '캐비어가 부담스럽다면 날치알이나 연어알로 대신해도 충분히 근사해요.',
      miseEnPlace: '감자 슬라이스를 미리 구워두고, 사워크림과 캐비어는 식탁에 내기 직전에 올리세요.',
      cookware: { recommended: '오븐 팬, 만돌린', alternatives: ['오븐이 없으면 팬에 기름을 적게 두르고 약불로 구워도 괜찮아요.'] },
      platingAndServing: '한 줄로 가지런히 배열하는 것 자체가 플레이팅이에요. 균일함이 핵심이에요.',
      pairing: '스파클링 와인이나 샴페인과 완벽하게 어울려요.',
      storageAndReheating: '크리스프만 따로 밀폐 보관하면 며칠 가능해요. 토핑은 먹기 직전에 올리세요.',
      leftoverIdeas: '크리스프만 남았다면 수프에 곁들여도 좋아요.',
      closingNote: '토핑은 손님 앞에서 올리는 것도 멋이에요. 보는 즐거움까지 대접해보세요.',
    },
    ingredients: [
      { name: '햇감자', amount: '2개' }, { name: '올리브오일', amount: '2큰술' }, { name: '사워크림', amount: '4큰술' }, { name: '캐비어(또는 날치알)', amount: '2큰술' }, { name: '차이브', amount: '약간' },
    ],
    steps: [
      {
        title: '슬라이스',
        description: '감자는 만돌린으로 2mm 두께로 둥글게 슬라이스합니다.',
      },
      {
        title: '굽기',
        description: '오븐 팬에 펼쳐 올리브오일을 바르고 200도에서 15분간 노릇하게 굽습니다. 가장자리가 살짝 들뜨고 진한 갈색이 돌면 바삭하게 구워진 신호예요.',
        timerSeconds: 900,
        checkpoint: '식혔을 때 딱딱하게 부서지는 소리가 나면 충분히 바삭한 거예요.',
        warning: '덜 구우면 식으면서 다시 물러져요. 색이 충분히 날 때까지 구워야 해요.',
      },
      {
        title: '토핑 올리기',
        description: '식힌 크리스프 위에 사워크림과 캐비어를 작은 스푼으로 정확히 올리고 차이브를 살짝 올립니다.',
        tip: '먹기 바로 직전에 토핑을 올려야 바삭함이 유지돼요.',
      },
    ],
    tips: ['대체 재료: 캐비어 대신 연어알이나 날치알도 잘 어울려요.', '보관/활용: 크리스프만 미리 구워두면 당일엔 토핑만 올리면 돼요.'],
    youtubeQuery: '감자 크리스프 캐비어',
  },
  {
    id: '6-1-chef-5', month: 6, title: '감자 무스와 콩소메 젤리', subtitle: '부드러운 무스와 투명한 젤리의 정교한 대비',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 90, servings: 4,
    platingGuide: '작은 유리잔이나 투명한 그릇에 무스를 먼저 채우고, 그 위에 콩소메 젤리를 살짝 부어 두 층이 보이게 하세요. 처빌 한 잎으로 마무리하면 단정해요.',
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '부드러운 감자 무스 위에 투명한 닭육수 젤리를 올린, 질감의 대비를 즐기는 모던 코스 요리예요.',
    masterclass: {
      chefIntro: '코스 요리의 한 접시처럼 구성한 메뉴예요. 부드러운 무스와 탱글한 젤리, 두 질감의 대비를 즐겨보세요.',
      ingredientSelection: '왁시 품종 감자가 무스를 매끈하게 만들기 좋아요.',
      miseEnPlace: '젤라틴은 미리 찬물에 불려두고, 콩소메(닭육수)는 맑게 우려서 식혀두세요.',
      cookware: { recommended: '블렌더, 작은 유리잔', alternatives: ['투명한 그릇이라면 어떤 것도 괜찮아요.'] },
      chefsNotes: '콩소메가 맑은 이유는 기름과 불순물을 충분히 걷어냈기 때문이에요. 거품을 꼼꼼히 걷어낼수록 투명도가 살아나요.',
      platingAndServing: '무스와 젤리, 두 층이 또렷하게 보이도록 투명한 그릇에 담는 게 핵심이에요.',
      pairing: '가벼운 스파클링 와인과 잘 어울려요.',
      storageAndReheating: '냉장 2일 이내로 드세요. 차갑게 먹는 요리라 데울 필요는 없어요.',
      leftoverIdeas: '남은 무스는 빵에 발라 먹어도 좋아요.',
      closingNote: '두 층을 깔끔하게 나누는 데 시간이 좀 걸려요. 급하지 않게, 차근차근 만들어보세요.',
    },
    ingredients: [
      { name: '햇감자', amount: '3개' }, { name: '생크림', amount: '100ml' }, { name: '버터', amount: '20g' }, { name: '닭육수(콩소메)', amount: '2컵' }, { name: '젤라틴', amount: '5g' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 무스',
        description: '감자를 삶아 곱게 으깨고 생크림, 버터와 함께 블렌더로 매끈하게 갑니다. 일반 으깬 감자보다 훨씬 가벼운 무스 질감을 목표로 하세요.',
        timerSeconds: 1200,
      },
      {
        title: '잔에 채우기',
        description: '식힌 무스를 잔의 절반 정도까지 채우고 냉장고에서 30분 굳힙니다.',
      },
      {
        title: '콩소메 젤리',
        description: '맑은 닭육수에 불린 젤라틴을 녹여 식힙니다. 너무 뜨거울 때 부으면 무스가 녹아 층이 섞여요.',
        warning: '뜨거운 젤리를 바로 부으면 무스 층이 무너져요. 체온 정도로 식힌 후 부으세요.',
        checkpoint: '숟가락으로 떠봤을 때 약간 걸쭉해지기 시작하면 부을 타이밍이에요.',
      },
      {
        title: '굳히기',
        description: '식힌 젤리를 무스 위에 조심스럽게 부어 다시 1시간 이상 냉장고에서 굳힙니다.',
        timerSeconds: 3600,
        checkpoint: '젤리가 탱글하게 흔들리는 정도면 완성이에요.',
      },
    ],
    tips: ['대체 재료: 콩소메가 어렵다면 맑은 야채육수로 대신해도 괜찮아요.', '보관/활용: 냉장 보관 2일 이내로 드세요.'],
    youtubeQuery: '감자 무스 콩소메 젤리',
  },
];

import { Recipe } from './types';

/**
 * 햇감자(6-1 시리즈) 4단계 컬렉션 보강.
 * 기존: home 1개, weekend 1개, world 1개, chef 1개(마스터클래스)
 * 추가: home +2, weekend +2, world +2(프랑스/인도), chef +1
 */
export const recipesPotatoExpansion: Recipe[] = [
  // ===== 데일리 홈쿡 =====
  {
    id: '6-1-home-2', month: 6, title: '감자조림', subtitle: '짭짤달콤한 기본 밑반찬',
    category: '반찬', difficulty: '아주 쉬움', level: 'home', cookTime: 25, servings: 3,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '간장양념에 졸여낸 감자조림은 어떤 반찬과도 잘 어울리는 한식 기본기예요.',
    ingredients: [
      { name: '햇감자', amount: '4개' }, { name: '간장', amount: '3큰술' }, { name: '설탕', amount: '1큰술' }, { name: '식용유', amount: '1큰술' }, { name: '다진마늘', amount: '1작은술' }, { name: '깨소금', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 썰기',
        description: '감자는 한입 크기로 깍둑썰기 합니다. 크기를 비슷하게 맞춰야 양념이 고르게 배고 익는 시간도 일정해져요.',
      },
      {
        title: '볶기',
        description: '기름에 감자를 먼저 2분 정도 볶아 겉을 코팅합니다. 양념을 바로 붓기 전에 겉면을 기름으로 한 번 감싸주면, 조리는 동안 감자가 쉽게 으스러지지 않아요.',
        timerSeconds: 120,
        checkpoint: '감자 겉면이 반투명하게 윤기가 돌면 다음 단계로 넘어가기 좋아요.',
      },
      {
        title: '졸이기',
        description: '물과 간장, 설탕을 넣고 중약불에서 국물이 자작해질 때까지 졸입니다. 다진마늘은 졸이는 중간에 넣어야 향이 끝까지 살아요.',
        timerSeconds: 600,
        checkpoint: '국물을 숟가락으로 떠봤을 때 또르륵 떨어지지 않고 표면에 윤기 있게 묻으면 다 된 거예요.',
        warning: '센불로 졸이면 감자 속까지 안 익었는데 국물만 먼저 졸아버려요. 중약불을 지켜주세요.',
        recoveryTip: '국물이 너무 빨리 졸았다면 물을 조금 더 붓고 약불로 마무리하세요.',
      },
      {
        title: '마무리',
        description: '깨소금을 뿌려 완성합니다.',
      },
    ],
    tips: [
      '꽈리고추를 더하면 칼칼한 맛이 더해져요.',
      '대체 재료: 간장 대신 굴소스를 살짝 섞으면 감칠맛이 깊어져요.',
      '보관/활용: 냉장 3~4일, 도시락 반찬으로도 좋아요.',
    ],
    youtubeQuery: '감자조림 만들기',
  },
  {
    id: '6-1-home-3', month: 6, title: '으깬 감자 샐러드', subtitle: '부드럽고 고소한 기본 샐러드',
    category: '샐러드', difficulty: '아주 쉬움', level: 'home', cookTime: 25, servings: 3,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '삶아 으깬 감자에 마요네즈와 채소를 더한, 누구나 좋아하는 기본 샐러드예요.',
    ingredients: [
      { name: '햇감자', amount: '4개' }, { name: '마요네즈', amount: '3큰술' }, { name: '오이', amount: '1/2개' }, { name: '당근', amount: '1/4개' }, { name: '소금, 후추', amount: '약간씩' },
    ],
    steps: [
      {
        title: '감자 삶기',
        description: '감자는 껍질째 삶아 부드러워지면 껍질을 벗기고 으깹니다. 껍질째 삶으면 삶는 동안 수분과 맛이 덜 빠져나가서 더 포슬포슬해져요.',
        timerSeconds: 1200,
        checkpoint: '꼬치로 찔렀을 때 스윽 들어가면 다 익은 거예요.',
      },
      {
        title: '채소 손질',
        description: '오이와 당근은 잘게 썰어 소금에 살짝 절였다가 물기를 짜냅니다. 물기를 빼야 샐러드가 질척해지지 않아요.',
      },
      {
        title: '버무리기',
        description: '으깬 감자가 따뜻할 때 채소와 마요네즈를 넣고 섞습니다. 따뜻할 때 섞어야 마요네즈가 더 고르게 스며들어요.',
        tip: '한 김 식힌 뒤 냉장고에 30분 두면 맛이 더 잘 어우러져요.',
      },
    ],
    tips: [
      '삶은 달걀을 더하면 더 든든해져요.',
      '대체 재료: 마요네즈 절반을 그릭요거트로 바꾸면 더 산뜻해져요.',
      '보관/활용: 냉장 보관 2일 이내로 드세요.',
    ],
    youtubeQuery: '감자 샐러드 만들기',
  },

  // ===== 주말 요리 =====
  {
    id: '6-1-weekend-2', month: 6, title: '감자 뇨끼', subtitle: '쫄깃한 식감을 직접 빚어내는 이탈리아식 파스타',
    category: '면요리', difficulty: '보통', level: 'weekend', cookTime: 80, servings: 3,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '감자와 밀가루로 반죽을 빚어 만드는 이탈리아식 면 요리예요. 손으로 직접 빚는 재미가 있어요.',
    ingredients: [
      { name: '햇감자', amount: '500g' }, { name: '밀가루', amount: '150g' }, { name: '달걀노른자', amount: '1개' }, { name: '소금', amount: '약간' }, { name: '버터', amount: '2큰술' }, { name: '세이지(선택)', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 삶고 으깨기',
        description: '감자는 껍질째 삶아 뜨거울 때 체에 곱게 내립니다. 뜨거울 때 작업해야 더 곱게 으깨지고, 식으면서 수분이 날아가 반죽이 질척해지지 않아요.',
        timerSeconds: 1200,
      },
      {
        title: '반죽하기',
        description: '으깬 감자에 밀가루, 달걀노른자, 소금을 넣고 가볍게 섞어 반죽합니다. 너무 오래 치대면 글루텐이 생겨 뇨끼가 질겨지니, 가루가 안 보일 때까지만 섞으세요.',
        warning: '많이 치댈수록 쫄깃해질 거라 생각하기 쉬운데, 뇨끼는 정반대예요. 가볍게 다뤄야 부드러워요.',
      },
      {
        title: '빚기',
        description: '반죽을 손가락 두께로 길게 굴려 한입 크기로 자르고, 포크로 살살 눌러 골을 냅니다. 골을 내면 소스가 더 잘 붙어요.',
      },
      {
        title: '삶기',
        description: '끓는 소금물에 뇨끼를 넣고 물 위로 떠오르면 30초 더 삶아 건집니다. 떠오르는 순간이 익었다는 가장 확실한 신호예요.',
        checkpoint: '뇨끼가 수면 위로 동동 떠오르면 거의 다 익은 거예요.',
        timerSeconds: 180,
      },
      {
        title: '버터향 입히기',
        description: '버터를 녹인 팬에 세이지와 함께 삶은 뇨끼를 넣고 살짝 볶아 향을 입힙니다.',
        tip: '버터가 갈색이 돌기 시작할 때(브라운버터) 넣으면 향이 훨씬 깊어져요.',
      },
    ],
    tips: [
      '대체 재료: 세이지가 없으면 로즈마리나 바질로 대신해도 좋아요.',
      '보관/활용: 빚은 뇨끼는 밀가루를 살짝 묻혀 냉동하면 한 달 정도 두고 먹을 수 있어요.',
    ],
    youtubeQuery: '감자 뇨끼 만들기',
  },
  {
    id: '6-1-weekend-3', month: 6, title: '크림 감자 수프', subtitle: '곱게 갈아 부드럽게 즐기는 주말 수프',
    category: '국&찌개', difficulty: '쉬움', level: 'weekend', cookTime: 50, servings: 3,
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '감자와 양파를 부드럽게 익혀 곱게 갈아낸, 따뜻하고 든든한 크림 수프예요.',
    ingredients: [
      { name: '햇감자', amount: '4개' }, { name: '양파', amount: '1개' }, { name: '버터', amount: '2큰술' }, { name: '치킨스톡(또는 물)', amount: '3컵' }, { name: '생크림', amount: '1/2컵' }, { name: '소금, 후추', amount: '약간씩' },
    ],
    steps: [
      {
        title: '양파 볶기',
        description: '버터에 양파를 약불로 투명해질 때까지 볶습니다. 색이 나기 전, 투명해지는 정도로만 볶아야 수프 색이 깨끗하게 나와요.',
        timerSeconds: 480,
      },
      {
        title: '끓이기',
        description: '감자와 스톡을 넣고 감자가 푹 익을 때까지 20분 정도 끓입니다.',
        timerSeconds: 1200,
        checkpoint: '포크로 감자를 눌렀을 때 별 힘 없이 부서지면 다 익은 거예요.',
      },
      {
        title: '블렌딩',
        description: '한 김 식힌 뒤 블렌더로 곱게 갑니다. 뜨거운 상태로 바로 갈면 압력 때문에 뚜껑이 튈 수 있어 꼭 한 김 식히고 가세요.',
        warning: '뜨거운 액체를 블렌더에 바로 갈면 위험해요. 반드시 식힌 후 작업하세요.',
      },
      {
        title: '마무리',
        description: '간 수프를 다시 데우며 생크림을 넣고 소금, 후추로 간을 맞춥니다.',
        tip: '차갑게 식혀 비시수아즈처럼 즐겨도 별미예요.',
      },
    ],
    tips: [
      '베이컨을 바삭하게 구워 올리면 풍미가 더 깊어져요.',
      '보관/활용: 냉장 3일, 냉동 한 달 가능해요. 데울 땐 약불에서 저어가며 데우세요.',
    ],
    youtubeQuery: '크림 감자수프 만들기',
  },

  // ===== 세계 요리 =====
  {
    id: '6-1-world-2', month: 6, title: '비시수아즈', subtitle: '프랑스의 차가운 감자·리크 수프',
    category: '국&찌개', difficulty: '쉬움', level: 'world', cookTime: 50, servings: 3,
    cuisineContext: {
      country: '프랑스',
      note: '비시수아즈는 프랑스 리크-감자 수프(포타주 파르망티에)를 차갑게 식혀 내는 방식으로, 20세기 초 미국 뉴욕의 한 프랑스 셰프가 더운 여름을 위해 개발했다고 알려져 있어요. 따뜻하게도, 차갑게도 즐길 수 있는 프랑스 가정식의 변주예요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '감자와 리크(서양대파)를 끓여 곱게 갈아 차갑게 식혀 먹는, 여름에 특히 잘 어울리는 프랑스식 수프예요.',
    ingredients: [
      { name: '햇감자', amount: '3개' }, { name: '리크(또는 대파)', amount: '2대' }, { name: '버터', amount: '2큰술' }, { name: '치킨스톡', amount: '3컵' }, { name: '생크림', amount: '1/3컵' }, { name: '차이브(선택)', amount: '약간' },
    ],
    steps: [
      {
        title: '리크 손질',
        description: '리크는 흰 부분만 얇게 썰어 찬물에 흔들어 씻습니다. 흙이 켜 사이에 많이 끼어 있어서, 흔들어 씻지 않으면 수프에서 모래알이 씹혀요.',
      },
      {
        title: '볶기',
        description: '버터에 리크를 약불로 투명해질 때까지 볶습니다. 색이 나지 않게, 향만 우러나도록 천천히 볶아주세요.',
        timerSeconds: 360,
      },
      {
        title: '끓이기',
        description: '감자와 스톡을 넣고 20분간 끓입니다.',
        timerSeconds: 1200,
        checkpoint: '감자가 포크로 쉽게 부서지면 다 된 거예요.',
      },
      {
        title: '블렌딩 후 식히기',
        description: '한 김 식힌 뒤 곱게 갈아 생크림을 섞고, 차갑게 식을 때까지 냉장고에 최소 2시간 둡니다. 비시수아즈는 차가워야 본연의 맛이 살아요.',
        warning: '덜 식은 채로 내면 풍미가 흐릿해요. 충분히 차가워질 때까지 기다려주세요.',
      },
    ],
    tips: [
      '차이브를 잘게 썰어 올리면 색과 향이 모두 살아나요.',
      '대체 재료: 리크가 없으면 대파 흰 부분으로 대신해도 비슷해요.',
      '보관/활용: 냉장 3일 이내로 드세요.',
    ],
    youtubeQuery: '비시수아즈 만들기',
  },
  {
    id: '6-1-world-3', month: 6, title: '알루 파라타', subtitle: '인도의 감자 속을 채운 납작빵',
    category: '브런치', difficulty: '보통', level: 'world', cookTime: 60, servings: 3,
    cuisineContext: {
      country: '인도',
      note: '알루 파라타는 인도 북부 펀자브 지방에서 즐겨 먹는 아침 식사 빵이에요. "알루"는 감자, "파라타"는 겹겹이 결을 살려 굽는 인도식 납작빵을 뜻해요. 요거트나 피클을 곁들여 아침으로 즐기는 대표적인 가정식이에요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '향신료로 양념한 감자 속을 채워 구운 인도식 납작빵으로, 인도 가정의 대표적인 아침 식사예요.',
    ingredients: [
      { name: '햇감자', amount: '3개' }, { name: '통밀가루(또는 밀가루)', amount: '2컵' }, { name: '쿠민가루', amount: '1작은술' }, { name: '고수(선택)', amount: '약간' }, { name: '청양고추', amount: '1개' }, { name: '식용유', amount: '적당량' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 속 만들기',
        description: '감자는 삶아 으깨고 쿠민가루, 다진 고추, 소금을 섞습니다. 향신료는 감자가 따뜻할 때 섞어야 향이 더 잘 배어들어요.',
        timerSeconds: 1200,
      },
      {
        title: '반죽하기',
        description: '통밀가루에 물과 소금을 넣어 부드러운 반죽을 만들고 10분 정도 휴지시킵니다. 휴지를 거치면 글루텐이 안정돼서 밀 때 잘 찢어지지 않아요.',
      },
      {
        title: '속 채우기',
        description: '반죽을 둥글게 펴고 가운데 감자 속을 넉넉히 올려 가장자리를 모아 봉합니다. 봉합한 자리를 위로 두고 다시 살짝 눌러 펴면 속이 고르게 퍼져요.',
        warning: '속을 너무 많이 넣으면 밀 때 터져요. 반죽보다 욕심을 줄이는 게 안전해요.',
      },
      {
        title: '밀어 굽기',
        description: '밀가루를 뿌려가며 동그랗게 밀고, 달군 팬에 기름을 살짝 두르고 양면을 노릇하게 굽습니다. 표면에 작은 갈색 점들이 군데군데 올라오면 잘 구워지고 있는 신호예요.',
        timerSeconds: 360,
        checkpoint: '눌렀을 때 부풀어 오르며 켜가 살짝 들뜨면 다 구워진 거예요.',
      },
    ],
    tips: [
      '요거트나 망고 피클을 곁들이면 정통 인도식으로 즐길 수 있어요.',
      '대체 재료: 통밀가루가 없으면 일반 밀가루로도 만들 수 있어요.',
      '보관/활용: 식은 파라타는 팬에 다시 데우면 부드러움이 돌아와요.',
    ],
    youtubeQuery: '알루 파라타 만들기',
  },

  // ===== 셰프 컬렉션 =====
  {
    id: '6-1-chef-2', month: 6, title: '버터 감자 퓌레', subtitle: '프랑스 미식가들이 사랑하는 압도적으로 부드러운 감자 요리',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 45, servings: 4,
    platingGuide: '접시에 숟가락 뒷면으로 둥글게 자국을 내듯 펴 담고, 중앙을 살짝 오목하게 만들어 버터 한 조각을 올려보세요. 녹아내리는 버터가 시각적으로도 풍미를 더해줘요. 차이브를 가늘게 썰어 흩뿌리면 마무리가 깔끔해요.',
    heroImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '햇감자', description: '프랑스의 전설적인 셰프 조엘 로뷰숑이 유명하게 만든, 감자와 버터의 비율이 거의 1:1에 가까운 압도적으로 부드러운 퓌레예요.',
    ingredients: [
      { name: '햇감자(왁시 품종)', amount: '1kg' }, { name: '버터(차가운 것)', amount: '250g' }, { name: '우유', amount: '150ml' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '감자 삶기',
        description: '감자는 껍질째 찬물에서부터 삶기 시작합니다. 찬물에서 시작해야 겉과 속이 동시에 익어서, 겉만 퍼지고 속은 안 익는 일이 없어요.',
        timerSeconds: 1800,
        checkpoint: '꼬치로 찔렀을 때 저항 없이 쑥 들어가면 다 익은 거예요.',
      },
      {
        title: '체에 내리기',
        description: '뜨거울 때 껍질을 벗기고 고운 체에 눌러 내립니다. 믹서로 갈면 전분 세포가 터지면서 끈적하게 변하는데, 체에 내리면 그 일이 없어서 입에서 사르르 녹는 질감이 나와요.',
        warning: '믹서나 푸드프로세서로 갈면 풀처럼 끈적해져요. 체에 내리는 수고를 아끼지 마세요.',
      },
      {
        title: '버터 넣기',
        description: '약불에 올린 감자에 차가운 버터를 조금씩 나눠 넣으며 계속 저어줍니다. 버터를 한 번에 넣으면 기름과 수분이 분리되는데, 조금씩 넣으면서 저어야 매끈하게 섞여요.',
        warning: '버터를 한꺼번에 넣으면 분리돼요. 작은 조각으로 나눠 천천히 섞으세요.',
        recoveryTip: '분리된 것처럼 보여도 불을 끄고 계속 세게 저으면 다시 매끈해지는 경우가 많아요.',
      },
      {
        title: '우유로 농도 맞추기',
        description: '따뜻하게 데운 우유를 조금씩 더해 원하는 농도로 맞춥니다.',
        checkpoint: '숟가락으로 떠서 기울였을 때 천천히 흘러내리는 정도가 적당해요.',
        tip: '소금은 마지막에 넣어야 간을 정확히 맞출 수 있어요.',
      },
    ],
    tips: [
      '버터를 덜 넣으면 일반적인 으깬 감자가 되지만, 이 요리의 매력은 그 풍부함에 있어요.',
      '대체 재료: 우유 대신 생크림을 쓰면 더 진한 맛이 나요.',
      '보관/활용: 갓 만들어 바로 먹는 게 가장 좋아요. 식으면 버터가 굳어 질감이 달라져요.',
    ],
    youtubeQuery: 'Pomme Puree 조엘 로뷰숑 감자 퓌레',
  },
];

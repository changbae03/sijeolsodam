import { Recipe } from './types';

/**
 * 4단계 컬렉션(home/weekend/world/chef) 확장 — 2차분.
 * 사과, 방울토마토, 오이에 weekend/world/chef 레시피를 각 1개씩 추가.
 * (감자는 이미 4단계 모두 완료됨)
 */
export const recipesLevelExpansion2: Recipe[] = [
  // ===== 사과 =====
  {
    id: 'apple-weekend-1', month: 10, title: '겹겹이 바삭한 사과 타르트', subtitle: '버터향 가득한 페이스트리에 담은 가을 사과',
    category: '디저트', difficulty: '보통', level: 'weekend', cookTime: 80, servings: 6,
    heroImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '사과', description: '버터를 켜켜이 접은 페이스트리 위에 사과를 얇게 펼쳐 구워낸, 주말에 시간 들여 만드는 디저트예요.',
    masterclass: {
      chefIntro: '사과타르트는 얇게 편 사과와 버터 향 페이스트리가 만나는 클래식 프렌치 디저트예요.',
      ingredientSelection: '사과는 단단하고 신맛이 있는 품종(아오리, 홍로)을 고르세요.',
      miseEnPlace: '페이스트리는 차가운 상태로 유지해 준비하세요.',
      cookware: { recommended: '오븐, 유산지', alternatives: ['따로 대체 도구는 없어요.'] },
      chefsNotes: '슬라이스 후 레몬물에 담가두면 갈변을 막고 산미가 더해져요.',
      platingAndServing: '살구잼을 데워 윗면에 발라주면 전문 베이커리처럼 윤기가 흘러요.',
      pairing: '아이스크림 한 스쿱을 곁들이면 온도 대비가 좋아요.',
      storageAndReheating: '식은 타르트는 다음날 오븐이나 에어프라이어에 데우면 바삭함이 돌아와요.',
      leftoverIdeas: '남으면 조각내어 도시락 디저트로 활용해도 좋아요.',
      closingNote: '페이스트리를 차갑게 유지하는 것이 이 타르트의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '사과', amount: '3개' }, { name: '냉동 페이스트리(또는 파이지)', amount: '1장' }, { name: '버터', amount: '30g' }, { name: '설탕', amount: '4큰술' }, { name: '계피가루', amount: '약간' },
    ],
    steps: [
      {
        title: '사과 슬라이스',
        description: '사과는 씨를 제거하고 최대한 얇게(2mm 정도) 슬라이스합니다. 얇아야 페이스트리와 함께 짧은 시간에 골고루 구워지면서, 부채처럼 겹쳐 깔았을 때 모양도 예쁘게 살아요.',
        tip: '슬라이스 후 레몬물에 담가두면 갈변도 막고, 살짝 산미가 더해져 단맛이 더 또렷해져요.',
      },
      {
        title: '페이스트리 깔기',
        description: '페이스트리는 차가운 상태로 펼쳐 가장자리를 살짝 접어 테두리를 만듭니다. 페이스트리가 미리 녹으면 버터층이 뭉개져서 구울 때 부풀지 않고 딱딱해져요. 작업은 최대한 빠르게 진행하세요.',
        warning: '반죽이 너무 오래 실온에 있으면 버터가 녹아 켜가 사라져요. 덥다고 느껴지면 잠깐 냉동실에 5분 넣었다가 다시 작업해요.',
      },
      {
        title: '사과 올리기',
        description: '슬라이스한 사과를 살짝 겹치게 부채모양으로 펼쳐 올리고 설탕, 계피가루를 골고루 뿌립니다.',
      },
      {
        title: '굽기',
        description: '버터를 녹여 사과 위에 붓고 200도로 예열한 오븐에서 25~30분 굽습니다. 페이스트리 가장자리가 부풀어 오르며 진한 황금빛이 돌고, 사과 끝이 살짝 그을린 듯 갈색이 되면 다 된 거예요.',
        timerSeconds: 1500,
        checkpoint: '페이스트리 바닥을 살짝 들어봤을 때 켜켜이 부풀어 바삭한 소리가 나면 잘 구워진 거예요.',
        tip: '굽고 나서 살구잼을 살짝 데워 윗면에 발라주면 전문 베이커리처럼 윤기가 흘러요.',
      },
    ],
    tips: [
      '아이스크림 한 스쿱을 곁들이면 따뜻한 타르트와 차가운 아이스크림의 대비가 좋아요.',
      '대체 재료: 페이스트리 대신 시판 파이지를 써도 괜찮아요.',
      '보관/활용: 식은 타르트는 다음날 오븐이나 에어프라이어에 다시 데우면 바삭함이 돌아와요.',
    ],
    youtubeQuery: '사과 타르트 만들기',
  },
  {
    id: 'apple-world-1', month: 10, title: '타르트 타탱', subtitle: '뒤집어서 완성하는 프랑스 캐러멜 사과 타르트',
    category: '디저트', difficulty: '보통', level: 'world', cookTime: 70, servings: 6,
    cuisineContext: {
      country: '프랑스',
      note: '타르트 타탱은 19세기 프랑스 라모트뵈브롱의 한 호텔을 운영하던 타탱 자매가 사과 타르트를 만들다 실수로 사과를 먼저 캐러멜화한 채 깜빡한 데서 시작됐다는 이야기가 전해져요. 결국 그 위에 반죽을 덮어 뒤집어 구운 것이 오늘날 프랑스의 대표 디저트가 됐어요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '사과', description: '사과를 버터와 설탕에 먼저 캐러멜화한 뒤 반죽을 덮어 구워, 뒤집어서 완성하는 프랑스의 전설적인 디저트예요.',
    masterclass: {
      chefIntro: '타르트 타탱은 캐러멜화한 사과 위에 반죽을 덮어 굽고 뒤집어 완성하는 프랑스 클래식이에요.',
      ingredientSelection: '사과는 단단한 품종(아오리, 홍로 등)을 고르세요.',
      miseEnPlace: '사과는 껍질을 벗겨 4등분해 준비하세요.',
      cookware: { recommended: '오븐용 팬(타탱팬)', alternatives: ['무쇠팬으로도 만들 수 있어요.'] },
      chefsNotes: '캐러멜을 너무 오래 끓이면 쓴맛이 나니 짙은 호박색이 되는 순간 바로 불에서 내려야 해요.',
      platingAndServing: '오븐에서 꺼낸 후 5분만 기다렸다가 자신 있게 한 번에 뒤집으세요.',
      pairing: '바닐라 아이스크림이나 크렘 프레슈를 곁들이는 게 프랑스식 정석이에요.',
      storageAndReheating: '실온에서도 맛있고, 냉장 보관 후 살짝 데워 먹어도 좋아요.',
      leftoverIdeas: '남으면 다음날 데워서 그대로 즐기세요.',
      closingNote: '뒤집는 타이밍이 이 디저트의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '사과', amount: '6개' }, { name: '버터', amount: '80g' }, { name: '설탕', amount: '150g' }, { name: '페이스트리(또는 파이지)', amount: '1장' },
    ],
    steps: [
      {
        title: '캐러멜 만들기',
        description: '팬에 버터와 설탕을 넣고 중불에서 녹입니다. 처음엔 설탕이 부슬부슬한 채로 녹다가, 점점 짙은 갈색으로 변하면서 고소한 캐러멜 냄새가 올라와요. 이 색과 냄새가 다음 단계로 넘어갈 신호예요.',
        warning: '캐러멜을 너무 오래 끓이면 쓴맛이 나요. 짙은 호박색이 되는 순간 바로 불에서 내려야 해요.',
      },
      {
        title: '사과 채우기',
        description: '사과는 껍질을 벗기고 4등분해 캐러멜 위에 빈틈없이 채워 담습니다. 둥글게 자른 면을 위로 가게 채우면, 나중에 뒤집었을 때 단면이 꽃처럼 정돈되어 보여요.',
        checkpoint: '사과를 채운 뒤 팬을 다시 약불에 5분 정도 올려 사과 가장자리가 캐러멜에 살짝 절여지듯 색이 배면 좋아요.',
      },
      {
        title: '반죽 덮기',
        description: '식힌 사과 위에 페이스트리를 덮고 가장자리를 팬 안쪽으로 살짝 밀어 넣습니다.',
      },
      {
        title: '굽기',
        description: '200도로 예열한 오븐에서 30~35분 굽습니다. 반죽이 진한 갈색으로 부풀고 가장자리에서 캐러멜이 보글보글 끓는 소리가 나면 다 된 거예요.',
        timerSeconds: 1900,
        tip: '오븐에서 꺼낸 후 5분만 기다렸다가 뒤집으세요. 너무 오래 식히면 캐러멜이 굳어서 팬에 들러붙어요.',
      },
      {
        title: '뒤집기',
        description: '접시를 팬 위에 덮고 단번에 뒤집습니다. 망설이면 캐러멜이 흘러내릴 수 있으니, 빠르고 자신있게 한 번의 동작으로 뒤집어야 해요.',
        warning: '뜨거운 캐러멜이 튈 수 있어 장갑을 꼭 끼고 뒤집으세요.',
      },
    ],
    tips: [
      '바닐라 아이스크림이나 크렘 프레슈를 곁들이는 게 프랑스식 정석이에요.',
      '대체 재료: 단단한 품종(아오리, 홍로 등)이 무르게 풀어지지 않아 더 잘 어울려요.',
      '보관/활용: 실온에서도 맛있고, 냉장 보관 후 살짝 데워 먹어도 좋아요.',
    ],
    youtubeQuery: 'Tarte Tatin 타르트 타탱',
  },
  {
    id: 'apple-chef-1', month: 10, title: '사과 밀푀유', subtitle: '얇게 겹친 사과로 완성하는 정교한 디저트',
    category: '디저트', difficulty: '보통', level: 'chef', cookTime: 60, servings: 4,
    platingGuide: '접시 중앙에 살짝 비스듬히 올리고, 옆에 바닐라 아이스크림 한 스쿱과 캐러멜 소스를 가늘게 한 줄 그어주세요. 위에 민트 잎이나 식용 금박을 살짝 올리면 한층 정교해 보여요.',
    heroImage: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '사과', description: '폼므 안나의 기법을 디저트에 적용해, 얇게 썬 사과를 겹겹이 눌러 구워 단면의 켜를 그대로 보여주는 정교한 디저트예요.',
    masterclass: {
      chefIntro: '이 디저트는 폼므 안나의 기법을 사과에 그대로 적용해, 얇은 켜가 압착되며 단면이 아름답게 드러나는 것이 핵심이에요.',
      ingredientSelection: '사과는 단단한 품종(아오리, 홍로, 부사)을 고르세요.',
      miseEnPlace: '사과는 만돌린으로 1.5mm 두께로 균일하게 슬라이스해 준비하세요.',
      cookware: { recommended: '작은 팬, 오븐', alternatives: ['따로 대체 도구는 없어요.'] },
      chefsNotes: '슬라이스 후 사과를 물에 씻지 마세요. 표면의 펙틴이 켜와 켜를 붙여주는 역할을 해요.',
      platingAndServing: '바닐라 아이스크림과 캐러멜소스를 곁들여 완성하세요.',
      pairing: '민트잎이나 식용 금박을 올리면 한층 정교해 보여요.',
      storageAndReheating: '따뜻할 때 가장 맛있지만, 식어도 켜 구조는 유지돼요.',
      leftoverIdeas: '다시 데울 땐 오븐이 좋아요.',
      closingNote: '무거운 것으로 눌러 켜를 압착시키는 것이 이 디저트의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '사과(단단한 품종)', amount: '4개' }, { name: '버터', amount: '60g' }, { name: '설탕', amount: '60g' }, { name: '계피가루', amount: '약간' },
    ],
    steps: [
      {
        title: '균일하게 슬라이스',
        description: '사과는 만돌린으로 1.5mm 두께로 아주 균일하게 슬라이스합니다. 폼므 안나와 같은 원리예요 — 두께가 일정해야 전체가 같은 속도로 익고, 뒤집었을 때 단면의 켜가 가지런하게 드러나요.',
        warning: '슬라이스 후 사과를 물에 씻지 마세요. 표면의 펙틴이 켜와 켜를 붙여주는 역할을 해요.',
      },
      {
        title: '팬에 쌓기',
        description: '작은 팬에 버터를 바르고, 사과를 한 장씩 겹치게 원을 그리며 깔아 5~6켜까지 쌓습니다. 켜마다 설탕과 계피가루를 살짝 뿌려주세요.',
        checkpoint: '첫 켜가 빈틈없이 덮여야 나중에 뒤집을 때 무너지지 않아요.',
      },
      {
        title: '눌러 굽기',
        description: '약불에서 무거운 것으로 누른 채 10분, 이후 180도 오븐에서 25분 더 굽습니다. 누르는 과정이 사과 사이 공기를 빼서 켜가 서로 단단히 압착되게 해줘요.',
        timerSeconds: 1500,
        checkpoint: '가장자리가 짙은 갈색으로 캐러멜화되고, 팬을 흔들었을 때 덩어리가 통째로 살짝 흔들리면 완성이에요.',
        tip: '버터와 설탕이 만나 가장자리부터 캐러멜라이즈되는데, 이 갈색이 단맛과 풍미를 동시에 끌어올려줘요.',
      },
      {
        title: '뒤집어 마무리',
        description: '접시를 덮어 단번에 뒤집습니다. 자신 있게 한 번의 동작으로 뒤집어야 켜가 무너지지 않아요.',
        tip: '뒤집기 전 5분 정도 살짝 식히면 더 안정적으로 뒤집을 수 있어요.',
      },
    ],
    tips: [
      '단단한 품종(아오리, 홍로, 부사)을 써야 켜가 무너지지 않아요.',
      '보관/활용: 따뜻할 때 가장 맛있지만, 식어도 켜 구조는 유지돼요. 다시 데울 땐 오븐이 좋아요.',
    ],
    youtubeQuery: '사과 밀푀유 디저트',
  },

  // ===== 방울토마토 =====
  {
    id: 'tomato-weekend-1', month: 6, title: '슬로우 토마토 파스타', subtitle: '오래 졸여 깊은 맛을 낸 토마토 소스 파스타',
    category: '면요리', difficulty: '보통', level: 'weekend', cookTime: 60, servings: 2,
    heroImage: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '방울토마토', description: '방울토마토를 오랜 시간 졸여 단맛과 산미를 끌어낸 소스로 완성하는, 시간을 들인 만큼 깊어지는 파스타예요.',
    masterclass: {
      chefIntro: '슬로우 토마토파스타는 방울토마토를 오래 졸여 감칠맛을 응축시키는, 시간이 만드는 파스타예요.',
      ingredientSelection: '방울토마토는 잘 익어 단맛이 진한 것을 고르세요.',
      miseEnPlace: '방울토마토는 꼭지를 떼고 반으로 잘라 준비하세요.',
      cookware: { recommended: '넓은 팬', alternatives: ['냄비로도 만들 수 있어요.'] },
      chefsNotes: '마늘은 옅은 황금빛이 도는 순간 멈춰야 쓴맛이 안 나요.',
      platingAndServing: '깊은 접시에 담고 바질을 올려 완성하세요.',
      pairing: '면수를 한두 숟갈 더하면 소스가 면에 더 매끄럽게 감겨요.',
      storageAndReheating: '소스만 따로 만들어 냉동해두면 바쁠 때 유용해요.',
      leftoverIdeas: '남으면 다음날 데워서 그대로 즐기세요.',
      closingNote: '40분 이상 천천히 졸이는 것이 이 파스타의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '방울토마토', amount: '500g' }, { name: '마늘', amount: '4쪽' }, { name: '양파', amount: '1/2개' }, { name: '올리브오일', amount: '4큰술' }, { name: '바질', amount: '5장' }, { name: '파스타면', amount: '200g' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '토마토 준비',
        description: '방울토마토는 꼭지를 떼고 반으로 자릅니다. 자른 단면이 팬에 직접 닿아야 수분이 빨리 증발하면서 졸이는 시간이 줄어들어요.',
      },
      {
        title: '향 내기',
        description: '올리브오일에 다진 마늘과 양파를 약불에서 천천히 볶아 향을 냅니다. 마늘이 갈색으로 타기 시작하면 쓴맛이 소스 전체에 퍼지니, 옅은 황금빛이 도는 순간 멈춰야 해요.',
        warning: '센불로 급하게 볶으면 마늘이 금방 타버려요. 마늘 향이 은은하게 퍼지는 정도로만 약불에서 볶으세요.',
      },
      {
        title: '졸이기',
        description: '토마토를 넣고 약불에서 40분 이상 천천히 졸입니다. 처음엔 토마토가 물러지며 수분이 흥건해지다가, 시간이 지날수록 수분이 졸아들면서 색이 짙어지고 소스가 걸쭉해지는 게 보여요.',
        timerSeconds: 2400,
        checkpoint: '숟가락으로 저었을 때 자국이 잠깐 남았다가 서서히 메워지는 점도가 되면 다 된 거예요.',
        tip: '소금을 졸이는 중간중간 조금씩 나눠 넣으면 토마토 단맛이 더 또렷하게 살아나요.',
      },
      {
        title: '면과 합치기',
        description: '삶은 파스타면을 소스에 넣고 1~2분 더 볶듯이 섞어 바질을 올려 마무리합니다.',
        tip: '면수를 한두 숟갈 더하면 소스가 면에 더 매끄럽게 감겨요.',
      },
    ],
    tips: [
      '대체 재료: 일반 토마토를 으깨서 써도 되지만, 방울토마토는 단맛이 더 진해 졸이는 시간이 짧아도 깊은 맛이 나요.',
      '보관/활용: 소스만 따로 만들어 냉동해두면 바쁠 때 면만 삶아 바로 완성할 수 있어요.',
    ],
    youtubeQuery: '슬로우 토마토소스 파스타',
  },
  {
    id: 'tomato-world-1', month: 6, title: '스페인식 가스파초', subtitle: '안달루시아의 차가운 토마토 수프',
    category: '국&찌개', difficulty: '쉬움', level: 'world', cookTime: 20, servings: 3,
    cuisineContext: {
      country: '스페인',
      note: '가스파초는 스페인 남부 안달루시아 지역에서 무더운 여름을 견디기 위해 발달한 차가운 수프예요. originally 농부들이 빵, 올리브오일, 채소로 간단히 만들어 먹던 음식이 오늘날 스페인을 대표하는 여름 요리로 자리잡았어요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '방울토마토', description: '잘 익은 토마토와 채소를 갈아 차갑게 즐기는 스페인 안달루시아의 여름 대표 수프예요.',
    masterclass: {
      chefIntro: '가스파초는 스페인 남부 농부들이 빵과 채소로 간단히 만들어 먹던 데서 시작된 차가운 수프예요.',
      ingredientSelection: '방울토마토는 잘 익어 즙이 풍부한 것을 고르세요.',
      miseEnPlace: '빵은 물에 살짝 불려 준비하세요.',
      cookware: { recommended: '블렌더, 체', alternatives: ['핸드블렌더로도 만들 수 있어요.'] },
      chefsNotes: '중간에 한 번 멈춰 올리브오일을 나눠 넣으면 식감이 더 부드러워져요.',
      platingAndServing: '먹기 전 올리브오일을 한 바퀴 더 두르고 채소를 고명으로 올리세요.',
      pairing: '쉐리식초가 있다면 스페인 정통의 산미를 낼 수 있어요.',
      storageAndReheating: '냉장 보관 시 2일 내로 드시는 게 가장 신선해요.',
      leftoverIdeas: '남으면 다음날 그대로 즐기세요.',
      closingNote: '최소 1시간 이상 차갑게 식히는 것이 이 수프의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '방울토마토', amount: '500g' }, { name: '오이', amount: '1/2개' }, { name: '피망', amount: '1/2개' }, { name: '마늘', amount: '1쪽' }, { name: '올리브오일', amount: '4큰술' }, { name: '식초(쉐리 식초 권장)', amount: '2큰술' }, { name: '빵(딱딱해진 것)', amount: '1쪽' },
    ],
    steps: [
      {
        title: '재료 손질',
        description: '토마토, 오이, 피망은 큼직하게 자르고 빵은 물에 살짝 불립니다. 빵을 더하는 게 스페인 가정식 가스파초의 핵심인데, 빵이 수프에 부드러운 농도와 약간의 든든함을 더해줘요.',
      },
      {
        title: '블렌딩',
        description: '모든 재료를 블렌더에 넣고 곱게 갈아줍니다. 한 번에 갈기보다, 중간에 한 번 멈춰서 올리브오일을 나눠 넣으면 마요네즈처럼 살짝 걸쭉하게 emulsify(유화)되면서 식감이 더 부드러워져요.',
        tip: '식초는 손맛에 맞춰 조절하세요. 쉐리 식초가 있다면 스페인 정통의 산미를 낼 수 있어요.',
      },
      {
        title: '체에 거르기(선택)',
        description: '고운 식감을 원하면 체에 한 번 걸러줍니다. 스페인 레스토랑에서는 매끈하게 거른 버전을 내는 경우가 많은데, 가정에서는 안 걸러도 충분히 맛있어요.',
      },
      {
        title: '냉장 보관',
        description: '최소 1시간 이상 냉장고에서 차갑게 식힙니다. 가스파초는 끓이는 요리가 아니라서, 충분히 차가워야 재료 본연의 맛과 청량감이 살아나요.',
        checkpoint: '살짝 떠서 맛봤을 때 산미, 단맛, 짠맛이 균형 있게 느껴지면 잘 만들어진 거예요.',
      },
    ],
    tips: [
      '먹기 전 올리브오일을 한 바퀴 더 두르고 잘게 썬 오이, 피망을 고명으로 올리면 더 근사해요.',
      '대체 재료: 빵이 없으면 생략해도 되지만, 농도가 묽어지니 토마토 양을 조금 줄여요.',
      '보관/활용: 냉장 보관 시 2일 내로 드시는 게 가장 신선해요.',
    ],
    youtubeQuery: '스페인 가스파초 만들기',
  },
  {
    id: 'tomato-chef-1', month: 6, title: '토마토 타르타르', subtitle: '정교한 칼질로 완성하는 비주얼 전채',
    category: '샐러드', difficulty: '보통', level: 'chef', cookTime: 30, servings: 2,
    platingGuide: '원형 무스링에 타르타르를 눌러 담아 모양을 잡은 뒤 조심스럽게 들어올리면 깔끔한 원통형이 나와요. 위에 바질오일을 點으로 찍듯 뿌리고, 마이크로그린이나 바질 잎 하나를 세워 꽂으면 레스토랑 플레이팅처럼 완성돼요.',
    heroImage: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '방울토마토', description: '토마토를 콩카세(껍질과 씨를 제거해 일정하게 써는 프랑스 기법)로 손질해 깔끔하게 완성하는 전채요리예요.',
    masterclass: {
      chefIntro: '토마토 타르타르는 콩카세 기법으로 손질한 토마토를 정교하게 쌓아내는 프랑스식 전채예요.',
      ingredientSelection: '방울토마토는 껍질이 얇고 잘 익은 것을 고르세요.',
      miseEnPlace: '토마토는 블랜칭해 껍질을 벗겨 준비하세요.',
      cookware: { recommended: '무스링, 예리한 칼', alternatives: ['둥근 컵으로 대신할 수 있어요.'] },
      chefsNotes: '씨와 속을 다 제거해야 수분이 적어 타르타르가 질척이지 않아요.',
      platingAndServing: '무스링에 채워 모양을 잡고 조심스럽게 들어올려 완성하세요.',
      pairing: '발사믹 글레이즈와 바질로 마무리하세요.',
      storageAndReheating: '만든 직후 바로 내는 게 가장 좋아요.',
      leftoverIdeas: '미리 만들어두면 수분이 나와 모양이 무너져요.',
      closingNote: '칼날을 톡톡 내려찍듯 써는 것이 이 타르타르의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '방울토마토', amount: '20개' }, { name: '샬롯(또는 양파)', amount: '1/4개' }, { name: '올리브오일', amount: '2큰술' }, { name: '발사믹 글레이즈', amount: '1큰술' }, { name: '바질', amount: '5장' }, { name: '소금, 후추', amount: '약간씩' },
    ],
    steps: [
      {
        title: '토마토 블랜칭',
        description: '토마토는 꼭지 반대편에 살짝 칼집을 내고 끓는 물에 10초, 바로 찬물에 옮깁니다. 이 급격한 온도 변화가 껍질과 속살 사이에 틈을 만들어줘서, 칼로 무리하게 벗기지 않고도 껍질이 스르륵 벗겨져요.',
        timerSeconds: 10,
        checkpoint: '찬물에 옮긴 토마토의 칼집 낸 부분 껍질이 살짝 들뜨면 벗기기 좋은 상태예요.',
      },
      {
        title: '콩카세',
        description: '껍질을 벗긴 토마토는 반으로 잘라 씨와 속을 숟가락으로 긁어내고, 과육만 일정한 작은 큐브 모양으로 썹니다. 씨를 제거해야 수분이 적어 타르타르가 질척이지 않고 깔끔한 모양을 유지해요.',
        tip: '칼을 누르듯 썰지 말고, 칼날을 톡톡 내려찍듯 썰어야 토마토 과육이 으깨지지 않고 깨끗한 큐브가 나와요.',
        warning: '씨와 속을 다 제거하지 않으면 수분이 많이 나와서 플레이팅했을 때 모양이 흘러내려요.',
      },
      {
        title: '양념',
        description: '잘게 썬 샬롯, 올리브오일, 소금, 후추를 넣고 가볍게 섞습니다. 마지막에 무치듯 섞으면 큐브 모양이 으깨지니, 포크로 가볍게 들어 올리듯 섞어주세요.',
      },
      {
        title: '플레이팅',
        description: '무스링에 채워 모양을 잡고 조심스럽게 들어올린 뒤, 발사믹 글레이즈와 바질로 마무리합니다.',
      },
    ],
    tips: [
      '대체 재료: 무스링이 없으면 둥근 컵이나 깡통의 위아래를 잘라내 대신 써도 돼요.',
      '보관/활용: 만든 직후 바로 내는 게 가장 좋아요. 미리 만들어두면 수분이 나와 모양이 무너져요.',
    ],
    youtubeQuery: '토마토 타르타르 콩카세',
  },

  // ===== 오이 =====
  {
    id: 'cucumber-weekend-1', month: 6, title: '오이 피클(딜 피클)', subtitle: '발효의 원리를 이해하며 만드는 홈메이드 피클',
    category: '반찬', difficulty: '보통', level: 'weekend', cookTime: 30, servings: 6,
    heroImage: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '오이', description: '식초물의 비율과 향신료의 조합을 제대로 이해하면서 만드는, 아삭함이 살아있는 홈메이드 피클이에요.',
    masterclass: {
      chefIntro: '오이피클은 절이는 시간과 피클물의 비율을 이해하면 실패 없이 만들 수 있는 발효 저장식품이에요.',
      ingredientSelection: '오이는 크기가 작고 가시가 살아있는 피클용을 고르세요.',
      miseEnPlace: '오이는 소금에 30분 절여 물기를 빼 준비하세요.',
      cookware: { recommended: '냄비, 유리병', alternatives: ['따로 대체 도구는 없어요.'] },
      chefsNotes: '식초를 너무 오래 끓이면 산미가 날아가니 설탕·소금이 녹으면 바로 불을 꺼요.',
      platingAndServing: '병째 상에 올려 덜어 드세요.',
      pairing: '향신료를 머스타드씨, 페퍼콘으로 바꾸면 또 다른 풍미가 나요.',
      storageAndReheating: '냉장 보관 시 2~3주까지 즐길 수 있어요.',
      leftoverIdeas: '국물도 버리지 말고 다른 피클이나 드레싱에 활용해보세요.',
      closingNote: '뜨거울 때 붓는 것이 이 피클의 보존력을 결정해요.',
    },
    ingredients: [
      { name: '오이', amount: '5개' }, { name: '식초', amount: '1컵' }, { name: '물', amount: '1컵' }, { name: '설탕', amount: '1/2컵' }, { name: '소금', amount: '2큰술' }, { name: '딜(또는 월계수잎)', amount: '2줄기' }, { name: '통후추, 마늘', amount: '약간씩' },
    ],
    steps: [
      {
        title: '오이 손질',
        description: '오이는 깨끗이 씻어 원하는 모양(통째, 또는 스틱)으로 자릅니다. 소금을 뿌려 30분 정도 절이면, 오이 속 수분이 미리 빠져나가서 피클물이 오이 안으로 더 깊게 스며들어요.',
        checkpoint: '절인 오이를 만졌을 때 살짝 휘어지는 정도로 숨이 죽으면 충분히 절여진 거예요.',
      },
      {
        title: '피클물 끓이기',
        description: '식초, 물, 설탕, 소금을 넣고 끓입니다. 설탕과 소금이 완전히 녹아 맑아지는 순간이 핵심이에요 — 덜 녹으면 piece들이 바닥에 가라앉아 단맛/짠맛이 고르게 퍼지지 않아요.',
        warning: '식초를 너무 오래 끓이면 산미가 날아가서 피클이 밍밍해져요. 설탕·소금이 녹으면 바로 불을 꺼요.',
      },
      {
        title: '담그기',
        description: '절인 오이를 소독한 병에 담고, 딜과 마늘, 통후추를 더한 뒤 뜨거운 피클물을 부어 밀봉합니다. 뜨거울 때 부어야 병 안의 공기가 빠지면서 진공 비슷한 효과로 보존력이 좋아져요.',
        tip: '병을 가득 채우지 말고 위쪽에 약간의 공간을 남기면 발효 과정에서 압력이 덜 차요.',
      },
      {
        title: '숙성',
        description: '실온에서 하루 식힌 뒤 냉장고로 옮겨 최소 2~3일 숙성시킵니다. 시간이 지날수록 오이 속까지 새콤달콤한 맛이 배어드는데, 1주일쯥 지나면 가장 맛있는 균형을 이뤄요.',
      },
    ],
    tips: [
      '향신료를 머스타드씨, 페퍼콘으로 바꾸면 또 다른 풍미가 나요.',
      '보관/활용: 냉장 보관 시 2~3주까지 즐길 수 있어요. 국물도 버리지 말고 다른 피클이나 드레싱에 활용해보세요.',
    ],
    youtubeQuery: '오이 피클 만들기',
  },
  {
    id: 'cucumber-world-1', month: 6, title: '차지키(그릭 오이 요거트 디핑)', subtitle: '그리스·튀르키예의 여름 대표 소스',
    category: '반찬', difficulty: '아주 쉬움', level: 'world', cookTime: 15, servings: 4,
    cuisineContext: {
      country: '그리스·튀르키예',
      note: '차지키는 그리스에서는 차지키, 튀르키예에서는 자즉이라 불리며 지중해와 중동 일대에서 폭넓게 즐기는 요거트 소스예요. 그릴에 구운 고기나 피타빵에 곁들이거나, 그 자체로 더운 여름철 입맛을 식혀주는 음식으로도 즐겨요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '오이', description: '오이와 그릭 요거트, 마늘, 딜로 만드는 시원하고 산뜻한 지중해식 디핑 소스예요.',
    masterclass: {
      chefIntro: '차지키는 그리스와 튀르키예에서 두루 즐기는, 오이의 수분을 빼는 것이 핵심인 요거트 소스예요.',
      ingredientSelection: '그릭요거트는 수분이 적고 꾸덕한 것을 고르세요.',
      miseEnPlace: '오이는 채 썰거나 갈아 소금에 절여 물기를 빼 준비하세요.',
      cookware: { recommended: '면포, 볼', alternatives: ['따로 대체 도구는 없어요.'] },
      chefsNotes: '물기를 충분히 안 짜면 다음 날 물이 분리되니 면포에 싸서 꽉 짜는 게 확실해요.',
      platingAndServing: '그릇에 담아 올리브오일을 두르세요.',
      pairing: '그릴드 치킨이나 라마 케밥에 곁들이면 정통 지중해식 한 끼가 완성돼요.',
      storageAndReheating: '냉장 보관 시 2~3일 내로 드세요.',
      leftoverIdeas: '시간이 지날수록 마늘향이 강해져요.',
      closingNote: '오이 물기를 빼는 것이 이 소스의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '오이', amount: '1개' }, { name: '그릭 요거트', amount: '1컵' }, { name: '마늘', amount: '1쪽' }, { name: '올리브오일', amount: '1큰술' }, { name: '딜(또는 민트)', amount: '약간' }, { name: '레몬즙', amount: '1작은술' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '오이 물기 빼기',
        description: '오이는 채 썰거나 갈아서 소금을 살짝 뿌리고 10분 정도 둔 뒤 물기를 꼭 짜냅니다. 이 과정을 건너뛰면 오이 수분이 요거트에 섞여 소스가 묽어지고 금방 물이 생겨요.',
        warning: '물기를 충분히 안 짜면 만든 다음 날 바로 물이 분리돼요. 면포에 싸서 꽉 짜는 게 가장 확실해요.',
      },
      {
        title: '섞기',
        description: '그릭 요거트에 물기 뺀 오이, 다진 마늘, 올리브오일, 레몬즙을 넣고 섞습니다. 그릭 요거트는 일반 요거트보다 수분이 적어서 더 꾸덕한 질감을 만들어주는데, 이게 차지키 특유의 농도예요.',
        tip: '마늘을 너무 많이 넣으면 다음날까지 향이 강하게 남아요. 한 쪽으로 시작해서 입맛에 맞게 늘려보세요.',
      },
      {
        title: '향 더하기',
        description: '딜이나 민트를 다져서 더하고 소금으로 간을 맞춥니다. 지중해권에서는 딜을 많이 쓰지만, 민트로 바꾸면 좀 더 청량한 느낌이 나요.',
      },
      {
        title: '숙성',
        description: '최소 30분 냉장고에서 맛이 어우러지게 둡니다. 갓 섞었을 때보다 시간이 지나면 마늘과 허브 향이 요거트에 자연스럽게 배어들어요.',
      },
    ],
    tips: [
      '그릴드 치킨이나 라마 케밥에 곁들이면 정통 지중해식 한 끼가 완성돼요.',
      '대체 재료: 그릭 요거트가 없으면 일반 요거트를 면포에 걸러 수분을 빼고 써도 비슷해요.',
      '보관/활용: 냉장 보관 시 2~3일 내로 드세요. 시간이 지날수록 마늘향이 강해져요.',
    ],
    youtubeQuery: '차지키 만들기 그릭 요거트',
  },
  {
    id: 'cucumber-chef-1', month: 6, title: '오이 리본 롤 with 게살 무스', subtitle: '얇게 깎은 오이로 감싸는 정교한 전채',
    category: '샐러드', difficulty: '보통', level: 'chef', cookTime: 40, servings: 4,
    platingGuide: '롤을 비스듬히 잘라 단면이 보이게 세워 담고, 접시에 오이즙을 살짝 발라 베이스를 만들어주세요. 게살 무스 색과 오이의 초록이 대비되도록 흰 접시를 쓰면 색이 또렷하게 살아나요. 캐비어나 날치알을 한 점 올리면 포인트가 돼요.',
    heroImage: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '오이', description: '오이를 얇게 리본처럼 깎아 부드러운 게살 무스를 말아낸, 손이 많이 가지만 비주얼이 화려한 전채요리예요.',
    masterclass: {
      chefIntro: '오이 리본 롤은 채소를 얇게 깎아 무스를 마는, 정교한 손기술이 필요한 화려한 전채예요.',
      ingredientSelection: '오이는 곧고 굵기가 일정한 것을 고르세요.',
      miseEnPlace: '오이는 채칼로 길게 리본 모양으로 밀어 준비하세요.',
      cookware: { recommended: '채칼 또는 감자칼, 짤주머니', alternatives: ['따로 대체 도구는 없어요.'] },
      chefsNotes: '씨가 있는 중심부는 너무 얇아서 부서지기 쉬우니 그 전까지만 리본으로 쓰세요.',
      platingAndServing: '롤을 비스듬히 잘라 단면이 보이게 세워 담으세요.',
      pairing: '캐비어나 날치알을 한 점 올리면 포인트가 돼요.',
      storageAndReheating: '미리 만들어 냉장 보관 후 손님 오기 직전에 자르세요.',
      leftoverIdeas: '남으면 다음날 그대로 즐기세요.',
      closingNote: '오이 두께를 일정하게 미는 것이 이 롤의 완성도를 결정해요.',
    },
    ingredients: [
      { name: '오이', amount: '2개' }, { name: '게살(또는 크래미)', amount: '150g' }, { name: '크림치즈', amount: '50g' }, { name: '생크림', amount: '2큰술' }, { name: '레몬즙', amount: '약간' }, { name: '소금, 후추', amount: '약간씩' },
    ],
    steps: [
      {
        title: '오이 리본 만들기',
        description: '오이는 채칼이나 감자칼로 길게 세로로 얇게 밀어 리본 모양으로 깎습니다. 압력을 일정하게 주는 게 핵심이에요 — 힘이 들쭉날쭉하면 두께가 안 맞아서 나중에 롤이 고르게 안 말려요.',
        warning: '씨가 있는 중심부는 너무 얇아서 끝까지 가면 부서지기 쉬워요. 씨 부분 전까지만 리본으로 쓰고 나머지는 다른 용도로 남겨두세요.',
      },
      {
        title: '게살 무스',
        description: '게살은 잘게 찢어 크림치즈, 생크림, 레몬즙과 함께 부드럽게 섞습니다. 생크림을 더하면 농도가 묽어지면서 짤주머니로 짜기 좋은 질감이 되는데, 이게 롤 안에 채울 때 모양을 깔끔하게 잡아줘요.',
        tip: '짤주머니에 채워서 짜면 손으로 채우는 것보다 훨씬 일정한 두께로 채울 수 있어요.',
      },
      {
        title: '말기',
        description: '오이 리본 위에 무스를 가늘게 짜고, 끝에서부터 돌려 말아 롤을 만듭니다. 너무 헐겁게 말면 안에서 풀어지고, 너무 꽉 말면 오이가 찢어지니 적당한 힘으로 한 번에 부드럽게 돌려야 해요.',
        checkpoint: '말아놓은 롤이 스스로 형태를 유지하면서 살짝 탄력 있게 눌러지면 잘 말린 거예요.',
      },
      {
        title: '냉장 후 플레이팅',
        description: '롤을 15분 정도 냉장고에 두면 모양이 더 단단하게 잡혀서, 칼로 자를 때 단면이 깨끗하게 나와요.',
      },
    ],
    tips: [
      '대체 재료: 게살 대신 훈제연어나 새우살을 곱게 다져 써도 잘 어울려요.',
      '보관/활용: 미리 만들어 냉장 보관 후 손님 오기 직전에 자르면 신선하고 깔끔하게 낼 수 있어요.',
    ],
    youtubeQuery: '오이 리본 롤 전채요리',
  },
];

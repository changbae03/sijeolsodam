import { Recipe } from './types';

/**
 * 4단계 컬렉션 확장 — 3차분.
 * KAMIS 9개 핵심 식재료 중 weekend/world/chef가 비어있던 5개
 * (무, 알배추, 배, 고구마, 딸기)에 각 1개씩 추가해 4단계 출발선을 맞춤.
 * (감자/사과/방울토마토/오이는 이미 1개씩 갖춰져 있음)
 */
export const recipesLevelExpansion3: Recipe[] = [
  // ===== 무 =====
  {
    id: 'radish-weekend-1', month: 11, title: '갈비 무조림', subtitle: '갈비 육수를 가득 머금은 묵직한 주말 조림',
    category: '메인', difficulty: '보통', level: 'weekend', cookTime: 90, servings: 4,
    heroImage: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '무', description: '소갈비와 무를 함께 오래 졸여, 무가 갈비 육수를 가득 머금어 깊은 맛을 내는 주말 메인 요리예요.',
    ingredients: [
      { name: '소갈비', amount: '600g' }, { name: '무', amount: '1/2개' }, { name: '간장', amount: '5큰술' }, { name: '설탕', amount: '2큰술' }, { name: '다진마늘', amount: '1큰술' }, { name: '대파', amount: '1대' }, { name: '배', amount: '1/4개(또는 사과)' },
    ],
    steps: [
      {
        title: '갈비 핏물 빼기',
        description: '갈비는 찬물에 1시간 정도 담가 핏물을 뺍니다. 핏물이 남아있으면 졸이는 동안 잡내가 올라와서 조림 전체에 퍼져요.',
        checkpoint: '물을 따라냈을 때 핏물 색이 더 안 나오면 충분히 뺀 거예요.',
      },
      {
        title: '데치기',
        description: '갈비를 끓는 물에 한 번 데쳐 찬물에 헹굽니다. 겉면의 불순물과 기름기가 하얗게 굳어 떠오르는데, 이걸 헹궈내야 국물이 맑게 우러나요.',
        timerSeconds: 300,
        warning: '데치는 물을 그대로 졸임 육수로 쓰면 불순물이 그대로 남아요. 새 물로 다시 시작하세요.',
      },
      {
        title: '졸이기',
        description: '데친 갈비에 물을 넉넉히 붓고 간장양념과 배를 넣어 40분 끓인 뒤, 큼직하게 썬 무를 더해 30분 더 졸입니다.',
        timerSeconds: 2400,
        checkpoint: '갈비를 젓가락으로 찔렀을 때 쑥 들어가고, 무가 살짝 부서질 정도로 부드러워지면 다 된 거예요.',
        tip: '배(또는 사과)를 갈아 넣으면 천연 효소가 고기를 더 부드럽게 만들어줘요.',
      },
      {
        title: '마무리',
        description: '대파를 넣고 국물이 자작해질 때까지 5분 더 졸여 완성합니다.',
        timerSeconds: 300,
      },
    ],
    tips: [
      '하루 묵혀서 다시 데우면 양념이 더 깊게 배어들어요.',
      '대체 재료: 소갈비 대신 돼지갈비로도 비슷하게 만들 수 있어요.',
      '보관/활용: 냉장 4~5일, 냉동 한 달 정도 가능해요. 국물에 당면을 넣어 끓이면 또 다른 한 끼가 돼요.',
    ],
    youtubeQuery: '갈비 무조림 만들기',
  },
  {
    id: 'radish-world-1', month: 11, title: '후로후키 다이콘', subtitle: '일본 가정식의 정수, 부드럽게 익힌 무에 된장소스',
    category: '메인', difficulty: '쉬움', level: 'world', cookTime: 60, servings: 3,
    cuisineContext: {
      country: '일본',
      note: '후로후키 다이콘은 일본 가정식과 가이세키 요리에서 흔히 만나는 메뉴로, 무를 다시육수에 오래 끓여 부드럽게 만든 뒤 달콤한 미소소스를 얹어 먹어요. 추운 계절 일본 가정의 식탁에 자주 오르는, 검소하지만 정성이 들어간 요리예요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '무', description: '다시육수에 오래 끓여 속까지 부드러워진 무에 달콤한 일본식 미소소스를 얹어 먹는 정갈한 요리예요.',
    ingredients: [
      { name: '무', amount: '1/2개' }, { name: '다시마육수', amount: '4컵' }, { name: '쌀(뜸물용)', amount: '2큰술' }, { name: '백된장(또는 일반 된장)', amount: '3큰술' }, { name: '설탕', amount: '2큰술' }, { name: '맛술', amount: '1큰술' },
    ],
    steps: [
      {
        title: '무 손질',
        description: '무는 3~4cm 두께로 두툼하게 썰어 모서리를 둥글게 깎아냅니다(면취). 모서리를 깎으면 오래 끓여도 부서지지 않고 모양이 유지돼요.',
      },
      {
        title: '뜸물에 데치기',
        description: '쌀을 약간 푼 물에 무를 넣고 부드러워질 때까지 데칩니다. 쌀뜨물의 전분이 무의 쓴맛과 매운맛을 흡착해서 빼줘요.',
        timerSeconds: 900,
        checkpoint: '대꼬치로 찔렀을 때 가운데까지 쑥 들어가면 충분히 데쳐진 거예요.',
      },
      {
        title: '다시육수에 끓이기',
        description: '데친 무를 다시육수에 넣고 약불에서 20분 더 끓입니다. 약불로 천천히 끓여야 무에 다시의 감칠맛이 서서히 배어들어요.',
        timerSeconds: 1200,
        warning: '센불로 끓이면 무 표면이 으스러져요. 약불을 꼭 지켜주세요.',
      },
      {
        title: '미소소스 만들기',
        description: '백된장, 설탕, 맛술을 작은 냄비에 넣고 약불에서 윤기가 날 때까지 졸입니다.',
        tip: '백된장이 없으면 일반 된장에 설탕을 조금 더 넣어 단맛을 보완하면 비슷하게 낼 수 있어요.',
      },
    ],
    tips: [
      '유자껍질을 살짝 갈아 올리면 향이 한층 살아나요.',
      '대체 재료: 다시마육수가 없으면 멸치육수로도 만들 수 있어요.',
      '보관/활용: 무와 육수를 따로 냉장 보관하면 3일 정도 두고 먹을 수 있어요.',
    ],
    youtubeQuery: '후로후키 다이콘 만들기',
  },
  {
    id: 'radish-chef-1', month: 11, title: '시어드 스캘럽과 무 콩포트', subtitle: '단맛 머금은 무와 관자의 정교한 조화',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 50, servings: 2,
    platingGuide: '넓은 흰 접시에 무 콩포트를 한 스푼 자국 내듯 펴 바르고, 그 위에 시어드한 관자를 비스듬히 2~3개 올려주세요. 버터소스를 점점이 뿌리고 차이브나 처빌을 살짝 올리면 색의 대비가 살아나요.',
    heroImage: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '무', description: '버터에 졸여 단맛을 끌어낸 무 위에 겉은 바삭하고 속은 부드러운 관자를 올린, 정교한 프렌치 스타일 전채예요.',
    ingredients: [
      { name: '무', amount: '1/3개' }, { name: '관자', amount: '6개' }, { name: '버터', amount: '40g' }, { name: '생크림', amount: '2큰술' }, { name: '소금, 후추', amount: '약간씩' }, { name: '레몬즙', amount: '약간' },
    ],
    steps: [
      {
        title: '관자 준비',
        description: '관자는 키친타올로 물기를 완전히 제거합니다. 표면이 젖어 있으면 팬에 닿는 순간 수분이 증발하며 온도가 떨어져서, 갈색 크러스트가 생기지 않아요.',
        warning: '관자를 씻은 후 그대로 구우면 절대 바삭한 크러스트가 안 생겨요. 반드시 완전히 말려야 해요.',
      },
      {
        title: '무 콩포트',
        description: '무는 얇게 채 썰어 버터에 약불로 천천히 졸입니다. 수분이 빠져나오며 점점 투명해지고 부드러워지는데, 이 과정에서 단맛이 농축돼요.',
        timerSeconds: 900,
        checkpoint: '무가 거의 으깨질 정도로 부드러워지고 색이 옅은 황금빛으로 변하면 완성이에요.',
        tip: '생크림을 마지막에 살짝 더하면 부드러운 윤기와 풍미가 더해져요.',
      },
      {
        title: '관자 시어링',
        description: '팬을 충분히 달군 뒤 관자를 올려 한쪽당 1분 30초씩만 굽습니다.',
        timerSeconds: 90,
        checkpoint: '관자 옆면 아래쪽 1/3 정도가 진한 갈색 크러스트로 변하면 뒤집을 때예요.',
        warning: '너무 오래 구우면 속까지 단단하게 익어 질겨져요. 겉만 바삭하고 속은 살짝 덜 익은 상태가 가장 좋아요.',
      },
      {
        title: '플레이팅',
        description: '관자를 구운 팬에 레몬즙을 살짝 더해 풍미를 살린 뒤, 콩포트 위에 관자를 올려 마무리합니다.',
      },
    ],
    tips: [
      '대체 재료: 관자가 부담스럽다면 새우로 대신해도 비슷한 요리를 만들 수 있어요.',
      '보관/활용: 관자는 신선할 때 바로 먹는 게 가장 좋아요. 콩포트만 따로 만들어 다른 요리에도 활용할 수 있어요.',
    ],
    youtubeQuery: '시어드 스캘럽 무 콩포트',
  },

  // ===== 알배추 =====
  {
    id: 'cabbage-weekend-1', month: 11, title: '배추 만두', subtitle: '꽉 찬 속을 빚어내는 손이 많이 가는 주말 요리',
    category: '메인', difficulty: '보통', level: 'weekend', cookTime: 90, servings: 4,
    heroImage: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '알배추', description: '배추를 듬뿍 넣어 채소의 단맛이 살아있는 만두를 직접 빚어 즐기는, 정성이 필요한 주말 요리예요.',
    ingredients: [
      { name: '알배추', amount: '1/2통' }, { name: '돼지고기(다짐육)', amount: '200g' }, { name: '두부', amount: '1/2모' }, { name: '만두피', amount: '40장' }, { name: '다진마늘', amount: '1큰술' }, { name: '참기름', amount: '1큰술' }, { name: '소금, 후추', amount: '약간씩' },
    ],
    steps: [
      {
        title: '배추 절이기',
        description: '배추는 잘게 썰어 소금에 20분 절인 뒤 물기를 꽉 짭니다. 물기를 충분히 빼지 않으면 만두 속이 질척해져서 만두피가 터지기 쉬워요.',
        checkpoint: '두 손으로 꽉 쥐어 짰을 때 물이 더 안 나오면 충분히 짠 거예요.',
        warning: '이 단계를 대충 하면 나중에 만두를 찔 때 속에서 물이 흘러나와요.',
      },
      {
        title: '두부 물기 빼기',
        description: '두부는 면포에 싸서 꽉 짜 물기를 제거합니다.',
      },
      {
        title: '속 만들기',
        description: '배추, 두부, 돼지고기, 다진마늘, 참기름, 소금, 후추를 한 방향으로 치대듯 섞습니다. 한 방향으로 치대면 단백질 섬유가 엉기면서 점성이 생겨, 익었을 때 찰진 식감이 나요.',
        tip: '속을 미리 한 숟갈 떠서 전자레인지에 살짝 익혀 맛을 보면 간을 미리 조절할 수 있어요.',
      },
      {
        title: '빚기',
        description: '만두피에 속을 넣고 가장자리에 물을 살짝 발라 붙입니다. 속을 너무 많이 넣으면 벌어지기 쉬우니 절반 정도만 채우는 게 적당해요.',
        warning: '가장자리에 양념이 묻으면 물이 잘 안 붙어서 찔 때 터져요.',
      },
      {
        title: '찌기',
        description: '찜기에 면포를 깔고 만두를 간격을 두어 올려 12분간 찝니다. 만두피가 투명해지면서 속이 살짝 비쳐 보이면 다 익은 신호예요.',
        timerSeconds: 720,
      },
    ],
    tips: [
      '한 번에 다 못 먹으면 빚은 채로 냉동해두고 필요할 때 바로 쪄도 좋아요.',
      '대체 재료: 돼지고기 대신 다진 새우살을 섞으면 더 산뜻한 맛이 나요.',
      '보관/활용: 남은 만두는 다음날 만둣국으로 끓여도 맛있어요.',
    ],
    youtubeQuery: '배추 만두 빚기',
  },
  {
    id: 'cabbage-world-1', month: 11, title: '독일식 자우어크라우트', subtitle: '발효의 과학을 이해하며 만드는 독일 전통 절임',
    category: '반찬', difficulty: '보통', level: 'world', cookTime: 40, servings: 6,
    cuisineContext: {
      country: '독일',
      note: '자우어크라우트는 독일을 비롯한 중북부 유럽에서 겨울을 나기 위해 양배추를 발효시켜 만든 저장 음식이에요. 소시지나 슈바인스브라텐 곁에 곁들이는 독일 가정식의 핵심 사이드 디시로, 발효로 겨울에도 비타민C를 섭취하게 한 선조들의 지혜가 담긴 음식이에요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '알배추', description: '배추(또는 양배추)를 소금에 절여 자연 발효시켜 만드는 독일의 대표 전통 절임이에요.',
    ingredients: [
      { name: '알배추(또는 양배추)', amount: '1통' }, { name: '소금', amount: '배추 무게의 2%' }, { name: '캐러웨이씨(선택)', amount: '1작은술' },
    ],
    steps: [
      {
        title: '배추 채 썰기',
        description: '배추는 최대한 가늘게 채 썰어줍니다. 가늘수록 표면적이 넓어져서 소금이 수분을 더 효율적으로 끌어내고, 발효도 더 고르게 진행돼요.',
      },
      {
        title: '소금 비비기',
        description: '배추 무게의 2%에 해당하는 소금을 골고루 뿌려 손으로 꽉꽉 눌러 비빕니다. 소금이 너무 적으면 유해균이 자라기 쉽고, 너무 많으면 발효균까지 억제돼요.',
        checkpoint: '비비는 동안 배추에서 물이 흥건하게 나오기 시작하면 잘 진행되고 있는 거예요.',
      },
      {
        title: '눌러 담기',
        description: '소독한 병이나 용기에 배추를 꽉꽉 눌러 담아 배추즙이 배추를 완전히 덮도록 합니다.',
        warning: '배추가 공기 중에 노출되면 부패로 이어질 수 있어요. 무거운 것으로 눌러 즙 아래 잠기게 유지하세요.',
      },
      {
        title: '발효',
        description: '실온(18~22도)에서 1~2주 발효시킵니다. 시간이 지나며 거품이 보글보글 올라오고 새콤한 향이 점점 진해지는데, 젖산균이 활발하게 활동하고 있다는 신호예요.',
        checkpoint: '적당히 새콤하면서 아삭한 식감이 살아있으면 완성이에요.',
      },
    ],
    tips: [
      '캐러웨이씨를 더하면 좀 더 정통 독일식 향이 나요.',
      '대체 재료: 한국 배추로도 만들 수 있어요. 다만 더 부드러워서 식감이 조금 달라요.',
      '보관/활용: 발효가 끝나면 냉장 보관하며 천천히 즐기세요. 소시지, 으깬 감자와 함께 먹으면 좋아요.',
    ],
    youtubeQuery: '자우어크라우트 만들기',
  },
  {
    id: 'cabbage-chef-1', month: 11, title: '배추 두부롤 with 들깨 크림소스', subtitle: '한식 재료를 정교한 기법으로 재해석한 요리',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 50, servings: 3,
    platingGuide: '롤을 비스듬히 잘라 단면이 보이게 세워 담고, 들깨 크림소스를 접시에 한 줄 그어 베이스로 깔아주세요. 위에 통들깨를 살짝 뿌리고 미나리 잎 한 장을 올리면 정갈하게 마무리돼요.',
    heroImage: 'https://images.unsplash.com/photo-1604908554007-31ea36970bdb?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '알배추', description: '데친 배추잎으로 두부와 채소를 말아 만든 롤에 고소한 들깨 크림소스를 곁들인, 한식 재료를 서양식 플레이팅으로 풀어낸 요리예요.',
    ingredients: [
      { name: '알배추', amount: '8장(겉잎)' }, { name: '두부', amount: '1모' }, { name: '당근', amount: '1/4개' }, { name: '들깻가루', amount: '3큰술' }, { name: '생크림', amount: '100ml' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '배추잎 데치기',
        description: '배추 겉잎을 끓는 물에 살짝 데쳐 찬물에 헹굽니다. 줄기 두꺼운 부분은 칼등으로 살짝 두드려 펴주면 말 때 갈라지지 않아요.',
        checkpoint: '잎이 부드럽게 휘어지면서 색이 짙은 초록으로 변하면 적당히 데쳐진 거예요.',
        warning: '너무 오래 데치면 말 때 찢어져요. 숨만 죽이는 정도로 짧게 데치세요.',
      },
      {
        title: '속 준비',
        description: '두부는 물기를 짜서 으깨고, 당근은 곱게 다져 가볍게 볶아 소금으로 간합니다.',
      },
      {
        title: '말기',
        description: '데친 배춧잎에 속을 넣고 김밥처럼 꽉 말아줍니다. 일정한 힘으로 끝까지 말아 마무리는 잎으로 안쪽을 감싸듯 정리하세요.',
        checkpoint: '말린 롤이 손에서 놓아도 풀리지 않고 형태를 유지하면 잘 말린 거예요.',
      },
      {
        title: '찌기',
        description: '찜기에 롤을 올려 8분간 찝니다.',
        timerSeconds: 480,
      },
      {
        title: '들깨 크림소스',
        description: '생크림에 들깻가루를 풀어 약불에서 살짝 데웁니다. 들깨가 충분히 녹아들면서 고소한 향이 올라오면 소금으로 간을 맞춰 완성합니다.',
        tip: '들깻가루는 미리 마른 팬에 살짝 볶아 쓰면 향이 더 진해져요.',
      },
    ],
    tips: [
      '대체 재료: 당근 대신 표고버섯을 다져 넣어도 향이 깊어져요.',
      '보관/활용: 찐 롤은 냉장 보관 후 다시 찌거나 살짝 구워 데우면 좋아요.',
    ],
    youtubeQuery: '배추 두부롤 들깨소스',
  },

  // ===== 배 =====
  {
    id: 'pear-weekend-1', month: 9, title: '배 고르곤졸라 샐러드', subtitle: '단맛과 짠맛의 균형을 배우는 주말 샐러드',
    category: '샐러드', difficulty: '쉬움', level: 'weekend', cookTime: 25, servings: 2,
    heroImage: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '배', description: '달콤한 배와 짭짤한 고르곤졸라 치즈, 견과류의 식감이 어우러진 균형 잡힌 샐러드예요.',
    ingredients: [
      { name: '배', amount: '1개' }, { name: '루꼴라', amount: '한줌' }, { name: '고르곤졸라 치즈', amount: '50g' }, { name: '호두', amount: '한줌' }, { name: '꿀', amount: '1큰술' }, { name: '발사믹 식초', amount: '1큰술' }, { name: '올리브오일', amount: '2큰술' },
    ],
    steps: [
      { title: '배 손질', description: '배는 씨를 제거하고 얇게 슬라이스합니다. 너무 두꺼우면 한입에 먹기 불편해요.' },
      {
        title: '호두 굽기',
        description: '마른 팬에 호두를 약불로 2~3분 살짝 볶습니다. 생호두보다 살짝 구운 호두가 향이 훨씬 진해지고 식감도 바삭해져요.',
        timerSeconds: 150,
        checkpoint: '고소한 냄새가 올라오기 시작하면 충분히 볶아진 거예요. 더 오래 두면 금방 타니 주의하세요.',
      },
      { title: '드레싱', description: '꿀, 발사믹 식초, 올리브오일을 섞어 드레싱을 만듭니다. 단맛, 산미, 부드러움의 균형이 핵심이니 맛을 보며 비율을 조절하세요.' },
      {
        title: '플레이팅',
        description: '루꼴라를 깔고 배, 고르곤졸라, 구운 호두를 올린 뒤 드레싱을 뿌려 완성합니다.',
        tip: '치즈는 손으로 부숴서 올리면 더 자연스럽게 보여요.',
      },
    ],
    tips: [
      '고르곤졸라가 부담스러우면 더 부드러운 브리치즈로 대체해도 좋아요.',
      '보관/활용: 드레싱과 채소는 따로 보관하고 먹기 직전에 섞어야 채소가 숨이 죽지 않아요.',
    ],
    youtubeQuery: '배 고르곤졸라 샐러드',
  },
  {
    id: 'pear-world-1', month: 9, title: '푸아레 (와인에 절인 배)', subtitle: '프랑스의 우아한 디저트, 와인에 천천히 데운 배',
    category: '디저트', difficulty: '쉬움', level: 'world', cookTime: 50, servings: 4,
    cuisineContext: {
      country: '프랑스',
      note: '푸아레(Poire Pochée)는 배를 레드와인과 향신료에 천천히 데워 만드는 프랑스의 클래식 디저트예요. 와인의 색이 배에 곱게 물들어 우아한 비주얼 덕분에 격식 있는 저녁 식사의 디저트로도 자주 등장해요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '배', description: '레드와인과 시나몬, 정향에 배를 천천히 데워 붉은 빛과 향이 깊게 배어들게 만드는 프랑스 디저트예요.',
    ingredients: [
      { name: '배(단단한 것)', amount: '4개' }, { name: '레드와인', amount: '2컵' }, { name: '설탕', amount: '1/2컵' }, { name: '시나몬스틱', amount: '1개' }, { name: '정향', amount: '3개' }, { name: '레몬껍질', amount: '약간' },
    ],
    steps: [
      { title: '배 손질', description: '배는 껍질을 벗기고 꼭지는 그대로 살려둡니다. 꼭지를 남겨두면 플레이팅했을 때 더 우아하게 보여요.' },
      { title: '시럽 끓이기', description: '레드와인, 설탕, 시나몬스틱, 정향, 레몬껍질을 끓입니다. 향신료 향이 와인에 충분히 우러나면 배 속까지 천천히 스며들 준비가 된 거예요.', timerSeconds: 300 },
      {
        title: '데치기',
        description: '배를 시럽에 넣고 약불에서 20~25분 천천히 익힙니다. 흰 속살이 점점 옅은 자주빛으로 물들어가는 게, 와인 향이 스며들고 있다는 가장 확실한 신호예요.',
        timerSeconds: 1500,
        checkpoint: '나무꼬치로 찔렀을 때 가운데까지 부드럽게 들어가면 다 익은 거예요.',
        warning: '센불로 끓이면 표면이 뭉개지고 색도 고르게 안 들어요. 약불을 유지하세요.',
      },
      {
        title: '시럽 졸이기',
        description: '배를 건져낸 뒤 남은 시럽만 따로 졸여 농도를 더 진하게 만듭니다.',
        tip: '졸인 시럽을 배에 끼얹으면 윤기가 살아나면서 비주얼이 좋아져요.',
      },
    ],
    tips: [
      '바닐라 아이스크림이나 마스카포네 크림을 곁들이면 프랑스 레스토랑 느낌이 나요.',
      '대체 재료: 레드와인이 부담스럽다면 포도주스로 대체해도 비슷한 색과 향을 낼 수 있어요.',
      '보관/활용: 시럽에 담긴 채로 냉장 보관하면 4~5일 정도 두고 먹을 수 있어요.',
    ],
    youtubeQuery: 'Poire Pochée 와인에 절인 배',
  },
  {
    id: 'pear-chef-1', month: 9, title: '배 카르파치오 with 고르곤졸라 발사믹', subtitle: '얇게 저민 배로 완성하는 정교한 전채',
    category: '샐러드', difficulty: '보통', level: 'chef', cookTime: 25, servings: 2,
    platingGuide: '넓은 접시에 배 슬라이스를 꽃잎처럼 겹쳐 원형으로 펼쳐 담고, 고르곤졸라를 작은 점들로 올려주세요. 발사믹 글레이즈를 가늘게 지그재그로 뿌리고 처빌이나 어린 루꼴라 잎을 중앙에 올리면 완성도가 올라가요.',
    heroImage: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '배', description: '배를 카르파치오처럼 투명하게 얇게 저며 고르곤졸라와 발사믹으로 마무리한, 단맛과 짠맛이 정교하게 균형 잡힌 전채요리예요.',
    ingredients: [
      { name: '배(단단한 것)', amount: '1개' }, { name: '고르곤졸라 치즈', amount: '40g' }, { name: '발사믹 글레이즈', amount: '1큰술' }, { name: '올리브오일', amount: '1큰술' }, { name: '소금, 후추', amount: '약간씩' }, { name: '잣 또는 호두', amount: '약간' },
    ],
    steps: [
      {
        title: '배 슬라이스',
        description: '배는 씨 부분을 피해 만돌린으로 1mm 두께로 아주 얇게 슬라이스합니다. 너무 두꺼우면 카르파치오 특유의 사르르 녹는 느낌과 멀어져요.',
        warning: '배가 너무 무르면 얇게 썰다가 부서져요. 살짝 단단한 배를 골라야 깨끗한 슬라이스가 나와요.',
      },
      {
        title: '갈변 방지',
        description: '슬라이스한 배는 레몬즙을 살짝 발라줍니다. 배의 효소가 공기와 만나면 갈변이 시작되는데, 레몬즙의 산이 이 효소 작용을 늦춰줘요.',
      },
      { title: '플레이팅', description: '접시에 배를 겹쳐가며 원형으로 펼쳐 담고, 고르곤졸라를 작게 떼어 점점이 올립니다.' },
      {
        title: '마무리',
        description: '올리브오일과 발사믹 글레이즈를 뿌리고 소금, 후추, 견과류를 올려 완성합니다.',
        tip: '발사믹 글레이즈가 없다면 발사믹 식초를 약불에 졸여 직접 만들 수 있어요.',
      },
    ],
    tips: [
      '대체 재료: 고르곤졸라가 강하게 느껴지면 부드러운 브리치즈로 대체해도 좋아요.',
      '보관/활용: 미리 썰어두면 갈변이 시작되니, 손님 오기 직전에 슬라이스하는 게 가장 좋아요.',
    ],
    youtubeQuery: '배 카르파치오 만들기',
  },

  // ===== 고구마 =====
  {
    id: 'sweetpotato-weekend-1', month: 10, title: '고구마 그라탕', subtitle: '겹겹이 쌓아 구운 달콤하고 고소한 주말 메인',
    category: '메인', difficulty: '보통', level: 'weekend', cookTime: 70, servings: 4,
    heroImage: 'https://images.unsplash.com/photo-1635348722099-83ada9f6e2da?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '고구마', description: '얇게 썬 고구마를 크림소스와 함께 겹겹이 쌓아 구운, 달콤하고 고소한 맛이 살아있는 그라탕이에요.',
    ingredients: [
      { name: '고구마', amount: '600g' }, { name: '생크림', amount: '250ml' }, { name: '우유', amount: '150ml' }, { name: '그뤼에르(또는 모짜렐라) 치즈', amount: '80g' }, { name: '마늘', amount: '1쪽' }, { name: '소금, 후추, 넛맥', amount: '약간씩' },
    ],
    steps: [
      {
        title: '고구마 슬라이스',
        description: '고구마는 껍질을 벗기고 2mm 두께로 균일하게 슬라이스합니다. 고구마는 당도가 높아서, 두께가 일정하지 않으면 얇은 부분이 먼저 타버려요.',
        warning: '슬라이스 후 물에 오래 담가두면 단맛이 빠져나가요. 바로 조리하는 게 좋아요.',
      },
      { title: '크림소스', description: '생크림, 우유, 으깬 마늘, 넛맥을 약불에서 데웁니다. 고구마 자체가 단맛이 강하니, 소스는 살짝 짭짤하게 간해야 단짠 균형이 맞아요.' },
      { title: '쌓기', description: '오븐 용기에 고구마를 겹쳐 깔고 소스를 부어가며 2~3켜 쌓고 치즈를 올립니다.' },
      {
        title: '굽기',
        description: '180도로 예열한 오븐에서 40~45분 굽습니다. 표면이 짙은 갈색으로 변하고 가장자리에서 보글보글 끓는 소리가 나면 다 익은 신호예요.',
        timerSeconds: 2400,
        checkpoint: '꼬치로 찔렀을 때 부드럽게 들어가면 완성이에요.',
        tip: '표면이 덜 노릇하면 마지막에 그릴 모드로 2~3분만 더 돌리면 색이 확 살아나요.',
      },
    ],
    tips: [
      '계피가루를 살짝 더하면 고구마의 단맛과 잘 어울리는 향이 더해져요.',
      '보관/활용: 냉장 보관 후 에어프라이어에 데우면 표면이 다시 바삭해져요.',
    ],
    youtubeQuery: '고구마 그라탕 만들기',
  },
  {
    id: 'sweetpotato-world-1', month: 10, title: '아메리칸 스위트포테이토 캐서롤', subtitle: '추수감사절 식탁의 주인공, 마시멜로를 올린 달콤한 캐서롤',
    category: '메인', difficulty: '쉬움', level: 'world', cookTime: 60, servings: 6,
    cuisineContext: {
      country: '미국',
      note: '스위트포테이토 캐서롤은 미국 추수감사절과 크리스마스 식탁에 빠지지 않는 대표 사이드 디시예요. 으깬 고구마 위에 마시멜로를 올려 구워내는 독특한 조합은 20세기 초 미국에서 시작돼, 오늘날까지 명절의 상징적인 메뉴로 자리잡았어요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1635348722099-83ada9f6e2da?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '고구마', description: '으깬 고구마에 버터와 향신료를 더하고 마시멜로를 올려 구워낸, 달콤하고 독특한 미국 명절 음식이에요.',
    ingredients: [
      { name: '고구마', amount: '700g' }, { name: '버터', amount: '50g' }, { name: '흑설탕', amount: '3큰술' }, { name: '계피가루', amount: '1작은술' }, { name: '바닐라 익스트랙(선택)', amount: '1작은술' }, { name: '마시멜로', amount: '1봉(200g)' },
    ],
    steps: [
      { title: '고구마 삶기', description: '고구마는 큼직하게 썰어 부드러워질 때까지 삶거나 찝니다. 포크로 쉽게 으깨질 정도로 푹 익혀야 매끈하게 으깨져요.', timerSeconds: 1200 },
      {
        title: '으깨기',
        description: '익힌 고구마에 버터, 흑설탕, 계피가루, 바닐라를 넣고 곱게 으깹니다. 따뜻할 때 으깨야 버터가 잘 녹아들면서 더 부드러운 질감이 나와요.',
        tip: '핸드믹서나 감자압착기를 쓰면 덩어리 없이 훨씬 부드럽게 으깰 수 있어요.',
      },
      { title: '담기', description: '으깬 고구마를 오븐 용기에 평평하게 펴 담습니다.' },
      {
        title: '마시멜로 올려 굽기',
        description: '마시멜로를 빈틈없이 올리고 180도 오븐에서 10~15분, 마시멜로가 노릇해질 때까지 굽습니다.',
        timerSeconds: 720,
        checkpoint: '마시멜로 윗부분이 캠프파이어에서 구운 것처럼 얼룩덜룩한 갈색이 되면 딱 좋은 상태예요.',
        warning: '눈을 떼면 순식간에 타버려요. 마지막 몇 분은 오븐 앞에서 계속 지켜보세요.',
      },
    ],
    tips: [
      '견과류(피칸, 호두)를 다져서 토핑으로 올리면 텍스처가 더 풍부해져요.',
      '보관/활용: 으깬 고구마 베이스만 미리 만들어 냉장 보관해두면 당일엔 굽기만 하면 돼요.',
    ],
    youtubeQuery: 'Sweet Potato Casserole 미국식 고구마 캐서롤',
  },
  {
    id: 'sweetpotato-chef-1', month: 10, title: '고구마 퓌레와 시어드 두부', subtitle: '부드러운 퓌레 위에 바삭하게 구운 두부를 올린 정교한 메인',
    category: '메인', difficulty: '보통', level: 'chef', cookTime: 55, servings: 2,
    platingGuide: '고구마 퓌레를 숟가락 뒷면으로 접시에 둥글게 스미어 자국을 내고, 시어드한 두부를 비스듬히 올려주세요. 캐러멜소스를 점으로 몇 방울 떨어뜨리고 차이브를 잘게 썰어 흩뿌리면 색감이 살아나요.',
    heroImage: 'https://images.unsplash.com/photo-1635348722099-83ada9f6e2da?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '고구마', description: '곱게 간 고구마 퓌레 위에 겉은 바삭하고 속은 부드러운 두부를 올려, 단순한 재료를 정교한 기법으로 완성한 메인 요리예요.',
    ingredients: [
      { name: '고구마', amount: '400g' }, { name: '두부(부침용)', amount: '1모' }, { name: '버터', amount: '30g' }, { name: '생크림', amount: '3큰술' }, { name: '전분', amount: '2큰술' }, { name: '소금', amount: '약간' },
    ],
    steps: [
      {
        title: '두부 물기 빼기',
        description: '두부는 키친타올로 감싸 무거운 것으로 눌러 20분간 물기를 뺍니다. 수분이 충분히 빠져야 구울 때 겉면이 바삭하게 잘 구워져요.',
        warning: '물기를 덜 빼면 전분을 묻혀도 막이 제대로 안 생겨서 바삭한 크러스트가 안 나와요.',
      },
      {
        title: '고구마 퓌레',
        description: '고구마는 푹 삶아 체에 곱게 내린 뒤 버터, 생크림을 넣고 매끈하게 섞습니다. 체에 내려야 실크처럼 부드러운 식감이 나와요.',
        tip: '약불에 올려 수분을 한 번 더 날리면 농도가 더 진해지고 풍미도 응축돼요.',
      },
      {
        title: '두부 구이',
        description: '물기 뺀 두부에 전분을 얇게 입혀 기름을 두른 팬에 굽습니다. 전분이 수분과 만나 얇은 막을 만들면서 바삭한 크러스트로 변해요.',
        timerSeconds: 360,
        checkpoint: '가장자리가 짙은 황금색으로 변하고, 팬에서 들어올렸을 때 표면이 단단하게 느껴지면 완성이에요.',
      },
      { title: '플레이팅', description: '퓌레를 접시에 깔고 구운 두부를 올려 마무리합니다.' },
    ],
    tips: [
      '대체 재료: 두부 대신 닭가슴살이나 흰살생선으로도 같은 구조의 요리를 만들 수 있어요.',
      '보관/활용: 퓌레는 따로 냉장 보관해 다른 요리의 베이스로도 활용할 수 있어요.',
    ],
    youtubeQuery: '고구마 퓌레 두부 스테이크',
  },

  // ===== 딸기 =====
  {
    id: 'strawberry-weekend-1', month: 4, title: '딸기 타르트', subtitle: '바삭한 타르트지에 올린 신선한 봄 딸기',
    category: '디저트', difficulty: '보통', level: 'weekend', cookTime: 80, servings: 6,
    heroImage: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '딸기', description: '바삭하게 구운 타르트지 위에 부드러운 커스터드 크림과 신선한 딸기를 올린, 손이 많이 가지만 그만큼 보람 있는 디저트예요.',
    ingredients: [
      { name: '타르트지', amount: '1개' }, { name: '딸기', amount: '300g' }, { name: '달걀노른자', amount: '3개' }, { name: '설탕', amount: '60g' }, { name: '우유', amount: '300ml' }, { name: '전분', amount: '20g' }, { name: '살구잼(광택용, 선택)', amount: '2큰술' },
    ],
    steps: [
      {
        title: '타르트지 굽기',
        description: '타르트지를 틀에 깔고 포크로 바닥에 구멍을 낸 뒤 180도에서 15분 굽습니다. 구멍을 내야 안에서 생기는 수증기가 빠져나가 바닥이 평평하게 구워져요.',
        timerSeconds: 900,
        checkpoint: '가장자리가 노릇한 갈색이 되면 충분히 구워진 거예요.',
      },
      {
        title: '커스터드 크림',
        description: '달걀노른자와 설탕을 섞고 전분을 더한 뒤, 데운 우유를 천천히 부어가며 섞습니다. 한 번에 부으면 노른자가 갑자기 익어 덩어리지니, 조금씩 부으세요.',
        warning: '센불로 급하게 끓이면 달걀이 스크램블처럼 덩어리져요. 약불에서 계속 저어가며 천천히 익혀야 해요.',
      },
      {
        title: '크림 졸이기',
        description: '약불에서 계속 저어가며 걸쭉해질 때까지 끓입니다.',
        checkpoint: '숟가락 자국이 잠깐 남았다가 서서히 메워지는 점도가 되면 다 된 거예요.',
      },
      {
        title: '조립',
        description: '식힌 타르트지에 크림을 채우고 딸기를 보기 좋게 올립니다.',
        tip: '살구잼을 살짝 데워 딸기 위에 발라주면 윤기가 흐르면서 마르는 것도 막아줘요.',
      },
    ],
    tips: [
      '커스터드 크림은 하루 전에 미리 만들어 냉장 보관해두면 당일 조립만 하면 돼요.',
      '대체 재료: 커스터드 크림이 부담스러우면 휘핑크림으로 대체해도 충분히 맛있어요.',
      '보관/활용: 딸기를 올린 후엔 그날 안에 먹는 게 가장 좋아요.',
    ],
    youtubeQuery: '딸기 타르트 만들기',
  },
  {
    id: 'strawberry-world-1', month: 4, title: '일본식 딸기 쇼트케이크', subtitle: '일본 크리스마스의 상징, 폭신한 스펀지와 생크림 케이크',
    category: '디저트', difficulty: '보통', level: 'world', cookTime: 100, servings: 6,
    cuisineContext: {
      country: '일본',
      note: '딸기 쇼트케이크는 일본에서 크리스마스 시즌 가장 사랑받는 케이크예요. 서양의 비스킷 베이스 쇼트케이크와 달리, 일본식은 폭신한 스펀지케이크에 가벼운 생크림과 딸기를 켜켜이 쌓은 형태로 독자적으로 발전했어요.',
    },
    heroImage: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '딸기', description: '폭신한 스펀지케이크에 가벼운 생크림과 신선한 딸기를 켜켜이 쌓은, 일본의 대표적인 딸기 디저트예요.',
    ingredients: [
      { name: '달걀', amount: '4개' }, { name: '설탕', amount: '120g' }, { name: '박력분', amount: '120g' }, { name: '버터(녹인 것)', amount: '30g' }, { name: '생크림', amount: '400ml' }, { name: '딸기', amount: '400g' },
    ],
    steps: [
      {
        title: '달걀 거품 내기',
        description: '달걀과 설탕을 따뜻한 물에 받쳐 거품기로 충분히 휘핑합니다. 따뜻하게 데워서 휘핑하면 표면장력이 약해져서 공기를 더 많이 머금어요 — 이게 일본식 스펀지가 가볍고 폭신한 이유예요.',
        checkpoint: '거품기를 들어올렸을 때 리본처럼 흘러내리며 자국이 잠시 남으면 충분히 휘핑된 거예요.',
      },
      {
        title: '가루 섞기',
        description: '체 친 박력분을 나누어 넣고 주걱으로 가볍게 섞습니다. 거품이 꺼지지 않게 아래에서 위로 떠올리듯 섞는 게 핵심이에요.',
        warning: '너무 세게 섞으면 공기가 빠져나가 스펀지가 가라앉아요. 가루가 보이지 않을 때까지만 섞으세요.',
      },
      {
        title: '굽기',
        description: '녹인 버터를 살짝 섞어 틀에 부어 170도에서 25분 굽습니다.',
        timerSeconds: 1500,
        checkpoint: '가운데를 눌렀을 때 탄력 있게 되돌아오고, 꼬치로 찔렀을 때 반죽이 묻어나오지 않으면 완성이에요.',
      },
      {
        title: '조립',
        description: '식힌 스펀지를 가로로 2~3등분해 생크림과 딸기를 켜켜이 쌓고, 겉면도 생크림으로 매끈하게 발라 마무리합니다.',
        tip: '생크림은 부드럽게 흐르는 정도(soft peak)로 휘핑해야 바르기 좋고 갈라지지 않아요.',
      },
    ],
    tips: [
      '딸기는 비슷한 크기로 골라야 단면을 잘랐을 때 보기 좋게 나와요.',
      '대체 재료: 박력분이 없으면 일반 밀가루에 전분을 약간 섞어 대신할 수 있어요.',
      '보관/활용: 냉장 보관 후 2~3일 내로 드세요. 시간이 지날수록 빵이 마르기 쉬워요.',
    ],
    youtubeQuery: '일본식 딸기 쇼트케이크 만들기',
  },
  {
    id: 'strawberry-chef-1', month: 4, title: '딸기 콩소메와 바질', subtitle: '맑게 거른 딸기 본연의 맛을 보여주는 모던 디저트',
    category: '디저트', difficulty: '보통', level: 'chef', cookTime: 40, servings: 2,
    platingGuide: '투명한 유리잔이나 넓은 접시에 콩소메를 살짝만 부어 바닥이 보이게 하고, 가운데에 작게 썬 신선한 딸기 조각을 쌓아 올려주세요. 바질 새싹잎을 살짝 올리면 향과 색이 함께 살아나요.',
    heroImage: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
    mainIngredient: '딸기', description: '딸기를 곱게 갈아 맑게 걸러낸 콩소메(투명한 육수)에 바질 향을 더한, 딸기 본연의 맛을 가장 순수하게 느낄 수 있는 모던 디저트예요.',
    ingredients: [
      { name: '딸기', amount: '500g' }, { name: '설탕', amount: '40g' }, { name: '레몬즙', amount: '1작은술' }, { name: '바질잎', amount: '5장' },
    ],
    steps: [
      { title: '딸기 갈기', description: '딸기는 설탕, 레몬즙과 함께 블렌더에 곱게 갑니다. 설탕이 딸기의 수분을 끌어내 다음 단계에서 즙이 더 잘 빠져나오게 해요.' },
      {
        title: '천에 거르기',
        description: '면포에 갈은 딸기를 넣고 냉장고에서 4시간 이상 그대로 매달아 자연스럽게 즙만 떨어지게 둡니다. 짜내지 않고 두는 게 핵심이에요 — 짜내면 과육 입자가 섞여 콩소메 특유의 맑은 색이 안 나와요.',
        warning: '급하다고 짜내면 탁해져요. 시간이 걸려도 자연스럽게 떨어지게 기다리는 게 이 요리의 본질이에요.',
        checkpoint: '받아낸 액체가 와인처럼 투명하고 붉은빛이 비치면 잘 거른 거예요.',
      },
      {
        title: '바질향 우리기',
        description: '거른 콩소메에 바질잎을 넣고 30분간 냉장고에서 향을 우립니다. 바질향이 딸기의 단맛, 산미와 만나면서 복합적인 풍미가 생겨요.',
        tip: '바질을 너무 오래 우리면 풀맛이 강해져요. 30분 정도가 향과 산뜻함의 균형이 가장 좋아요.',
      },
      { title: '플레이팅', description: '바질잎을 건져내고 콩소메만 차갑게 식혀, 잘게 썬 신선한 딸기와 함께 냅니다.' },
    ],
    tips: [
      '거르고 남은 과육은 버리지 말고 스무디나 잼으로 활용하면 낭비 없이 다 쓸 수 있어요.',
      '대체 재료: 바질 대신 민트로 바꾸면 더 청량한 느낌의 디저트가 돼요.',
      '보관/활용: 콩소메는 냉장 보관 2일 이내로 드시는 게 가장 신선해요.',
    ],
    youtubeQuery: '딸기 콩소메 만들기',
  },
];

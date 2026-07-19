import { MonthData, SeasonalIngredient } from './types';

export const monthsData: MonthData[] = [
  {
    month: 1,
    season: '한겨울',
    solarTerm: '소한 · 대한',
    headline: '추위를 고소함으로 채우는 뿌리채소의 계절',
    description: '땅속에서 단맛을 응축시킨 뿌리채소와 겨울 바다의 생물들이 한 상에 오릅니다. 몸을 데우는 따뜻한 국물 요리가 특히 빛을 발하는 시기예요.',
    ingredients: [
      { name: '우엉', emoji: '🥕', description: '식이섬유가 풍부해 겨울철 장 건강에 좋아요', category: '채소', origin: '경기 김포', imageUrl: '/images/ingredients/우엉.webp' , nutrition: '식이섬유가 풍부해서 겨울철 활동량이 줄어들고 장 건강에 신경 써야 할 때 큰 도움이 된답니다. 특히 이눌린 성분은 장내 유익균의 먹이가 되어 장 환경을 건강하게 가꾸는 데 좋고요.', howToChoose: '겉껍질에 흙이 적당히 묻어있고, 잔뿌리가 적으며 곧게 뻗은 것을 고르세요. 잘랐을 때 속이 너무 희거나 검지 않고, 촉촉하면서도 단단한 것이 신선한 우엉이랍니다.', tip: '우엉은 껍질에 영양분이 많으니 솔로 문질러 흙만 제거하거나 칼등으로 살살 긁어내듯 손질해 보세요. 손질한 우엉은 신문지에 싸서 냉장고 채소 칸에 보관하면 1주일 정도 신선하게 즐길 수 있어요.', goesWellWith: '조림이나 볶음 요리에 잘 어울려요.', pairings: [{ name: '당근', reason: '색감과 식감을 더하고, 영양 균형을 맞춰줘요.' }, { name: '식초', reason: '특유의 떫은맛을 줄여주고 아삭함을 살려줘요.' }, { name: '소고기', reason: '단백질을 보충하고 깊은 맛을 더해준답니다.' }], avoidPairings: [{ name: '철분제', reason: '우엉의 탄닌 성분이 철분 흡수를 방해할 수 있어요.' }] },
      { name: '꼬막', emoji: '🦪', description: '겨울 바다에서 가장 통통하게 살이 오릅니다', category: '해산물', origin: '전남 보성·벌교', imageUrl: '/images/ingredients/꼬막.webp' , nutrition: '꼬막은 겨울철 부족하기 쉬운 철분이 풍부해 빈혈 예방에 도움을 주고요. 타우린 성분은 피로 해소와 간 건강에 좋답니다.', howToChoose: '껍질이 깨지지 않고 윤기가 돌며, 입을 꽉 다물고 있는 것이 신선해요. 껍질을 살짝 두드렸을 때 탁한 소리가 아닌 묵직한 느낌이 드는 것을 고르시는 것이 좋답니다.', tip: '꼬막은 해감하는 것이 중요한데요, 소금물에 담가 어둡고 서늘한 곳에서 2~3시간 정도 두시면 좋아요. 해감 후에는 흐르는 물에 껍질을 솔로 문질러 씻어 냉장 보관하시면 2~3일 정도 신선하게 즐기실 수 있답니다.', goesWellWith: '매콤한 양념장과 비빔밥으로 즐겨보세요.', pairings: [{ name: '부추', reason: '꼬막의 비린 맛을 잡아주고 향긋함을 더해줘요.' }, { name: '마늘', reason: '꼬막의 감칠맛을 살려주고 향균 작용을 도와줘요.' }, { name: '고추', reason: '매콤한 맛으로 꼬막의 풍미를 더욱 돋보이게 해줘요.' }] },
      { name: '시금치', emoji: '🥬', description: '한파를 견디며 단맛이 진해진 노지 시금치', category: '채소', origin: '전남 신안', imageUrl: '/images/ingredients/시금치.webp' , nutrition: '시금치에는 비타민 K가 풍부해서 뼈 건강을 튼튼하게 지켜주는 데 도움을 줘요. 또한, 베타카로틴 성분은 눈 건강을 보호하고 면역력을 높여주는 데 좋답니다.', howToChoose: '뿌리 부분이 붉고 통통하며, 잎은 진한 녹색을 띠고 시들지 않은 것을 고르세요. 줄기가 너무 길지 않고 단단하며 윤기가 도는 것이 신선하답니다.', tip: '뿌리 부분을 잘라내고 흐르는 물에 흙과 이물질을 깨끗하게 씻어주세요. 물기를 제거한 후 키친타월에 싸서 비닐팩에 넣어 냉장 보관하시면 며칠간 신선하게 드실 수 있어요.', goesWellWith: '나물, 국, 무침 등 다양하게 활용해 보세요.', pairings: [{ name: '참기름', reason: '시금치의 비타민 K 흡수를 돕고 고소한 풍미를 더해줘요.' }, { name: '된장', reason: '구수한 맛을 더해주고 시금치의 쌉쌀한 맛을 중화시켜줘요.' }, { name: '달걀', reason: '단백질을 보충하고 부드러운 식감으로 영양 균형을 맞춰줘요.' }], avoidPairings: [{ name: '두부', reason: '시금치의 옥살산이 두부의 칼슘 흡수를 방해할 수 있답니다.' }] },
      { name: '귤', emoji: '🍊', description: '비타민C 보충에 더할 나위 없는 겨울 과일', category: '과일', origin: '제주', imageUrl: '/images/ingredients/귤.webp' , nutrition: '귤에는 비타민 C가 풍부해서 추운 겨울철 면역력을 높여주고 감기 예방에 도움을 줍니다. 또한, 구연산은 신진대사를 활발하게 하여 피로 해소에 아주 좋답니다.', howToChoose: '껍질이 얇고 매끄러우며, 전체적으로 윤기가 흐르는 귤을 고르시는 것이 좋아요. 손에 들었을 때 크기에 비해 묵직한 느낌이 들고, 꼭지가 신선한 녹색을 띠는 것이 좋답니다.', tip: '귤은 흐르는 물에 깨끗이 씻어 껍질째 활용할 수도 있고, 껍질을 벗겨 과육만 드셔도 좋아요. 서늘한 실온에 두거나, 냉장고에 보관하시면 1~2주 정도 신선하게 즐기실 수 있답니다.', goesWellWith: '샐러드나 청으로 만들어 즐겨보세요.', pairings: [{ name: '요거트', reason: '귤의 상큼한 맛과 요거트의 부드러움이 잘 어우러져요.' }, { name: '꿀', reason: '귤의 신맛을 꿀의 단맛이 보완해주어 풍미가 깊어져요.' }, { name: '생강', reason: '귤과 생강은 따뜻한 성질로 겨울철 건강에 시너지를 줍니다.' }], avoidPairings: [{ name: '우유', reason: '귤의 산성 성분이 우유 단백질을 응고시켜 소화를 방해할 수 있어요.' }] },
      { name: '대구', emoji: '🐟', description: '살이 단단하고 담백해 탕으로 즐기기 좋아요', category: '해산물', origin: '경남 거제', imageUrl: '/images/ingredients/대구.webp' , nutrition: '단백질이 풍부해서 추운 겨울철 기력 보충과 면역력 증진에 아주 좋답니다. 비타민 B군도 함유되어 있어 신진대사를 활발하게 하고 피로 해소에도 도움을 줄 수 있어요.', howToChoose: '살이 단단하고 탄력이 있으며, 눈은 맑고 투명한 것을 선택해보세요. 아가미는 선홍빛을 띠고 비늘이 잘 붙어 있는 것이 신선하답니다.', tip: '대구는 내장을 제거하고 깨끗하게 씻어 물기를 닦은 후, 한 번 먹을 분량으로 잘라 냉동 보관하시면 좋아요. 냉장 보관 시에는 2~3일 내에 드시는 것이 좋답니다.', goesWellWith: '시원한 탕이나 찜으로 즐겨보세요.', pairings: [{ name: '무', reason: '무의 시원한 맛이 대구의 담백함과 어우러져 국물 맛을 깊게 해줘요.' }, { name: '콩나물', reason: '아삭한 식감과 시원한 맛이 대구와 잘 어울려 해장국으로도 좋답니다.' }, { name: '미나리', reason: '미나리의 향긋함이 대구의 비린 맛을 잡아주고 풍미를 더해줘요.' }] },
      { name: '청어', emoji: '🐟', description: '과메기의 재료로도 쓰이는 등푸른 겨울 생선', category: '해산물', origin: '경북 포항', imageUrl: '/images/ingredients/청어.webp' , nutrition: '청어는 오메가-3 지방산이 풍부해서 추운 겨울철 혈액순환을 원활하게 하고 혈관 건강에 도움을 준답니다. 또한 단백질 함량이 높아 겨울철 기력 보충과 면역력 증진에도 아주 좋답니다.', howToChoose: '싱싱한 청어는 눈이 맑고 투명하며, 아가미 안쪽이 선명한 붉은색을 띠고 있어요. 몸통을 만졌을 때 탄력이 느껴지고 비늘이 단단하게 붙어있는 것을 고르시는 게 좋답니다.', tip: '청어는 흐르는 물에 깨끗이 씻어 비늘을 긁어내고 내장을 제거한 후 요리하시면 돼요. 손질한 청어는 밀폐용기에 담아 냉장고에 보관하면 2~3일 정도 신선하게 드실 수 있고, 장기 보관 시에는 냉동 보관하는 것이 좋답니다.', goesWellWith: '구이나 조림으로 담백하게 즐겨보세요.', pairings: [{ name: '무', reason: '무의 소화 효소가 청어의 소화를 돕고 맛의 균형을 맞춰준답니다.' }, { name: '생강', reason: '생강이 청어의 비린 맛을 잡아주고 향긋함을 더해준답니다.' }, { name: '레몬', reason: '레몬의 산미가 청어의 풍미를 살리고 비린 맛을 줄여준답니다.' }] },
      { name: '대게', emoji: '🦀', description: '한 해 중 살이 가장 꽉 차는 동해의 자랑', category: '해산물', origin: '경북 영덕·울진', imageUrl: '/images/ingredients/대게.webp' , nutrition: '대게는 단백질이 풍부하여 추운 겨울철 기력 보충과 면역력 증진에 도움을 줘요. 또한, 타우린 성분이 풍부해서 피로 해소와 간 건강에 좋답니다.', howToChoose: '껍질이 단단하고 윤기가 흐르며, 다리를 만졌을 때 탄력이 느껴지는 것이 신선한 대게예요. 배를 눌러보았을 때 단단하고 묵직한 무게감이 느껴지는 것을 고르시는 것이 좋답니다.', tip: '흐르는 물에 솔로 껍질을 깨끗하게 문질러 씻어 이물질을 제거한 후, 찜통에 배가 위로 향하게 하여 찌는 것이 좋아요. 손질한 대게는 냉장 보관 시 1~2일 내에 드시고, 장기 보관 시에는 쪄서 살을 발라 냉동 보관하시면 좋답니다.', goesWellWith: '찜으로 즐기거나 게장으로 만들어보세요.', pairings: [{ name: '미나리', reason: '대게의 비린 맛을 잡아주고 향긋함을 더해줘요.' }, { name: '레몬', reason: '상큼한 맛이 대게의 풍미를 돋우고 비린내를 줄여줘요.' }, { name: '찹쌀', reason: '대게 내장과 함께 볶아 게딱지 밥으로 만들면 고소하고 든든해요.' }] },
      { name: '매생이', emoji: '🟢', description: '겨울 바다의 향, 부드럽고 고소한 해초', category: '해산물', imageUrl: '/images/ingredients/매생이.webp', origin: '전남 고흥·완도' },
      { name: '연근', emoji: '🪷', description: '아삭하면서도 부드러운 단맛의 겨울 뿌리채소', category: '채소', imageUrl: '/images/ingredients/연근.webp', origin: '전남 무안' },
      { name: '대파', emoji: '🧅', description: '겨울철 단맛이 올라 국물 요리에 제격인 파', category: '채소', imageUrl: '/images/ingredients/대파.webp', origin: '전남 신안' },
      { name: '무', emoji: '🥕', description: '단맛이 들어 국물 요리에 좋은 겨울 무', category: '채소', imageUrl: '/images/ingredients/무.webp', origin: '강원 평창' },
      { name: '갓', emoji: '🌿', description: '알싱하고 매운 향으로 김치에 즐겨 쓰는 겨울 채소', category: '채소', imageUrl: '/images/ingredients/갓.webp', origin: '전남 여수' },
      { name: '봄동', emoji: '🥬', description: '겉은 푸르고 속은 노란 달큰한 겨울 배추', category: '채소', imageUrl: '/images/ingredients/봄동.webp', origin: '전남 해남' },
      { name: '냉이', emoji: '🌿', description: '향긋한 봄의 기운이 가장 먼저 도는 나물', category: '채소', imageUrl: '/images/ingredients/냉이.webp', origin: '충남 서산' },
      { name: '한라봉', emoji: '🍊', description: '향긋하고 달콤한 제주 겨울 감귤', category: '과일', imageUrl: '/images/ingredients/한라봉.webp', origin: '제주' },
      { name: '사과', emoji: '🍎', description: '저장성이 좋아 한겨울에도 아삭한 사과', category: '과일', imageUrl: '/images/ingredients/사과.webp', origin: '경북 청송' },
      { name: '딸기', emoji: '🍓', description: '시설 재배로 한겨울에도 맛볼 수 있는 달콤한 딸기', category: '과일', imageUrl: '/images/ingredients/딸기.webp', origin: '충남 논산' },
      { name: '레드향', emoji: '🍊', description: '껍질이 붉고 과즙이 풍부한 만감류 과일', category: '과일', imageUrl: '/images/ingredients/레드향.webp', origin: '제주' },
      { name: '굴', emoji: '🦪', description: '살이 통통하게 차오르는 한겨울 굴', category: '해산물', imageUrl: '/images/ingredients/굴.webp', origin: '경남 통영' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '팽이버섯', emoji: '🍄', description: '가늘고 아삭한 식감으로 탕과 볶음에 즐겨 쓰는 버섯', category: '버섯', imageUrl: '/images/ingredients/팽이버섯.webp', origin: '충남 부여' },
      { name: '흑미', emoji: '🌾', description: '구수한 맛과 풍부한 안토시아닌이 매력적인 곡물', category: '곡물', imageUrl: '/images/ingredients/흑미.webp', origin: '경기 여주' },
      { name: '들깨', emoji: '🌾', description: '고소한 향이 진한 겨울 들깨', category: '곡물', imageUrl: '/images/ingredients/들깨.webp', origin: '충남 천안' },
      { name: '곶감', emoji: '🟠', description: '말려서 단맛이 더 깊어진 겨울 건과일', category: '과일', imageUrl: '/images/ingredients/곶감.webp', origin: '경북 상주' },
    ],
    recipeIds: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8', '1-9', '1-10', '1-11', '1-12', '1-13', '1-14', '1-15'],
  },
  {
    month: 2,
    season: '늦겨울',
    solarTerm: '입춘 · 우수',
    headline: '바다 향 가득, 봄을 마중 나가는 정갈한 밥상',
    description: '입춘이 지나며 바닷속 생물들이 알을 채우기 시작합니다. 아직 차가운 바람 속에서도 식재료에는 봄기운이 슬며시 스며들어요.',
    ingredients: [
      { name: '바지락', emoji: '🦪', description: '봄을 준비하며 살이 차오르는 조개', category: '해산물', origin: '충남 태안', imageUrl: '/images/ingredients/바지락.webp' , nutrition: '바지락은 타우린이 풍부해 간 건강에 도움을 주고 피로 해소에 좋답니다. 철분도 많아 환절기에 부족하기 쉬운 기력을 보충하고 빈혈 예방에도 도움을 줄 수 있어요.', howToChoose: '껍질이 깨지지 않고 윤기가 돌며, 입을 꾹 다물고 있는 것이 신선해요. 가볍게 두드렸을 때 딱딱한 소리가 나면 좋은 바지락이랍니다.', tip: '바지락은 소금물에 담가 30분에서 1시간 정도 해감한 후 깨끗하게 씻어 사용하세요. 해감한 바지락은 냉장고에 보관하시면 2~3일 정도 신선하게 드실 수 있답니다.', goesWellWith: '시원한 국물 요리나 칼국수에 잘 어울려요.', pairings: [{ name: '무', reason: '무의 시원한 맛이 바지락의 감칠맛을 더욱 살려주고 국물을 개운하게 해줘요.' }, { name: '마늘', reason: '마늘의 향이 바지락의 비린 맛을 잡아주고 풍미를 더해준답니다.' }, { name: '청양고추', reason: '칼칼한 맛이 바지락의 시원함을 배가시키고 느끼함을 잡아줘요.' }] },
      { name: '삼치', emoji: '🐟', description: '기름지고 부드러운 살이 일품인 등푸른 생선', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/삼치.webp' , nutrition: '삼치에는 오메가-3 지방산이 풍부해서 추운 겨울철 혈액순환을 원활하게 하고 심혈관 건강에 도움을 줄 수 있답니다. 또한, 비타민 D가 많아 칼슘 흡수를 돕고 뼈 건강을 지키는 데도 좋은 영향을 줄 수 있어요.', howToChoose: '몸 전체에 윤기가 흐르고 살이 단단하며 탄력이 느껴지는 것을 고르세요. 아가미는 선홍빛을 띠고 눈은 맑고 투명한 것이 신선하답니다.', tip: '내장을 제거하고 흐르는 물에 깨끗이 씻은 후 키친타월로 물기를 제거해 주세요. 한 번 먹을 양만큼 소분하여 밀봉한 뒤 냉동 보관하시면 2~3주 정도 신선하게 드실 수 있어요.', goesWellWith: '구이나 조림으로 즐기면 아주 좋답니다.', pairings: [{ name: '무', reason: '무의 소화 효소가 삼치의 소화를 돕고 비린 맛을 잡아줘요.' }, { name: '생강', reason: '생강의 향이 삼치의 비린 맛을 효과적으로 제거해 줘요.' }, { name: '레몬', reason: '레몬의 산뜻한 향이 삼치의 풍미를 더하고 비린 맛을 줄여줘요.' }] },
      { name: '한라봉', emoji: '🍊', description: '달콤하고 향긋한 제주 만감류', category: '과일', origin: '제주', imageUrl: '/images/ingredients/한라봉.webp' , nutrition: '비타민 C가 풍부하여 추운 겨울철 면역력을 높여주고 피로 해소에 도움을 준답니다. 또한, 식이섬유가 많아 장 건강을 돕고 소화를 편안하게 해주는 데에도 좋답니다.', howToChoose: '껍질이 얇고 매끈하며 윤기가 흐르는 것을 고르는 것이 좋아요. 들었을 때 묵직하고 단단한 느낌이 드는 것이 과즙이 풍부하고 신선하답니다.', tip: '한라봉은 껍질이 두꺼워서 귤처럼 손으로 쉽게 벗겨낼 수 있어요. 서늘하고 통풍이 잘 되는 곳에 보관하시면 며칠간 신선하게 즐기실 수 있답니다.', goesWellWith: '샐러드나 청으로 만들어 즐겨보세요.', pairings: [{ name: '요거트', reason: '상큼한 맛이 요거트의 풍미를 더하고 유산균 활동에 도움을 줍니다.' }, { name: '꿀', reason: '단맛을 더해 한라봉의 신맛을 부드럽게 하고 영양을 보충해 줍니다.' }, { name: '샐러드 채소', reason: '상큼한 맛이 채소의 신선함을 살리고 비타민 섭취를 돕습니다.' }] },
      { name: '냉이', emoji: '🌿', description: '땅이 녹기 시작하면 가장 먼저 올라오는 봄나물', category: '채소', origin: '충남 서산', imageUrl: '/images/ingredients/냉이.webp' , nutrition: '냉이에는 비타민 A가 풍부하여 추운 겨울을 지나며 지치기 쉬운 눈 건강과 면역력 증진에 도움을 준답니다. 또한 칼슘과 철분도 많아 뼈 건강을 챙기고 활기찬 봄을 맞이하는 데 좋답니다.', howToChoose: '뿌리가 너무 질기지 않고 잔털이 적으면서 전체적으로 연한 녹색을 띠는 것이 좋아요. 잎은 시들지 않고 싱싱하며, 뿌리는 너무 굵지 않고 곧게 뻗은 것을 고르시는 것이 좋답니다.', tip: '냉이는 뿌리 부분의 흙을 칼등으로 긁어낸 후 흐르는 물에 깨끗이 씻어주세요. 신문지에 싸서 냉장고 채소 칸에 보관하시면 3~4일 정도 신선하게 드실 수 있어요.', goesWellWith: '구수한 된장과 함께 무치거나 국으로 끓여보세요.', pairings: [{ name: '된장', reason: '냉이의 쌉쌀한 맛과 된장의 구수한 맛이 어우러져 풍미를 더해줘요.' }, { name: '조개', reason: '냉이와 조개를 함께 넣으면 시원하고 깊은 맛을 낼 수 있답니다.' }, { name: '두부', reason: '냉이의 향과 두부의 부드러움이 조화를 이루어 담백한 맛을 선사해요.' }] },
      { name: '도미', emoji: '🐟', description: '쫀득한 살과 껍질까지 즐기는 생선의 귀족', category: '해산물', origin: '제주', imageUrl: '/images/ingredients/도미.webp' , nutrition: '도미는 단백질이 풍부해서 추운 겨울철 기력 보충과 면역력 증진에 아주 좋답니다. 또한, 불포화지방산이 풍부하여 혈액순환을 원활하게 하고 혈관 건강을 지키는 데 도움을 줄 수 있어요.', howToChoose: '눈은 맑고 투명하며 아가미는 선홍빛을 띠는 것이 신선한 도미랍니다. 몸을 만져봤을 때 단단하고 탄력이 있으며, 비늘이 잘 붙어있는 것을 선택하시면 좋아요.', tip: '도미는 비늘을 긁어내고 내장과 아가미를 깨끗하게 제거한 후 흐르는 물에 씻어 준비해 주세요. 손질한 도미는 키친타월로 물기를 제거하고 밀봉하여 냉장고에 보관하면 2~3일 정도 신선하게 즐기실 수 있어요. 장기 보관 시에는 냉동 보관하는 것이 좋답니다.', goesWellWith: '찜이나 구이로 담백하게 즐겨보세요.', pairings: [{ name: '무', reason: '무의 소화 효소가 도미의 소화를 돕고 시원한 맛을 더해줘요.' }, { name: '미나리', reason: '미나리의 향긋함이 도미의 풍미를 살리고 비린 맛을 잡아줘요.' }, { name: '생강', reason: '생강의 매운맛이 도미의 비린 맛을 효과적으로 제거해 준답니다.' }], avoidPairings: [{ name: '감', reason: '감의 떫은맛이 도미의 담백한 맛을 해칠 수 있어요.' }] },
      { name: '쭈꾸미', emoji: '🦑', description: '산란을 앞두고 알이 꽉 차오르기 시작해요', category: '해산물', origin: '충남 서천·홍성', imageUrl: '/images/ingredients/쭈꾸미.webp' , nutrition: '쭈꾸미는 타우린이 풍부해서 피로 해소에 도움을 주고, 간 건강을 지켜주는 데도 좋답니다. DHA와 EPA 같은 불포화지방산도 많아 혈액순환을 원활하게 하고 뇌 기능 활성화에도 이로운 영향을 줄 수 있어요.', howToChoose: '몸통은 선명한 붉은색을 띠고 윤기가 흐르며, 다리는 단단하게 오므라져 있는 것이 신선해요. 머리 부분은 동그랗고 통통하며, 눌렀을 때 탄력이 느껴지는 것을 고르세요.', tip: '쭈꾸미는 밀가루나 굵은소금을 이용해 머리와 다리 사이를 잡고 빨판을 깨끗하게 문질러 씻어주세요. 손질 후에는 물기를 제거하고 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 신선하게 드실 수 있답니다.', goesWellWith: '매콤하게 볶거나 샤부샤부로 즐겨보세요.', pairings: [{ name: '삼겹살', reason: '쭈꾸미의 담백함과 삼겹살의 고소함이 조화로워요.' }, { name: '콩나물', reason: '아삭한 식감과 시원한 맛으로 쭈꾸미 요리의 풍미를 더해줘요.' }, { name: '미나리', reason: '향긋한 미나리가 쭈꾸미의 맛을 돋우고 비린 맛을 잡아줘요.' }] },
      { name: '벚굴', emoji: '🦪', description: '섬진강에서 나는 손바닥만 한 큰 굴, 2월 시작', category: '해산물', origin: '전남 광양·섬진강', imageUrl: '/images/ingredients/벚굴.webp' , nutrition: '벚굴은 아미노산과 글리코겐이 풍부하여 추운 겨울철 기력 회복에 도움을 주고, 면역력 증진에도 좋답니다. 또한, 셀레늄도 함유되어 있어 활력 증진에 기여하고 체내 항산화 작용에도 도움을 줄 수 있어요.', howToChoose: '껍질이 단단하고 깨지지 않았으며, 껍질을 열었을 때 속살이 탱글탱글하고 유백색을 띠는 것을 고르세요. 특유의 바다 향이 진하게 나는 것이 신선한 벚굴이랍니다.', tip: '흐르는 물에 껍질을 솔로 깨끗하게 문질러 씻은 후, 칼로 조심스럽게 껍질을 열어 속살을 발라내세요. 손질한 벚굴은 밀폐 용기에 담아 냉장 보관하면 2~3일 정도 신선하게 즐길 수 있어요.', goesWellWith: '찜이나 구이로 즐겨보세요.', pairings: [{ name: '미나리', reason: '벚굴의 시원한 맛에 향긋함을 더해주고, 비린 맛을 잡아줘요.' }, { name: '초고추장', reason: '새콤달콤한 맛이 벚굴의 풍미를 더욱 돋우어 준답니다.' }, { name: '레몬', reason: '상큼한 맛이 벚굴의 신선함을 살리고, 비린 맛을 줄여줘요.' }] },
      { name: '유채나물', emoji: '🌿', description: '쌉싸름한 향으로 봄 입맛을 깨우는 나물', category: '채소', imageUrl: '/images/ingredients/유채나물.webp', origin: '제주' },
      { name: '물미역', emoji: '🌊', description: '미끌하고 부드러운 식감의 초봄 해초', category: '해산물', imageUrl: '/images/ingredients/물미역.webp', origin: '경남 기장' },
      { name: '쪽파', emoji: '🧄', description: '알이 작고 향이 진한 봄철 파', category: '채소', imageUrl: '/images/ingredients/쪽파.webp', origin: '전남 신안' },
      { name: '봄동', emoji: '🥬', description: '겉은 푸르고 속은 노란 달큰한 늦겨울 배추', category: '채소', imageUrl: '/images/ingredients/봄동.webp', origin: '전남 해남' },
      { name: '달래', emoji: '🌿', description: '알싱한 향이 매력적인 이른 봄나물', category: '채소', imageUrl: '/images/ingredients/달래.webp', origin: '충남 서산' },
      { name: '시금치', emoji: '🥬', description: '단맛이 올라 무침에 좋은 늦겨울 시금치', category: '채소', imageUrl: '/images/ingredients/시금치.webp', origin: '전남 신안' },
      { name: '대파', emoji: '🧅', description: '단맛이 깊어지는 늦겨울 대파', category: '채소', imageUrl: '/images/ingredients/대파.webp', origin: '전남 신안' },
      { name: '알배추', emoji: '🥬', description: '속이 꽉 찬 고소한 늦겨울 배추', category: '채소', imageUrl: '/images/ingredients/알배추.webp', origin: '강원 평창' },
      { name: '딸기', emoji: '🍓', description: '한 해 중 가장 달콤한 시기를 맞는 딸기', category: '과일', imageUrl: '/images/ingredients/딸기.webp', origin: '충남 논산' },
      { name: '천혜향', emoji: '🍊', description: '향이 진하고 과즙이 풍부한 만감류', category: '과일', imageUrl: '/images/ingredients/천혜향.webp', origin: '제주' },
      { name: '키위', emoji: '🥝', description: '새콤달콤하고 비타민이 풍부한 늦겨울 과일', category: '과일', imageUrl: '/images/ingredients/키위.webp', origin: '전남 해남' },
      { name: '사과', emoji: '🍎', description: '저장 사과가 가장 맛있게 익는 시기', category: '과일', imageUrl: '/images/ingredients/사과.webp', origin: '경북 청송' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '느타리버섯', emoji: '🍄', description: '부드러운 식감과 은은한 향이 매력적인 버섯', category: '버섯', imageUrl: '/images/ingredients/느타리버섯.webp', origin: '충남 부여' },
      { name: '검은콩', emoji: '🫘', description: '구수한 맛과 영양이 풍부한 콩', category: '곡물', imageUrl: '/images/ingredients/검은콩.webp', origin: '강원 홍천' },
      { name: '들깨', emoji: '🌾', description: '고소한 향이 진한 들깨', category: '곡물', imageUrl: '/images/ingredients/들깨.webp', origin: '충남 천안' },
      { name: '레드향', emoji: '🍊', description: '껍질이 붉고 과즙이 풍부한 만감류 과일', category: '과일', imageUrl: '/images/ingredients/레드향.webp', origin: '제주' },
    ],
    recipeIds: ['2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7', '2-8', '2-9', '2-10', '2-11', '2-12', '2-13', '2-14', '2-15'],
  },
  {
    month: 3,
    season: '초봄',
    solarTerm: '경칩 · 춘분',
    headline: '언 땅을 녹이고 올라온 싱그러운 봄나물 파티',
    description: '겨울잠에서 깨어난 땅이 향긋한 봄나물을 내어주는 시기입니다. 쌉싸름하고 향이 강한 나물들이 입맛을 깨워줘요.',
    ingredients: [
      { name: '달래', emoji: '🌱', description: '마늘 향이 은은하게 나는 봄의 전령', category: '채소', origin: '충남 서산', imageUrl: '/images/ingredients/달래.webp' , nutrition: '달래는 비타민 A와 C가 풍부하여 환절기 면역력 강화에 도움을 주고, 따뜻한 봄 햇살 아래 활력을 되찾는 데 좋답니다. 칼슘과 인 같은 무기질도 많아 춘곤증으로 나른해질 수 있는 몸의 균형을 잡아주는 데 도움이 될 수 있어요.', howToChoose: '뿌리 부분이 통통하고 줄기가 너무 길지 않으면서 전체적으로 선명한 녹색을 띠는 것이 신선해요. 잎이 시들거나 누렇게 변색된 것은 피하시는 것이 좋답니다.', tip: '달래는 흙이 많으니 뿌리 부분의 흙을 깨끗이 털고, 잔뿌리는 제거한 후 흐르는 물에 여러 번 헹궈주세요. 신문지에 싸서 비닐팩에 넣어 냉장 보관하시면 며칠간 신선하게 드실 수 있답니다.', goesWellWith: '새콤달콤한 양념장이나 된장찌개에 잘 어울려요.', pairings: [{ name: '두부', reason: '달래의 향긋함과 두부의 담백함이 조화로워요.' }, { name: '돼지고기', reason: '달래의 알싸한 맛이 돼지고기의 느끼함을 잡아준답니다.' }, { name: '계란', reason: '달래의 향긋함이 계란의 부드러운 맛을 더해줘요.' }] },
      { name: '냉이', emoji: '🌿', description: '구수한 된장과 가장 잘 어울리는 봄나물', category: '채소', origin: '충남 서산', imageUrl: '/images/ingredients/냉이.webp' , nutrition: '냉이에는 비타민 A와 C가 풍부해서 환절기 면역력을 높여주고 피로 해소에 도움을 준답니다. 또한 칼슘과 철분도 많아 뼈 건강을 챙기고 빈혈 예방에도 좋답니다.', howToChoose: '뿌리가 너무 질기지 않고 잔털이 적으며, 잎이 시들지 않고 선명한 녹색을 띠는 것을 고르세요. 전체적으로 흙이 적당히 묻어 있고 향긋한 풀 내음이 진하게 나는 것이 신선하답니다.', tip: '냉이는 뿌리 부분의 흙을 털어내고 칼로 다듬은 뒤, 흐르는 물에 여러 번 흔들어 씻어주세요. 신문지에 싸서 냉장고 채소 칸에 넣어두면 3~4일 정도 신선하게 보관할 수 있답니다.', goesWellWith: '구수한 된장과 함께 무치거나 국으로 끓여보세요.', pairings: [{ name: '된장', reason: '냉이의 쌉쌀한 맛과 구수한 된장이 어우러져 깊은 맛을 낸답니다.' }, { name: '두부', reason: '단백질을 보충하고 냉이의 향을 부드럽게 감싸주어 조화로워요.' }, { name: '조개류', reason: '시원한 감칠맛을 더해주어 냉이의 향을 더욱 풍부하게 해준답니다.' }] },
      { name: '쭈꾸미', emoji: '🦑', description: '봄에 가장 부드럽고 쫄깃한 연안 낙지류', category: '해산물', origin: '충남 서천·홍성', imageUrl: '/images/ingredients/쭈꾸미.webp' , nutrition: '쭈꾸미는 타우린이 풍부해서 봄철 피로 회복에 아주 좋답니다. 또한, DHA와 같은 불포화 지방산도 함유하고 있어 두뇌 건강에도 도움을 줄 수 있어요.', howToChoose: '몸통 색이 선명하고 윤기가 흐르며, 다리가 끊어지지 않고 흡반이 살아있는 것을 고르세요. 만져보았을 때 탄력이 있고 단단한 느낌이 드는 것이 신선하답니다.', tip: '머리 안의 먹물과 내장을 제거하고 밀가루나 굵은소금으로 문질러 깨끗하게 씻어주세요. 손질한 쭈꾸미는 밀폐 용기에 담아 냉장고에 1~2일 보관하거나, 한 번 먹을 분량씩 소분하여 냉동 보관하면 된답니다.', goesWellWith: '매콤하게 볶거나 데쳐서 숙회로 즐겨보세요.', pairings: [{ name: '미나리', reason: '미나리의 향긋함이 쭈꾸미의 풍미를 더하고 비린 맛을 잡아준답니다.' }, { name: '콩나물', reason: '아삭한 식감으로 쭈꾸미의 쫄깃함과 대비되어 더욱 맛있게 즐길 수 있어요.' }, { name: '삼겹살', reason: '쭈꾸미의 담백함과 삼겹살의 고소함이 어우러져 환상의 맛을 낸답니다.' }] },
      { name: '미나리', emoji: '🌿', description: '향긋함이 살아있는 봄철 향채소', category: '채소', origin: '경남 함양', imageUrl: '/images/ingredients/미나리.webp' , nutrition: '미나리는 비타민 K가 풍부해서 혈액 응고와 뼈 건강에 도움을 줄 수 있답니다. 또한, 칼륨이 많이 들어 있어 체내 나트륨 배출을 돕고 혈압 조절에도 좋은 영향을 줄 수 있어요.', howToChoose: '줄기가 너무 두껍지 않고 푸른빛이 선명하며 잎이 시들지 않은 것을 고르세요. 줄기 부분이 단단하고 윤기가 돌며 향이 진하게 나는 것이 신선하답니다.', tip: '흐르는 물에 흙과 이물질을 깨끗하게 씻어낸 후, 누런 잎이나 시든 부분은 제거하고 사용하세요. 신문지에 싸서 비닐팩에 넣어 냉장 보관하시면 며칠간 신선하게 드실 수 있답니다.', goesWellWith: '생채, 무침, 전골 등 다양하게 활용해보세요.', pairings: [{ name: '돼지고기', reason: '미나리의 향긋함이 돼지고기의 잡내를 잡아주고 풍미를 더해준답니다.' }, { name: '조개류', reason: '시원한 조개 육수에 미나리를 더하면 개운한 맛이 배가 된답니다.' }, { name: '두부', reason: '담백한 두부와 미나리의 향이 어우러져 깔끔한 맛을 낸답니다.' }] },
      { name: '도다리', emoji: '🐟', description: '"봄 도다리"로 유명하지만, 도다리쑥국의 진짜 주인공은 대부분 문치가자미예요', category: '해산물', origin: '경남 고성', imageUrl: '/images/ingredients/도다리.webp' },
      { name: '숭어', emoji: '🐟', description: '묵은지에 싸 먹는 회로 인기인 봄 생선', category: '해산물', origin: '전남 신안', imageUrl: '/images/ingredients/숭어.webp' , nutrition: '숭어는 불포화지방산이 풍부하여 혈액순환을 원활하게 하고 혈관 건강에 도움을 줄 수 있답니다. 또한, 비타민 B군이 많아 봄철 떨어진 기력을 보충하고 피로 해소에 좋답니다.', howToChoose: '눈이 맑고 투명하며 아가미가 선홍색을 띠는 것이 신선해요. 몸통을 눌렀을 때 탄력이 있고 단단하며 비늘이 잘 붙어있는 것을 고르시는 게 좋답니다.', tip: '내장을 제거하고 흐르는 물에 깨끗이 씻은 후 물기를 완전히 제거해 주세요. 손질한 숭어는 밀봉하여 냉장 보관하면 2~3일, 냉동 보관하면 한 달 정도 신선하게 즐기실 수 있어요.', goesWellWith: '회, 구이, 조림 등으로 즐겨보세요.', pairings: [{ name: '묵은지', reason: '숭어 회의 담백함과 묵은지의 아삭하고 새콤한 맛이 잘 어울려요.' }, { name: '무', reason: '숭어 매운탕에 무를 넣으면 시원하고 개운한 맛을 더해준답니다.' }, { name: '미나리', reason: '향긋한 미나리가 숭어의 풍미를 더하고 비린 맛을 잡아줘요.' }] },
      { name: '새조개', emoji: '🐚', description: '쫄깃하고 달큰한 맛으로 봄철 입맛을 돋워요', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/새조개.webp' , nutrition: '새조개는 타우린이 풍부해 봄철 춘곤증으로 지친 몸에 활력을 불어넣고 피로 해소에 도움을 줍니다. 또한, 철분 함량도 높아 봄철 나른해지기 쉬운 몸에 생기를 더해주고 혈액 건강에 이로움을 준답니다.', howToChoose: '껍질이 깨지지 않고 윤기가 돌며, 입을 꽉 다물고 있는 것이 신선해요. 껍질을 벗긴 새조개라면 살이 통통하고 탄력이 있으며, 붉은빛을 띠는 것을 고르시는 것이 좋답니다.', tip: '새조개는 해감 후 흐르는 물에 가볍게 헹궈 이물질을 제거하고, 내장은 따로 손질할 필요 없이 바로 드시면 된답니다. 손질 후에는 밀폐 용기에 담아 냉장 보관하시고, 가급적 1~2일 내에 드시는 것이 가장 신선하게 즐기는 방법이에요.', goesWellWith: '샤브샤브나 초무침으로 달콤하게 즐겨보세요.', pairings: [{ name: '미나리', reason: '미나리의 향긋함이 새조개의 풍미를 살리고, 비린 맛을 잡아준답니다.' }, { name: '파프리카', reason: '아삭한 식감과 달큰한 맛이 새조개와 어우러져 더욱 다채로운 맛을 내줘요.' }, { name: '쑥갓', reason: '쌉쌀한 향이 새조개의 단맛을 더욱 돋보이게 하고, 개운한 맛을 더해준답니다.' }], avoidPairings: [{ name: '오래된 해산물', reason: '신선한 새조개의 맛과 향을 해치고, 자칫 식중독의 위험이 있을 수 있어요.' }] },
      { name: '돌나물', emoji: '🌱', description: '아삭하고 상큼한 새콤함이 매력인 봄나물', category: '채소', imageUrl: '/images/ingredients/돌나물.webp', origin: '전남 해남' },
      { name: '실치', emoji: '🐟', description: '실처럼 가늘고 투명한 봄철 뱅어 새끼', category: '해산물', imageUrl: '/images/ingredients/실치.webp', origin: '충남 군산·서천' },
      { name: '봄동', emoji: '🥬', description: '한파를 견디며 단맛이 오른 납작한 배추', category: '채소', imageUrl: '/images/ingredients/봄동.webp', origin: '전남 해남' },
      { name: '두릅', emoji: '🌿', description: '향긋한 봄의 첫 향을 느낄 수 있는 나물', category: '채소', imageUrl: '/images/ingredients/두릅.webp', origin: '경북 울릉' },
      { name: '씀바귀', emoji: '🌿', description: '쌉싸름한 맛으로 입맛을 돋우는 봄나물', category: '채소', imageUrl: '/images/ingredients/씀바귀.webp', origin: '충남 서산' },
      { name: '참나물', emoji: '🌿', description: '향긋하고 아삭한 식감의 봄나물', category: '채소', imageUrl: '/images/ingredients/참나물.webp', origin: '강원 정선' },
      { name: '딸기', emoji: '🍓', description: '봄볕을 받아 더 달콤해진 딸기', category: '과일', imageUrl: '/images/ingredients/딸기.webp', origin: '충남 논산' },
      { name: '한라봉', emoji: '🍊', description: '향긋하고 달콤한 봄철 감귤', category: '과일', imageUrl: '/images/ingredients/한라봉.webp', origin: '제주' },
      { name: '천혜향', emoji: '🍊', description: '향이 진하고 과즙이 풍부한 만감류', category: '과일', imageUrl: '/images/ingredients/천혜향.webp', origin: '제주' },
      { name: '키위', emoji: '🥝', description: '새콤달콤하고 비타민이 풍부한 과일', category: '과일', imageUrl: '/images/ingredients/키위.webp', origin: '전남 해남' },
      { name: '레드향', emoji: '🍊', description: '껍질이 붉고 과즙이 풍부한 만감류 과일', category: '과일', imageUrl: '/images/ingredients/레드향.webp', origin: '제주' },
      { name: '바지락', emoji: '🐚', description: '시원한 국물 맛을 내는 봄철 조개', category: '해산물', imageUrl: '/images/ingredients/바지락.webp', origin: '충남 태안' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '팽이버섯', emoji: '🍄', description: '가늘고 아삭한 식감으로 탕과 볶음에 즐겨 쓰는 버섯', category: '버섯', imageUrl: '/images/ingredients/팽이버섯.webp', origin: '충남 부여' },
      { name: '보리', emoji: '🌾', description: '고소한 맛이 매력적인 봄 곡물', category: '곡물', imageUrl: '/images/ingredients/보리.webp', origin: '전남 고창' },
      { name: '검은콩', emoji: '🫘', description: '구수한 맛과 영양이 풍부한 콩', category: '곡물', imageUrl: '/images/ingredients/검은콩.webp', origin: '강원 홍천' },
      { name: '사과', emoji: '🍎', description: '저장 사과가 마지막으로 맛있는 시기', category: '과일', imageUrl: '/images/ingredients/사과.webp', origin: '경북 청송' },
    ],
    recipeIds: ['3-1', '3-2', '3-3', '3-4', '3-5', '3-6', '3-7', '3-8', '3-9', '3-10', '3-11', '3-12', '3-13', '3-14', '3-15'],
  },
  {
    month: 4,
    season: '봄',
    solarTerm: '청명 · 곡우',
    headline: '산과 들에서 채집한 가장 여린 초록의 맛',
    description: '곡우 무렵 내리는 봄비를 맞으며 산나물이 가장 여리고 부드러운 상태가 됩니다. 향이 진한 산채 요리가 제격이에요.',
    ingredients: [
      { name: '두릅', emoji: '🌿', description: '쌉쌀한 향이 매력적인 봄철 산나물의 왕', category: '채소', origin: '경북 울릉', imageUrl: '/images/ingredients/두릅.webp' , nutrition: '두릅에는 사포닌이 풍부해서 봄철 나른해지기 쉬운 몸에 활력을 불어넣고 혈액 순환에 도움을 준답니다. 또한, 비타민 C와 칼슘도 많이 들어있어 환절기 면역력을 높여주고 뼈 건강에도 좋다고 해요.', howToChoose: '봉오리가 단단하고 끝부분이 벌어지지 않은 것을 고르시는 것이 좋아요. 줄기 부분은 너무 질기지 않고 부드러우면서도 윤기가 흐르는 것이 신선하답니다.', tip: '두릅 밑동의 억센 부분을 잘라내고 가시가 있다면 제거한 후 흐르는 물에 깨끗하게 씻어주세요. 신문지에 싸서 비닐팩에 넣어 냉장 보관하시면 3~4일 정도 신선하게 드실 수 있답니다.', goesWellWith: '초고추장, 된장 양념과 잘 어울려요.', pairings: [{ name: '초고추장', reason: '두릅의 쌉쌀한 맛과 새콤달콤한 초고추장이 조화로워요.' }, { name: '소고기', reason: '두릅의 향긋함이 소고기의 풍미를 더해주고 영양 균형도 맞춰준답니다.' }, { name: '밀가루', reason: '두릅 튀김이나 전으로 만들면 바삭하고 고소한 맛을 즐길 수 있어요.' }], avoidPairings: [{ name: '찬 성질의 해산물', reason: '두릅도 찬 성질이 있어 함께 먹으면 소화에 부담을 줄 수 있어요.' }] },
      { name: '죽순', emoji: '🎍', description: '아삭한 식감이 살아있는 봄 대나무 순', category: '채소', origin: '경남 거제·전남 담양', imageUrl: '/images/ingredients/죽순.webp' , nutrition: '죽순에는 칼륨이 풍부해서 봄철 몸의 균형을 잡아주고, 피로감을 덜어주는 데 도움을 줄 수 있답니다. 또한 식이섬유도 많아서 환절기에 장 건강을 편안하게 유지하는 데 아주 좋답니다.', howToChoose: '껍질이 촉촉하고 윤기가 돌며, 단단하면서 묵직한 것을 고르시는 것이 좋아요. 껍질에 상처가 없고, 잘려 나간 밑동 부분이 희고 싱싱한 것을 선택해보세요.', tip: '죽순은 겉껍질을 벗기고 쌀뜨물에 끓여 아린 맛을 제거한 후 사용하시면 더욱 부드럽게 즐기실 수 있어요. 손질한 죽순은 밀폐 용기에 물을 채워 냉장 보관하시면 3~4일 정도 신선하게 보관할 수 있답니다.', goesWellWith: '볶음, 조림, 무침 등 다양하게 활용해 보세요.', pairings: [{ name: '소고기', reason: '죽순의 아삭한 식감과 소고기의 고소한 맛이 어우러져 맛의 조화가 좋아요.' }, { name: '미역', reason: '미역의 부드러움과 죽순의 아삭함이 만나 식감의 대비를 이룬답니다.' }, { name: '표고버섯', reason: '표고버섯의 향긋한 풍미가 죽순의 은은한 맛을 더욱 돋보이게 해줘요.' }] },
      { name: '취나물', emoji: '🌿', description: '향긋하고 부드러운 봄 산채', category: '채소', origin: '강원 평창', imageUrl: '/images/ingredients/취나물.webp' , nutrition: '취나물은 칼륨이 풍부해서 봄철 나른해지기 쉬운 몸의 균형을 잡아주고, 붓기를 빼는 데 도움을 줘요. 또한 식이섬유가 많아 장 건강에 좋고, 봄철 춘곤증으로 지치기 쉬운 소화를 편안하게 해준답니다.', howToChoose: '잎이 시들지 않고 선명한 녹색을 띠며 윤기가 도는 것이 신선해요. 줄기가 너무 굵지 않고 부드러워 보이는 것을 고르시는 것이 좋답니다.', tip: '흐르는 물에 여러 번 흔들어 씻어 흙이나 이물질을 제거해 주세요. 데쳐서 물기를 꼭 짠 후 비닐 팩에 넣어 냉장 보관하시면 며칠간 신선하게 드실 수 있답니다.', goesWellWith: '들기름에 무치거나 볶음으로 즐겨보세요.', pairings: [{ name: '들기름', reason: '취나물의 향을 살리고 고소함을 더해준답니다.' }, { name: '된장', reason: '구수한 맛이 취나물의 쌉쌀한 맛과 조화를 이룬답니다.' }, { name: '마늘', reason: '취나물의 향을 돋우고 풍미를 더해준답니다.' }] },
      { name: '딸기', emoji: '🍓', description: '제철을 맞아 가장 달고 향이 진한 봄 과일', category: '과일', origin: '충남 논산', imageUrl: '/images/ingredients/딸기.webp' , nutrition: '딸기에는 비타민 C가 풍부해서 봄철 환절기에 면역력을 높이고 피부를 건강하게 가꾸는 데 도움을 준답니다. 또한, 안토시아닌 성분은 항산화 작용으로 우리 몸의 활력을 되찾아주는 데 좋답니다.', howToChoose: '싱싱한 딸기는 전체적으로 붉은빛이 선명하고 윤기가 흐르며, 꼭지가 마르지 않고 초록색을 띠는 것이 좋답니다. 과육은 단단하고 탱글탱글하며, 무르거나 상처가 없는 것을 선택해 보세요.', tip: '딸기는 흐르는 물에 가볍게 씻어 물기를 제거한 후, 꼭지를 나중에 따는 것이 좋답니다. 밀폐 용기에 담아 냉장 보관하시면 3~5일 정도 신선하게 즐기실 수 있어요.', goesWellWith: '우유나 요거트와 잘 어울려요.', pairings: [{ name: '우유', reason: '딸기의 비타민 C와 우유의 칼슘이 만나 영양 흡수를 돕는답니다.' }, { name: '요거트', reason: '새콤달콤한 맛과 부드러운 식감이 어우러져 맛있는 간식이 돼요.' }, { name: '시금치', reason: '딸기의 비타민 C가 시금치의 철분 흡수를 도와준답니다.' }] },
      { name: '쭈꾸미', emoji: '🦑', description: '산란기 직전, 알이 꽉 차 가장 맛있는 시기예요', category: '해산물', origin: '충남 서천·홍성', imageUrl: '/images/ingredients/쭈꾸미.webp' , nutrition: '타우린이 풍부해서 피로 해소에 도움을 주고 혈관 건강에도 좋답니다. DHA와 EPA 같은 불포화지방산도 많아서 두뇌 발달과 혈액순환에 긍정적인 영향을 준답니다.', howToChoose: '몸통은 선명한 붉은색을 띠고 윤기가 흐르며, 다리는 서로 붙어 있고 빨판이 살아있는 것을 고르세요. 만져봤을 때 탄력이 있고 단단한 것이 신선하답니다.', tip: '머리 안의 먹물 주머니와 내장을 제거하고, 밀가루나 굵은소금으로 바락바락 주물러 씻어 미끈거림을 없애주세요. 손질한 주꾸미는 밀폐 용기에 담아 냉장고에 1~2일 보관하거나 냉동 보관하시면 좋아요.', goesWellWith: '매콤하게 볶거나 샤부샤부로 즐겨보세요.', pairings: [{ name: '미나리', reason: '향긋한 미나리가 주꾸미의 비린 맛을 잡아주고 풍미를 더해줘요.' }, { name: '콩나물', reason: '아삭한 식감으로 주꾸미 볶음의 맛을 더욱 풍성하게 해준답니다.' }, { name: '삼겹살', reason: '주꾸미의 쫄깃함과 삼겹살의 고소함이 만나 환상의 조화를 이뤄요.' }] },
      { name: '꽃게', emoji: '🦀', description: '산란 전 알이 꽉 차오르는 봄 암꽃게', category: '해산물', origin: '충남 태안·서천', imageUrl: '/images/ingredients/꽃게.webp' , nutrition: '꽃게는 타우린이 풍부해 피로 해소와 간 기능 개선에 도움을 줄 수 있답니다. 또한 키토산 성분은 면역력 강화와 혈액순환에 긍정적인 영향을 줄 수 있어요.', howToChoose: '껍질이 단단하고 광택이 있으며, 배딱지가 하얗고 깨끗한 것을 고르세요. 들었을 때 묵직한 느낌이 들고, 다리가 모두 붙어 있는 것이 신선하답니다.', tip: '솔로 깨끗이 문질러 씻은 후, 배딱지를 열어 모래주머니와 아가미를 제거해 주세요. 냉장 보관 시에는 비닐팩에 담아 1~2일 내에 드시는 것이 좋고, 장기 보관 시에는 손질 후 냉동 보관하시면 된답니다.', goesWellWith: '찜이나 탕으로 즐기면 더욱 좋아요.', pairings: [{ name: '무', reason: '꽃게의 시원한 맛을 더욱 살려주고 개운함을 더해줘요.' }, { name: '미나리', reason: '향긋한 미나리가 꽃게의 풍미를 더하고 비린 맛을 잡아줘요.' }, { name: '콩나물', reason: '아삭한 식감을 더하고 국물 요리에 시원함을 더해준답니다.' }], avoidPairings: [{ name: '감', reason: '게와 감은 같이 먹으면 소화를 방해할 수 있다고 알려져 있어요.' }] },
      { name: '멍게', emoji: '🦪', description: '향긋하고 쌉쌀한 봄철 대표 별미', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/멍게.webp' , nutrition: '멍게에는 타우린이 풍부해서 봄철 피로 해소에 도움을 주고, 간 건강을 지키는 데 좋답니다. 또한, 혈액순환을 원활하게 해주는 팔미톨레산이 들어 있어 몸을 따뜻하게 해주고 활력을 불어넣어 줄 수 있어요.', howToChoose: '껍질의 붉은색이 선명하고 윤기가 흐르며, 만졌을 때 단단하고 탄력이 있는 것이 신선하답니다. 입수공과 출수공이 뚜렷하게 도드라져 있는 것을 고르시는 것이 좋아요.', tip: '멍게는 흐르는 물에 가볍게 씻어 껍질을 제거한 후, 내장을 깨끗이 떼어내고 드시면 된답니다. 손질한 멍게는 밀폐 용기에 담아 냉장 보관하면 2~3일 정도 신선하게 즐길 수 있어요.', goesWellWith: '초고추장, 비빔밥, 젓갈로 즐겨보세요.', pairings: [{ name: '오이', reason: '오이의 시원한 맛이 멍게의 향긋함을 더욱 돋보이게 해준답니다.' }, { name: '미나리', reason: '미나리의 향긋함이 멍게의 풍미를 살려주고 비린 맛을 잡아줘요.' }, { name: '참기름', reason: '고소한 참기름이 멍게의 맛을 부드럽게 감싸주고 풍미를 더해준답니다.' }], avoidPairings: [{ name: '식초 과다 사용', reason: '식초를 너무 많이 사용하면 멍게 본연의 향긋한 맛을 가릴 수 있어요.' }] },
      { name: '양상추', emoji: '🥬', description: '아삭한 식감으로 봄 샐러드에 빠질 수 없는 채소', category: '채소', imageUrl: '/images/ingredients/양상추.webp', origin: '강원 평창' },
      { name: '머위', emoji: '🌿', description: '쌉싸름한 향과 씁쓸한 맛이 입맛을 돋우는 봄나물', category: '채소', imageUrl: '/images/ingredients/머위.webp', origin: '경남 거창' },
      { name: '상추', emoji: '🥬', description: '부드럽고 아삭한 쌈채소로 봄에 가장 달다', category: '채소', imageUrl: '/images/ingredients/상추.webp', origin: '경기 평택' },
      { name: '참나물', emoji: '🌿', description: '향긋하고 아삭한 식감의 봄나물', category: '채소', imageUrl: '/images/ingredients/참나물.webp', origin: '강원 정선' },
      { name: '미나리', emoji: '🌿', description: '향긋한 향이 입맛을 돋우는 봄나물', category: '채소', imageUrl: '/images/ingredients/미나리.webp', origin: '경남 함양' },
      { name: '한라봉', emoji: '🍊', description: '향긋하고 달콤한 봄철 감귤', category: '과일', imageUrl: '/images/ingredients/한라봉.webp', origin: '제주' },
      { name: '사과', emoji: '🍎', description: '저장 사과가 마지막으로 맛있는 시기', category: '과일', imageUrl: '/images/ingredients/사과.webp', origin: '경북 청송' },
      { name: '키위', emoji: '🥝', description: '새콤달콤하고 비타민이 풍부한 과일', category: '과일', imageUrl: '/images/ingredients/키위.webp', origin: '전남 해남' },
      { name: '황금향', emoji: '🍊', description: '향이 좋고 과즙이 풍부한 만감류', category: '과일', imageUrl: '/images/ingredients/황금향.webp', origin: '제주' },
      { name: '키조개', emoji: '🐚', description: '쫄깃한 관자가 별미인 봄 조개', category: '해산물', imageUrl: '/images/ingredients/키조개.webp', origin: '충남 보령' },
      { name: '바지락', emoji: '🐚', description: '시원한 국물 맛을 내는 봄철 조개', category: '해산물', imageUrl: '/images/ingredients/바지락.webp', origin: '충남 태안' },
      { name: '도미', emoji: '🐟', description: '담백하고 쫄깃한 살이 매력적인 봄 생선', category: '해산물', imageUrl: '/images/ingredients/도미.webp', origin: '제주' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '느타리버섯', emoji: '🍄', description: '부드러운 식감과 은은한 향이 매력적인 버섯', category: '버섯', imageUrl: '/images/ingredients/느타리버섯.webp', origin: '충남 부여' },
      { name: '검은콩', emoji: '🫘', description: '구수한 맛과 영양이 풍부한 콩', category: '곡물', imageUrl: '/images/ingredients/검은콩.webp', origin: '강원 홍천' },
      { name: '들깨', emoji: '🌾', description: '고소한 향이 진한 들깨', category: '곡물', imageUrl: '/images/ingredients/들깨.webp', origin: '충남 천안' },
      { name: '천혜향', emoji: '🍊', description: '향이 진하고 과즙이 풍부한 만감류', category: '과일', imageUrl: '/images/ingredients/천혜향.webp', origin: '제주' },
    ],
    recipeIds: ['4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7', '4-8', '4-9', '4-10', '4-11', '4-12', '4-13', '4-14', '4-15'],
  },
  {
    month: 5,
    season: '늦봄',
    solarTerm: '입하 · 소만',
    headline: '초여름으로 가는 길목, 입맛을 깨우는 산뜻함',
    description: '날이 따뜻해지며 새콤한 과일과 부드러운 해산물이 어우러집니다. 가벼우면서도 영양이 가득한 메뉴가 잘 어울려요.',
    ingredients: [
      { name: '꽃게', emoji: '🦀', description: '알이 가장 실한 봄 암꽃게의 절정기', category: '해산물', origin: '충남 태안·서천', imageUrl: '/images/ingredients/꽃게.webp' , nutrition: '꽃게는 타우린이 풍부해 피로 해소와 간 기능 개선에 도움을 줄 수 있답니다. 또한 키토산 성분은 면역력 강화와 혈액순환에 긍정적인 영향을 줄 수 있어요.', howToChoose: '껍질이 단단하고 윤기가 돌며, 배 부분이 하얗고 알이 꽉 찬 암꽃게를 고르는 것이 좋아요. 들었을 때 묵직한 무게감이 느껴지는 것이 신선한 꽃게랍니다.', tip: '솔로 배와 다리 사이를 깨끗하게 문질러 씻어주세요. 내장을 제거하지 않고 냉동 보관하면 신선도를 오래 유지할 수 있으며, 3개월 이내에 드시는 것이 좋답니다.', goesWellWith: '찜이나 탕으로 즐기면 더욱 좋아요.', pairings: [{ name: '무', reason: '시원한 맛을 더하고 꽃게의 감칠맛을 살려주어요.' }, { name: '콩나물', reason: '아삭한 식감을 더하고 국물 맛을 시원하게 해준답니다.' }, { name: '미나리', reason: '향긋한 향으로 꽃게의 풍미를 더하고 비린 맛을 잡아주어요.' }] },
      { name: '매실', emoji: '🍋', description: '5월에 수확해 장아찌와 청으로 즐기는 과실', category: '과일', origin: '전남 광양', imageUrl: '/images/ingredients/매실.webp' , nutrition: '매실에는 유기산이 풍부해서 피로 해소에 도움을 주고 소화를 촉진하는 데 좋답니다. 또한, 칼슘이 풍부하여 여름철 뼈 건강을 지키고 신경 안정에도 도움을 줄 수 있어요.', howToChoose: '껍질에 흠집 없이 깨끗하고, 초록빛이 선명하며 단단한 것을 고르세요. 알이 굵고 통통하며 묵직한 것이 좋답니다.', tip: '흐르는 물에 깨끗이 씻은 후 이쑤시개 등으로 꼭지를 제거해 주세요. 물기를 완전히 제거한 후 설탕과 함께 청이나 장아찌로 만들어 서늘한 곳에 보관하시면 오래 즐길 수 있어요.', goesWellWith: '설탕이나 꿀과 함께 청으로 만들어요.', pairings: [{ name: '설탕', reason: '매실의 신맛을 중화시키고 발효를 도와 청이나 장아찌를 만들기에 좋아요.' }, { name: '소금', reason: '매실 장아찌를 만들 때 삼투압 작용을 통해 수분을 빼고 맛을 응축시켜 준답니다.' }, { name: '꿀', reason: '매실청을 만들 때 설탕 대신 사용하면 더욱 부드러운 단맛과 풍미를 더해줘요.' }] },
      { name: '키조개', emoji: '🦪', description: '관자가 통통하게 차오르는 늦봄 조개', category: '해산물', origin: '충남 보령', imageUrl: '/images/ingredients/키조개.webp' , nutrition: '키조개는 타우린이 풍부해서 피로 회복에 도움을 주고 간 건강을 지켜주는 데 좋답니다. 또한, 아미노산과 단백질이 풍부해서 늦봄 기력을 보충하고 원기 회복을 돕는 데 아주 좋답니다.', howToChoose: '껍데기가 벌어지지 않고 닫혀 있으며, 껍데기를 살짝 두드렸을 때 단단하고 묵직한 것을 고르는 것이 좋아요. 관자는 통통하고 윤기가 나며 탄력이 있는 것이 신선하답니다.', tip: '키조개는 흐르는 물에 껍질을 솔로 문질러 씻은 후, 관자와 내장을 분리하여 사용하시면 돼요. 손질한 관자는 밀폐 용기에 담아 냉장고에 넣어 2~3일 안에 드시는 것이 좋고, 장기 보관 시에는 냉동 보관해 보세요.', goesWellWith: '버터구이나 샤브샤브로 즐겨보세요.', pairings: [{ name: '마늘', reason: '마늘의 알싸한 향이 키조개의 풍미를 더해주고 비린 맛을 잡아준답니다.' }, { name: '버터', reason: '버터의 고소함이 키조개 관자의 부드러운 맛과 어우러져 더욱 풍성한 맛을 내줘요.' }, { name: '아스파라거스', reason: '아스파라거스의 아삭한 식감이 키조개의 부드러운 관자와 좋은 조화를 이룬답니다.' }] },
      { name: '완두콩', emoji: '🫛', description: '아삭하고 달콤한 봄철 콩류', category: '채소', origin: '제주', imageUrl: '/images/ingredients/완두콩.webp' , nutrition: '완두콩에는 단백질이 풍부하여 성장기 어린이와 어르신들의 기력 보충에 도움을 주고, 식이섬유가 많아 장 활동을 원활하게 하여 봄철 소화를 돕고 몸을 가볍게 해준답니다.', howToChoose: '껍질이 선명한 초록색을 띠고 윤기가 흐르며, 알알이 통통하게 여물어 단단한 것을 고르시는 것이 좋아요. 껍질째 구매하실 때는 껍질이 마르거나 시들지 않고 촉촉한지 확인해 보세요.', tip: '흐르는 물에 깨끗이 씻어 껍질을 벗긴 후, 끓는 물에 살짝 데쳐 찬물에 헹궈 물기를 빼주세요. 데친 완두콩은 밀폐 용기에 담아 냉장 보관하시면 3~4일 정도 신선하게 즐기실 수 있답니다.', goesWellWith: '밥, 샐러드, 수프에 넣어 드시면 좋답니다.', pairings: [{ name: '쌀', reason: '부족한 필수 아미노산을 보충하여 영양 균형을 맞춰줘요.' }, { name: '새우', reason: '담백한 맛과 탱글한 식감이 잘 어우러져요.' }, { name: '베이컨', reason: '고소한 풍미를 더해 완두콩의 맛을 더욱 풍성하게 해줘요.' }] },
      { name: '아스파라거스', emoji: '🥦', description: '부드럽고 향긋한 봄 채소', category: '채소', origin: '충남 태안', imageUrl: '/images/ingredients/아스파라거스.webp' , nutrition: '아스파라거스는 아스파라긴산이 풍부해 봄철 피로 해소와 활력 증진에 도움을 주고요. 비타민 K도 많이 들어있어 뼈 건강을 튼튼하게 지키는 데 좋답니다.', howToChoose: '줄기가 곧고 단단하며, 전체적으로 선명하고 윤기 있는 녹색을 띠는 것이 신선해요. 봉우리가 벌어지지 않고 꽉 닫혀 있으며, 밑동의 단면이 마르지 않은 것을 고르시는 것이 좋답니다.', tip: '아스파라거스 밑동의 질긴 부분은 칼로 잘라내거나 손으로 꺾어 제거해주시면 좋아요. 신문지에 싸서 냉장고 채소 칸에 세워서 보관하시면 며칠간 신선하게 드실 수 있답니다.', goesWellWith: '구이나 볶음으로 즐기기 좋고, 올리브유와 잘 어울려요.', pairings: [{ name: '달걀', reason: '단백질과 비타민이 풍부해 영양 균형을 맞추고 포만감을 더해준답니다.' }, { name: '새우', reason: '담백한 맛과 탱글한 식감이 어우러져 고급스러운 풍미를 더해준답니다.' }, { name: '올리브 오일', reason: '아스파라거스의 지용성 비타민 흡수를 돕고 풍미를 살려준답니다.' }] },
      { name: '갑오징어', emoji: '🦑', description: '담백하고 쫄깃한 제철 별미, 타우린이 풍부해요', category: '해산물', origin: '전남 여수', imageUrl: '/images/ingredients/갑오징어.webp' },
      { name: '병어', emoji: '🐟', description: '뼈가 연해 통째로 즐기기 좋은 초여름 생선', category: '해산물', origin: '전남 신안', imageUrl: '/images/ingredients/병어.webp' , nutrition: '단백질이 풍부해 기력 회복과 근육 유지에 도움을 주며, 특히 소화 흡수가 잘 되는 양질의 단백질이랍니다. 불포화지방산인 오메가-3 지방산도 많아 혈관 건강을 지키고 여름철 지친 몸에 활력을 더해주는 데 좋답니다.', howToChoose: '몸 전체에 은빛 윤기가 돌고 살이 단단하며 탄력 있는 것이 신선해요. 아가미는 선명한 붉은색을 띠고 눈은 맑고 투명한 것을 고르시는 것이 좋답니다.', tip: '비늘을 긁어내고 내장을 제거한 후 흐르는 물에 깨끗이 씻어 준비해 보세요. 손질한 병어는 물기를 제거하여 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 신선하게 드실 수 있어요.', goesWellWith: '구이나 조림으로 담백하게 즐겨보세요.', pairings: [{ name: '무', reason: '무의 시원한 맛이 병어의 감칠맛을 더하고 소화를 돕습니다.' }, { name: '대파', reason: '대파의 향이 병어의 비린 맛을 잡아주고 풍미를 살려줍니다.' }, { name: '생강', reason: '생강은 병어의 잡내를 없애고 개운한 맛을 더해줍니다.' }] },
      { name: '뱅어', emoji: '🐟', description: '실처럼 가늘고 투명한 봄철 별미 치어', category: '해산물', origin: '전남 무안', imageUrl: '/images/ingredients/뱅어.webp' , nutrition: '뱅어는 칼슘이 풍부하여 성장기 어린이의 뼈 건강과 어르신들의 골다공증 예방에 도움을 줄 수 있답니다. 또한, 단백질 함량이 높아 기력이 약해지기 쉬운 봄철에 활력을 더해주는 데 좋답니다.', howToChoose: '몸통이 투명하고 실처럼 가늘면서도 탄력이 있는 것을 고르세요. 흐물거리지 않고 맑은 빛을 띠는 것이 신선하답니다.', tip: '흐르는 물에 가볍게 헹궈 이물질만 제거하고 물기를 빼서 사용하시면 돼요. 키친타월에 싸서 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 신선하게 드실 수 있어요.', goesWellWith: '튀김이나 무침, 전으로 즐겨보세요.', pairings: [{ name: '달걀', reason: '부드러운 식감과 고소한 맛이 어우러져 영양을 보충해줘요.' }, { name: '미나리', reason: '향긋한 향이 뱅어의 담백한 맛을 더욱 돋보이게 해줘요.' }, { name: '무', reason: '시원하고 개운한 맛을 더해 뱅어의 풍미를 살려줘요.' }] },
      { name: '오이', emoji: '🥒', description: '수분 가득하고 아삭한 초여름 대표 채소', category: '채소', imageUrl: '/images/ingredients/오이.webp', origin: '충남 부여' },
      { name: '참외', emoji: '🍈', description: '달콤한 향과 아삭한 과육의 여름 초입 과일', category: '과일', imageUrl: '/images/ingredients/참외.webp', origin: '경북 성주' },
      { name: '한치', emoji: '🦑', description: '쫄깃하고 담백한 맛의 초여름 오징어류', category: '해산물', imageUrl: '/images/ingredients/한치.webp', origin: '제주' },
      { name: '풋마늘', emoji: '🧄', description: '알이 통통하고 향이 진한 그해 첫 마늘', category: '채소', imageUrl: '/images/ingredients/풋마늘.webp', origin: '경남 남해' },
      { name: '상추', emoji: '🥬', description: '아삭하고 신선한 봄철 쌈채소', category: '채소', imageUrl: '/images/ingredients/상추.webp', origin: '경기 평택' },
      { name: '부추', emoji: '🌿', description: '향이 진하고 영양이 풍부한 봄 채소', category: '채소', imageUrl: '/images/ingredients/부추.webp', origin: '경기 남양주' },
      { name: '양상추', emoji: '🥬', description: '아삭한 식감의 봄철 쌈채소', category: '채소', imageUrl: '/images/ingredients/양상추.webp', origin: '강원 평창' },
      { name: '깻잎', emoji: '🌿', description: '향긋한 향으로 쌈과 무침에 두루 쓰이는 잎채소', category: '채소', imageUrl: '/images/ingredients/깻잎.webp', origin: '경북 청도' },
      { name: '산딸기', emoji: '🍓', description: '새콤한 맛이 매력적인 초여름 산딸기', category: '과일', imageUrl: '/images/ingredients/산딸기.webp', origin: '경북 청도' },
      { name: '살구', emoji: '🍑', description: '새콤달콤하고 향긋한 초여름 한정 과일', category: '과일', imageUrl: '/images/ingredients/살구.webp', origin: '경북 의성' },
      { name: '자두', emoji: '🍑', description: '새콤달콤한 과즙이 가득한 여름 과일', category: '과일', imageUrl: '/images/ingredients/자두.webp', origin: '경북 김천' },
      { name: '전복', emoji: '🐚', description: '쫄깃하고 영양이 풍부한 봄철 전복', category: '해산물', imageUrl: '/images/ingredients/전복.webp', origin: '전남 완도' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '느타리버섯', emoji: '🍄', description: '부드러운 식감과 은은한 향이 매력적인 버섯', category: '버섯', imageUrl: '/images/ingredients/느타리버섯.webp', origin: '충남 부여' },
      { name: '보리', emoji: '🌾', description: '고소한 맛이 매력적인 초여름 수확 곡물', category: '곡물', imageUrl: '/images/ingredients/보리.webp', origin: '전남 고창' },
      { name: '검은콩', emoji: '🫘', description: '구수한 맛과 영양이 풍부한 콩', category: '곡물', imageUrl: '/images/ingredients/검은콩.webp', origin: '강원 홍천' },
      { name: '복분자', emoji: '🫐', description: '새콤달콤하고 향이 진한 초여름 산딸기류', category: '과일', imageUrl: '/images/ingredients/복분자.webp', origin: '전북 고창' },
    ],
    recipeIds: ['5-1', '5-2', '5-3', '5-4', '5-5', '5-6', '5-7', '5-8', '5-9', '5-10', '5-11', '5-12', '5-13', '5-14', '5-15'],
  },
  {
    month: 6,
    season: '초여름',
    solarTerm: '망종 · 하지',
    headline: '쨍한 햇볕 아래 영양을 꽉 채운 6월의 선물',
    description: '강한 햇살을 받으며 자란 햇감자와 토마토가 영양을 가득 채웁니다. 본격적인 더위가 시작되기 전, 마지막 산뜻함을 즐겨보세요.',
    ingredients: [
      { name: '햇감자', emoji: '🥔', description: '포슬포슬한 식감의 그해 첫 감자', category: '채소', origin: '강원 강릉·평창', imageUrl: '/images/ingredients/햇감자.webp' , nutrition: '햇감자에는 칼륨이 풍부해서 여름철 땀으로 빠져나간 전해질을 채우고 붓기를 빼는 데 도움을 준답니다. 비타민 C도 들어있어 더위에 지친 몸의 활력을 되찾는 데 좋고, 식이섬유도 많아 장 건강에도 이로움을 줄 수 있어요.', howToChoose: '껍질이 얇고 매끈하며, 흠집이나 푸른빛이 없는 것을 고르시는 것이 좋아요. 손으로 들었을 때 단단하고 묵직한 느낌이 드는 것이 신선한 햇감자랍니다.', tip: '흙이 묻은 채로 신문지에 싸서 서늘하고 어두운 곳에 보관하시면 2주 정도 신선하게 드실 수 있어요. 감자 싹이 나면 독성이 생기니 바로 제거해 주시는 것이 좋답니다.', goesWellWith: '볶음, 조림, 국 등 다양하게 활용해 보세요.', pairings: [{ name: '양파', reason: '감자의 부족한 비타민 A를 보충해주고, 단맛을 더해줘요.' }, { name: '버터', reason: '고소한 풍미를 더해주고, 감자의 부드러움을 살려줘요.' }, { name: '치즈', reason: '감자의 담백함에 풍부한 맛을 더해주고, 칼슘을 보충해줘요.' }], avoidPairings: [{ name: '토마토', reason: '감자와 토마토를 함께 섭취하면 소화에 부담을 줄 수 있답니다.' }] },
      { name: '방울토마토', emoji: '🍅', description: '여름 초입 가장 달큰한 토마토', category: '채소', origin: '경남 밀양', imageUrl: '/images/ingredients/방울토마토.webp' , nutrition: '방울토마토에는 라이코펜이 풍부해서 여름철 강한 햇볕으로 지친 피부를 보호하고 활력을 더해주는 데 도움을 줘요. 비타민 C도 가득해서 더위에 지친 몸의 피로를 풀어주고 면역력을 높이는 데 좋답니다.', howToChoose: '껍질이 팽팽하고 윤기가 나며, 꼭지가 시들지 않고 초록색을 띠는 것을 고르세요. 손으로 만졌을 때 단단하고 묵직한 느낌이 드는 것이 신선하고 당도가 높답니다.', tip: '흐르는 물에 깨끗이 씻어 꼭지를 제거한 후 드시면 되고요. 실온에 보관하면 단맛이 더 강해지지만, 오래 보관할 경우 냉장고 신선칸에 넣어두면 1주일 정도 신선하게 즐길 수 있어요.', goesWellWith: '샐러드, 파스타, 또는 생으로 드세요.', pairings: [{ name: '올리브 오일', reason: '라이코펜의 체내 흡수율을 높여 영양을 더 효과적으로 섭취할 수 있어요.' }, { name: '바질', reason: '싱그러운 향이 방울토마토의 맛과 향을 더욱 풍부하게 만들어준답니다.' }, { name: '모짜렐라 치즈', reason: '부드러운 맛과 고소함이 방울토마토의 상큼함과 잘 어우러져요.' }] },
      { name: '갑오징어', emoji: '🦑', description: '살이 두툼하고 쫄깃한 초여름 오징어', category: '해산물', origin: '전남 여수', imageUrl: '/images/ingredients/갑오징어.webp' },
      { name: '블루베리', emoji: '🫐', description: '항산화 성분이 풍부한 여름 베리', category: '과일', origin: '전남 고창', imageUrl: '/images/ingredients/블루베리.webp' , nutrition: '블루베리에는 안토시아닌이 풍부해서 여름철 강한 햇볕과 전자기기 사용으로 지친 눈의 피로를 덜어주고 시력 보호에 도움을 준답니다. 또한, 식이섬유가 많아 더운 날씨에 활동량이 줄어들면서 더부룩해지기 쉬운 장을 편안하게 해주는 데 도움을 줘요.', howToChoose: '껍질에 하얀 과분(블룸)이 고루 덮여 있고, 알이 단단하며 탱글탱글한 것을 고르는 것이 좋아요. 무르거나 쭈글거리는 것 없이 색깔이 균일하고 진한 보랏빛을 띠는 것이 신선하답니다.', tip: '흐르는 물에 가볍게 씻어 물기를 제거한 후 드시는 것이 좋고, 밀폐 용기에 담아 냉장 보관하면 1주일 정도 신선하게 즐길 수 있어요. 오래 보관하고 싶으시다면 냉동 보관해보세요.', goesWellWith: '요거트나 샐러드에 곁들이면 좋아요.', pairings: [{ name: '요거트', reason: '유산균과 함께 섭취하면 장 건강에 더욱 좋답니다.' }, { name: '우유', reason: '블루베리의 상큼함이 우유와 만나 부드러운 맛을 내요.' }, { name: '레몬', reason: '새콤한 맛을 더해 블루베리의 풍미를 살려줘요.' }] },
      { name: '도다리', emoji: '🐟', description: '산란 후 살이 다시 차오르며 본격적으로 맛있어지는 시기예요', category: '해산물', origin: '경남 고성', imageUrl: '/images/ingredients/도다리.webp' },
      { name: '농어', emoji: '🐟', description: '탱글한 살이 일품인 여름 대표 흰살 생선', category: '해산물', origin: '전남 완도', imageUrl: '/images/ingredients/농어.webp' },
      { name: '전갱이', emoji: '🐟', description: '고소하고 기름진 초여름 등푸른 생선', category: '해산물', origin: '제주', imageUrl: '/images/ingredients/전갱이.webp' },
      { name: '깻잎', emoji: '🌿', description: '향긋한 향으로 여름 쌈과 무침에 두루 쓰이는 잎채소', category: '채소', imageUrl: '/images/ingredients/깻잎.webp', origin: '경북 청도' },
      { name: '자두', emoji: '🍑', description: '새콤달콤한 과즙이 가득한 여름 과일', category: '과일', imageUrl: '/images/ingredients/자두.webp', origin: '경북 김천' },
      { name: '멸치', emoji: '🐟', description: '작고 짭짤한 맛으로 국물 요리에 깊은 맛을 더하는 생선', category: '해산물', imageUrl: '/images/ingredients/멸치.webp', origin: '경남 남해' },
      { name: '오이', emoji: '🥒', description: '수분 가득하고 아삭한 초여름 대표 채소', category: '채소', imageUrl: '/images/ingredients/오이.webp', origin: '충남 부여' },
      { name: '애호박', emoji: '🥒', description: '부드럽고 단맛이 좋아 볶음과 찌개에 두루 쓰이는 여름 호박', category: '채소', imageUrl: '/images/ingredients/애호박.webp', origin: '충남 부여' },
      { name: '풋고추', emoji: '🌶️', description: '아삭하고 알맞게 매운맛이 도는 초여름 고추', category: '채소', imageUrl: '/images/ingredients/풋고추.webp', origin: '경남 진주' },
      { name: '부추', emoji: '🌿', description: '향이 진하고 영양이 풍부해 여름철 보양 요리에 좋은 채소', category: '채소', imageUrl: '/images/ingredients/부추.webp', origin: '경기 남양주' },
      { name: '마늘쫑', emoji: '🧄', description: '아삭한 식감과 은은한 마늘 향이 매력적인 마늘의 꽃대', category: '채소', imageUrl: '/images/ingredients/마늘쫑.webp', origin: '경남 남해' },
      { name: '살구', emoji: '🍑', description: '새콤달콤하고 향긋한 초여름 한정 과일', category: '과일', imageUrl: '/images/ingredients/살구.webp', origin: '경북 의성' },
      { name: '산딸기', emoji: '🍓', description: '새콤한 맛이 매력적인 여름 산딸기', category: '과일', imageUrl: '/images/ingredients/산딸기.webp', origin: '경북 청도' },
      { name: '참외', emoji: '🍈', description: '아삭하고 달콤한 한국 대표 여름 과일', category: '과일', imageUrl: '/images/ingredients/참외.webp', origin: '경북 성주' },
      { name: '민어', emoji: '🐟', description: '살이 부드럽고 담백해 여름 보양식으로 으뜸인 생선', category: '해산물', imageUrl: '/images/ingredients/민어.webp', origin: '전남 신안' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '느타리버섯', emoji: '🍄', description: '부드러운 식감과 은은한 향이 매력적인 버섯', category: '버섯', imageUrl: '/images/ingredients/느타리버섯.webp', origin: '충남 부여' },
      { name: '보리', emoji: '🌾', description: '고소한 맛과 풍부한 식이섬유가 매력적인 초여름 수확 곡물', category: '곡물', imageUrl: '/images/ingredients/보리.webp', origin: '전남 고창' },
      { name: '햇마늘', emoji: '🧄', description: '알이 통통하고 향이 진한 그해 첫 마늘', category: '곡물', imageUrl: '/images/ingredients/햇마늘.webp', origin: '경남 남해·의성' },
      { name: '수박', emoji: '🍉', description: '수분 가득하고 시원한 초여름 대표 과일', category: '과일', imageUrl: '/images/ingredients/수박.webp', origin: '충남 부여' },
    ],
    recipeIds: ['6-1', '6-2', '6-3', '6-4', '6-5', '6-6', '6-7', '6-8', '6-9', '6-10', '6-11', '6-12', '6-13', '6-14', '6-15'],
  },
  {
    month: 7,
    season: '한여름',
    solarTerm: '소서 · 대서',
    headline: '땀 흘리는 한여름, 온몸을 촉촉하게 달래줄 과채',
    description: '무더위가 절정에 이르는 시기, 수분이 많고 시원한 식재료가 몸의 열기를 식혀줍니다. 옥수수와 수박의 계절이에요.',
    ingredients: [
      { name: '초당옥수수', emoji: '🌽', description: '생으로도 달콤한 여름 별미 옥수수', category: '채소', origin: '강원 강릉(초당)', imageUrl: '/images/ingredients/초당옥수수.webp' , nutrition: '초당옥수수에는 비타민 B군이 풍부하여 여름철 무더위에 지친 몸의 피로 회복에 도움을 줄 수 있답니다. 또한 식이섬유도 많이 들어있어 더위에 지치기 쉬운 장 건강을 편안하게 지켜주는 데 좋답니다.', howToChoose: '껍질이 선명한 녹색을 띠고 촉촉하며, 옥수수수염은 갈색빛을 띠면서 윤기가 나는 것이 신선하답니다. 알갱이가 촘촘하고 단단하게 박혀 있으며, 눌렀을 때 탄력이 느껴지는 것이 좋아요.', tip: '겉껍질 몇 장만 남기고 벗긴 후 흐르는 물에 깨끗이 씻어주세요. 냉장 보관 시에는 껍질째 비닐봉지에 넣어 냉장고 채소칸에 3~4일 정도 보관하시면 좋고, 장기 보관은 삶아서 알갱이만 분리해 냉동 보관하는 것을 추천해요.', goesWellWith: '버터구이나 샐러드로 즐겨보세요.', pairings: [{ name: '버터', reason: '고소한 풍미를 더해 옥수수의 단맛을 더욱 돋보이게 해준답니다.' }, { name: '우유', reason: '부드러운 맛과 영양을 더해 고소하고 든든한 간식으로 좋아요.' }, { name: '새우', reason: '단맛과 감칠맛이 어우러져 샐러드나 볶음 요리에 잘 어울린답니다.' }] },
      { name: '갈치', emoji: '🐟', description: '은빛 비늘이 매력적인 여름 생선', category: '해산물', origin: '제주', imageUrl: '/images/ingredients/갈치.webp' , nutrition: '갈치는 단백질이 풍부해서 여름철 기력 보충에 아주 좋답니다. 또한 불포화지방산인 EPA와 DHA가 풍부하게 들어있어 혈액순환을 원활하게 하고 두뇌 건강에도 도움을 줄 수 있어요.', howToChoose: '싱싱한 갈치는 은빛 비늘이 벗겨지지 않고 윤기가 돌며, 몸통이 단단하고 탄력이 느껴져요. 아가미는 선홍색을 띠고 눈은 맑고 투명한 것을 고르는 것이 좋답니다.', tip: '갈치는 비늘을 칼등으로 살살 긁어 제거하고 내장을 깨끗이 손질한 후 물로 헹궈주세요. 손질한 갈치는 소금을 살짝 뿌려 냉장고에 1~2일 정도 보관하거나, 밀봉하여 냉동 보관하면 한 달까지 두고 드실 수 있어요.', goesWellWith: '구이나 조림으로 즐겨보세요.', pairings: [{ name: '무', reason: '무의 시원한 맛이 갈치의 감칠맛을 더하고 소화를 돕는답니다.' }, { name: '대파', reason: '대파의 향긋함이 갈치의 비린 맛을 잡아주고 풍미를 살려줘요.' }, { name: '양파', reason: '양파의 단맛이 갈치 요리의 맛을 부드럽게 하고 영양 균형을 맞춰줘요.' }] },
      { name: '수박', emoji: '🍉', description: '한여름 더위를 씻어주는 대표 과일', category: '과일', origin: '충남 부여·전남 함평', imageUrl: '/images/ingredients/수박.webp' , nutrition: '수박은 수분 함량이 높아 여름철 갈증 해소에 탁월하며, 시트룰린 성분이 풍부해 이뇨 작용을 돕고 혈액순환을 원활하게 하는 데 도움을 준답니다. 또한, 라이코펜이 많아 뜨거운 햇볕으로부터 피부 건강을 지키는 데도 좋답니다.', howToChoose: '껍질의 검은 줄무늬가 선명하고 윤기가 흐르며, 손으로 두드렸을 때 맑고 경쾌한 소리가 나는 것이 좋아요. 전체적으로 묵직하고 단단하며, 배꼽 부분이 작고 꼭지가 싱싱한 것을 고르시는 것이 좋답니다.', tip: '수박은 겉껍질을 깨끗이 씻은 후 잘라 밀폐 용기에 담아 냉장 보관하시면 신선함을 오래 유지할 수 있어요. 남은 수박은 랩으로 잘 싸서 냉장고에 넣어두시고, 가급적 3~4일 내에 드시는 것이 가장 좋답니다.', goesWellWith: '화채나 샐러드로 시원하게 즐겨보세요.', pairings: [{ name: '우유', reason: '부드러운 맛이 더해져 수박의 달콤함을 살려주고, 영양을 보완해줘요.' }, { name: '치즈', reason: '짭짤한 맛이 수박의 단맛을 더욱 돋보이게 하고, 색다른 풍미를 선사해요.' }, { name: '민트', reason: '상쾌한 향이 수박의 시원함을 배가시키고, 청량감을 더해준답니다.' }], avoidPairings: [{ name: '찬 음식', reason: '수박 자체가 차가운 성질이라 너무 많은 찬 음식과 함께 먹으면 속이 불편할 수 있어요.' }] },
      { name: '가지', emoji: '🍆', description: '부드럽고 영양 가득한 여름 채소', category: '채소', origin: '경남 진주', imageUrl: '/images/ingredients/가지.webp' , nutrition: '가지에는 안토시아닌이 풍부해서 여름철 강한 햇볕으로 지친 몸의 활성산소를 제거하고 세포를 보호하는 데 도움을 준답니다. 또한, 식이섬유가 많아 더운 날씨에 쉽게 무거워질 수 있는 장을 편안하게 해주고 소화를 돕는 데 아주 좋답니다.', howToChoose: '껍질이 짙은 보랏빛을 띠고 윤기가 흐르며, 만졌을 때 단단하고 탄력이 느껴지는 가지가 신선해요. 꼭지가 마르지 않고 푸릇하며, 가지 전체에 흠집이나 무른 부분이 없는 것을 고르시는 것이 좋답니다.', tip: '가지는 물에 가볍게 씻어 꼭지를 제거한 후 사용하시면 되어요. 신문지나 키친타월에 싸서 냉장고 채소 칸에 보관하면 일주일 정도 신선하게 즐기실 수 있답니다.', goesWellWith: '볶음, 구이, 찜 등 다양한 요리에 잘 어울려요.', pairings: [{ name: '들기름', reason: '가지의 부드러운 식감과 고소한 맛이 잘 어우러져 풍미를 더해줘요.' }, { name: '양파', reason: '양파의 단맛과 향이 가지의 맛을 더욱 풍성하게 만들어 준답니다.' }, { name: '다진 마늘', reason: '마늘의 알싸한 향이 가지의 맛을 살리고 요리의 풍미를 높여줘요.' }] },
      { name: '민어', emoji: '🐟', description: '여름 보양식의 대표, "복달임"에 즐기는 생선', category: '해산물', origin: '전남 신안', imageUrl: '/images/ingredients/민어.webp' , nutrition: '단백질이 풍부하여 여름철 기력 회복과 면역력 증진에 도움을 주고요. 불포화지방산도 많아 혈관 건강을 지키고 피로를 풀어주는 데 좋답니다.', howToChoose: '눈이 맑고 투명하며, 아가미는 선홍빛을 띠는 것이 신선해요. 몸통을 눌렀을 때 탄력이 있고 단단하며 비늘이 잘 붙어있는 것을 골라보세요.', tip: '내장과 비늘을 깨끗하게 제거한 후 흐르는 물에 씻어 물기를 제거해주세요. 손질한 민어는 키친타월로 감싸 밀폐 용기에 넣어 냉장 보관하면 1~2일 정도 신선하게 즐길 수 있답니다.', goesWellWith: '매운탕이나 찜으로 즐겨보세요.', pairings: [{ name: '무', reason: '시원하고 개운한 맛을 더하고 소화를 돕는답니다.' }, { name: '미나리', reason: '향긋한 풍미를 더하고 민어의 비린 맛을 잡아줘요.' }, { name: '두부', reason: '부드러운 식감을 더하고 영양 균형을 맞춰준답니다.' }] },
      { name: '장어', emoji: '🐟', description: '기력 보충에 좋은 여름 보양식 재료', category: '해산물', origin: '전남 고창·풍천', imageUrl: '/images/ingredients/장어.webp' , nutrition: '장어는 불포화지방산이 풍부하여 혈관 건강에 도움을 주고 여름철 지친 기력을 보충하는 데 좋답니다. 비타민 A도 풍부해서 눈 건강과 면역력 증진에 도움을 줄 수 있어요.', howToChoose: '살아있는 장어는 몸통이 통통하고 탄력이 있으며, 움직임이 활발한 것을 고르시는 것이 좋아요. 손질된 장어는 살이 단단하고 윤기가 돌며, 선홍빛을 띠는 것이 신선하답니다.', tip: '장어는 미끄러운 점액질을 칼등으로 긁어내거나 굵은소금으로 문질러 제거한 뒤 흐르는 물에 깨끗이 씻어주세요. 손질 후에는 물기를 제거하고 밀봉하여 냉장 보관하면 2~3일, 냉동 보관하면 한 달 정도 신선하게 드실 수 있답니다.', goesWellWith: '구이나 덮밥으로 즐겨보세요.', pairings: [{ name: '생강', reason: '장어의 비린 맛을 잡아주고 소화를 돕는 역할을 한답니다.' }, { name: '부추', reason: '장어와 함께 먹으면 영양 균형을 맞추고 맛의 조화를 이뤄요.' }, { name: '깻잎', reason: '향긋한 깻잎은 장어의 풍미를 더해주고 느끼함을 줄여준답니다.' }] },
      { name: '깻잎', emoji: '🌿', description: '향긋한 향으로 쌈과 무침에 두루 쓰이는 잎채소', category: '채소', imageUrl: '/images/ingredients/깻잎.webp', origin: '경북 청도' },
      { name: '복분자', emoji: '🫐', description: '새콤달콤하고 진한 향의 여름 산딸기', category: '과일', imageUrl: '/images/ingredients/복분자.webp', origin: '전북 고창' },
      { name: '열무', emoji: '🥬', description: '아삭하고 시원해 여름 김치에 빠질 수 없는 채소', category: '채소', imageUrl: '/images/ingredients/열무.webp', origin: '경기 여주' },
      { name: '오이', emoji: '🥒', description: '수분 가득하고 아삭한 한여름 대표 채소', category: '채소', imageUrl: '/images/ingredients/오이.webp', origin: '충남 부여' },
      { name: '애호박', emoji: '🥒', description: '부드럽고 단맛이 좋아 볶음과 찌개에 두루 쓰이는 여름 호박', category: '채소', imageUrl: '/images/ingredients/애호박.webp', origin: '충남 부여' },
      { name: '풋고추', emoji: '🌶️', description: '아삭하고 알맞게 매운맛이 도는 한여름 고추', category: '채소', imageUrl: '/images/ingredients/풋고추.webp', origin: '경남 진주' },
      { name: '부추', emoji: '🌿', description: '향이 진하고 영양이 풍부해 여름철 보양 요리에 좋은 채소', category: '채소', imageUrl: '/images/ingredients/부추.webp', origin: '경기 남양주' },
      { name: '자두', emoji: '🍑', description: '새콤달콤한 과즙이 가득한 여름 과일', category: '과일', imageUrl: '/images/ingredients/자두.webp', origin: '경북 김천' },
      { name: '산딸기', emoji: '🍓', description: '새콤한 맛이 매력적인 여름 산딸기', category: '과일', imageUrl: '/images/ingredients/산딸기.webp', origin: '경북 청도' },
      { name: '멜론', emoji: '🍈', description: '향긋하고 달콤한 한여름 과일', category: '과일', imageUrl: '/images/ingredients/멜론.webp', origin: '충남 부여' },
      { name: '전복', emoji: '🐚', description: '쫄깃하고 영양이 풍부한 여름 보양 식재료', category: '해산물', imageUrl: '/images/ingredients/전복.webp', origin: '전남 완도' },
      { name: '보리새우', emoji: '🦐', description: '고소하고 탱탱한 살이 매력적인 여름 새우', category: '해산물', imageUrl: '/images/ingredients/보리새우.webp', origin: '경남 거제' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '느타리버섯', emoji: '🍄', description: '부드러운 식감과 은은한 향이 매력적인 버섯', category: '버섯', imageUrl: '/images/ingredients/느타리버섯.webp', origin: '충남 부여' },
      { name: '보리', emoji: '🌾', description: '고소한 맛과 풍부한 식이섬유가 매력적인 곡물', category: '곡물', imageUrl: '/images/ingredients/보리.webp', origin: '전남 고창' },
      { name: '풋콩', emoji: '🫘', description: '고소하고 부드러운 한여름 햇콩', category: '곡물', imageUrl: '/images/ingredients/풋콩.webp', origin: '강원 홍천' },
      { name: '블루베리', emoji: '🫐', description: '항산화 성분이 풍부한 여름 베리', category: '과일', imageUrl: '/images/ingredients/블루베리.webp', origin: '전남 고창' },
    ],
    recipeIds: ['7-1', '7-2', '7-3', '7-4', '7-5', '7-6', '7-7', '7-8', '7-9', '7-10', '7-11', '7-12', '7-13', '7-14', '7-15'],
  },
  {
    month: 8,
    season: '늦여름',
    solarTerm: '입추 · 처서',
    headline: '기운 없는 늦여름을 버티게 하는 바다의 보양식',
    description: '더위에 지친 몸을 보양식으로 채워주는 시기입니다. 전복과 같은 영양 가득한 해산물이 기력 회복에 큰 도움이 돼요.',
    ingredients: [
      { name: '전복', emoji: '🐚', description: '여름 보양식의 대표 식재료', category: '해산물', origin: '전남 완도', imageUrl: '/images/ingredients/전복.webp' , nutrition: '아르기닌과 타우린이 풍부해 여름철 지친 기력을 회복하고 피로 해소에 도움을 줘요. 비타민과 미네랄도 다양하게 함유되어 있어 전반적인 면역력 강화에 좋답니다.', howToChoose: '껍질이 매끄럽고 윤기가 돌며, 손으로 만졌을 때 살이 단단하게 느껴지는 것이 신선해요. 가장자리가 깨끗하고 움직임이 활발한 것을 고르시는 것이 좋답니다.', tip: '솔로 깨끗이 문질러 씻은 후 숟가락으로 살을 분리하고 내장과 이빨을 제거해 주세요. 냉장 보관 시에는 물기를 제거하여 밀폐 용기에 담아 2~3일 내에 드시는 것이 좋아요.', goesWellWith: '버터구이나 전복죽으로 즐겨 보세요.', pairings: [{ name: '미역', reason: '미역의 알긴산이 전복의 영양 흡수를 돕고 맛의 조화를 이뤄요.' }, { name: '버터', reason: '버터의 고소한 풍미가 전복의 맛을 더욱 풍부하게 해줘요.' }, { name: '찹쌀', reason: '찹쌀의 부드러운 식감이 전복의 쫄깃함과 어우러져 소화에 도움을 줘요.' }], avoidPairings: [{ name: '감', reason: '감의 떫은맛이 전복의 섬세한 맛을 해칠 수 있어요.' }] },
      { name: '복숭아', emoji: '🍑', description: '과즙이 풍부한 늦여름 과일', category: '과일', origin: '경북 청도·충북 충주', imageUrl: '/images/ingredients/복숭아.webp' , nutrition: '복숭아는 비타민 C가 풍부하여 여름철 자외선으로부터 피부를 보호하고 활력을 더해주는 데 도움을 줘요. 또한 칼륨이 많아 땀을 많이 흘리는 여름에 부족해지기 쉬운 전해질을 보충하고 몸의 균형을 유지하는 데 좋답니다.', howToChoose: '껍질에 상처 없이 깨끗하고, 전체적으로 붉은빛이 돌면서 노란색을 띠는 것이 좋아요. 봉합선이 뚜렷하고 좌우 대칭이 잘 맞으며, 만졌을 때 너무 무르지 않고 적당히 단단한 것을 고르시는 것이 좋답니다.', tip: '복숭아는 흐르는 물에 깨끗이 씻어 껍질째 드시는 것이 영양분을 온전히 섭취하는 데 좋아요. 실온에 보관하시면 향과 당도가 더욱 좋아지며, 냉장 보관 시에는 키친타월로 감싸 비닐봉투에 넣어두면 며칠 더 신선하게 즐기실 수 있어요.', goesWellWith: '샐러드나 잼, 요거트와 잘 어울려요.', pairings: [{ name: '요거트', reason: '유산균과 복숭아의 식이섬유가 만나 장 건강에 시너지를 낸답니다.' }, { name: '닭고기', reason: '복숭아의 새콤달콤한 맛이 닭고기의 풍미를 더하고 부드러운 식감을 줘요.' }, { name: '치즈', reason: '복숭아의 단맛과 치즈의 짭짤한 맛이 어우러져 고급스러운 맛을 낸답니다.' }], avoidPairings: [{ name: '장어', reason: '복숭아의 산성 성분이 장어의 지방 소화를 방해할 수 있어요.' }] },
      { name: '포도', emoji: '🍇', description: '당도가 절정에 이르는 여름 끝물 과일', category: '과일', origin: '경북 영천·경남 김천', imageUrl: '/images/ingredients/포도.webp' , nutrition: '포도에는 레스베라트롤이라는 항산화 성분이 풍부해서 여름철 강한 햇볕에 지친 피부 건강을 지키고 활력을 되찾는 데 도움을 준답니다. 또한, 칼륨이 많이 들어있어 땀을 많이 흘리는 여름에 부족해지기 쉬운 전해질을 보충하고 몸속 나트륨 배출을 도와 붓기를 가라앉히는 데도 좋답니다.', howToChoose: '알이 굵고 껍질에 하얀 분이 고루 퍼져 있으며, 송이가 단단하고 촘촘하게 붙어 있는 것이 신선해요. 꼭지가 마르지 않고 푸른색을 띠는 것을 고르시면 당도가 높은 포도를 만나실 수 있을 거예요.', tip: '포도는 드시기 직전에 흐르는 물에 깨끗하게 씻어주세요. 보관하실 때는 송이째 신문지나 키친타월에 싸서 밀폐 용기에 담아 냉장 보관하시면 1주일 정도 신선하게 드실 수 있답니다.', goesWellWith: '샐러드나 주스로 즐겨보세요.', pairings: [{ name: '치즈', reason: '포도의 달콤함과 치즈의 짭짤함이 어우러져 맛의 균형을 이룬답니다.' }, { name: '견과류', reason: '포도의 부드러운 식감에 견과류의 고소함과 바삭함을 더해준답니다.' }, { name: '요거트', reason: '새콤달콤한 포도와 요거트가 만나 부드럽고 상큼한 맛을 낸답니다.' }] },
      { name: '고구마순', emoji: '🌿', description: '아삭한 식감의 늦여름 채소', category: '채소', origin: '전남 해남', imageUrl: '/images/ingredients/고구마순.webp' , nutrition: '고구마순에는 칼륨이 풍부해서 여름철 땀으로 빠져나간 전해질을 보충하고 몸의 붓기를 빼는 데 도움을 준답니다. 또한, 식이섬유가 많아 더위에 지친 장을 편안하게 해주고 활발한 활동을 돕는 데 아주 좋답니다.', howToChoose: '줄기가 너무 굵지 않고 적당히 가늘면서 전체적으로 연둣빛을 띠는 것이 좋답니다. 꺾었을 때 \'뚝\' 하고 시원하게 부러지는 아삭한 느낌이 드는지 확인해 보세요.', tip: '고구마순은 껍질을 벗겨 끓는 물에 소금을 약간 넣고 데친 후 찬물에 여러 번 헹궈 아린 맛을 제거해 주세요. 데친 고구마순은 물기를 꼭 짜서 밀폐 용기에 담아 냉장 보관하면 3~4일 정도 신선하게 드실 수 있답니다.', goesWellWith: '들깨가루 넣어 볶음으로 즐겨보세요.', pairings: [{ name: '들깨가루', reason: '고소한 맛과 향을 더해주고, 고구마순의 부드러운 식감과도 잘 어울린답니다.' }, { name: '멸치 육수', reason: '감칠맛을 더해 고구마순 특유의 담백한 맛을 더욱 살려준답니다.' }, { name: '돼지고기', reason: '고구마순의 아삭함과 돼지고기의 고소함이 만나 맛의 조화를 이룬답니다.' }] },
      { name: '우럭', emoji: '🐟', description: '쫄깃하고 담백해 매운탕으로 인기인 늦여름 생선', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/우럭.webp' , nutrition: '우럭은 단백질이 풍부해 여름철 기력 회복과 근육 유지에 도움을 준답니다. 또한, 불포화지방산이 많아 혈관 건강을 지키는 데도 좋고요.', howToChoose: '눈이 맑고 투명하며, 아가미 안쪽이 선명한 붉은색을 띠는 것이 신선해요. 몸통을 눌러보았을 때 단단하고 탄력이 있으며 비늘이 벗겨지지 않은 것을 고르시는 것이 좋답니다.', tip: '비늘을 긁어내고 지느러미와 내장을 깨끗하게 제거한 후 흐르는 물에 씻어 준비해주세요. 손질한 우럭은 밀봉하여 냉장 보관하면 1~2일 정도, 냉동 보관하면 한 달까지 신선하게 즐기실 수 있어요.', goesWellWith: '매운탕, 맑은탕, 구이로 즐겨보세요.', pairings: [{ name: '무', reason: '무의 시원한 맛이 우럭의 담백함을 살리고 국물 맛을 깊게 해줘요.' }, { name: '미나리', reason: '미나리의 향긋함이 우럭의 풍미를 더하고 비린 맛을 잡아준답니다.' }, { name: '콩나물', reason: '콩나물의 아삭한 식감이 우럭 요리에 시원함을 더해줘요.' }] },
      { name: '성게', emoji: '🦔', description: '진한 풍미가 일품인 늦여름 보양 별미', category: '해산물', origin: '제주', imageUrl: '/images/ingredients/성게.webp' , nutrition: '성게는 사포닌과 비타민 A가 풍부하여 여름철 떨어진 기력을 보충하고 피로 해소에 도움을 준답니다. 또한, 불포화지방산이 많아 혈액순환을 원활하게 하고 활력을 되찾는 데 좋다고 알려져 있어요.', howToChoose: '싱싱한 성게는 알이 탱글탱글하고 선명한 주황색을 띠며 윤기가 흐르는 것을 고르는 것이 좋아요. 껍질이 단단하고 가시가 살아있는 것이 신선하답니다.', tip: '성게알은 흐르는 물에 가볍게 헹궈 이물질을 제거한 후 체에 밭쳐 물기를 완전히 빼주세요. 밀폐 용기에 담아 냉장 보관하면 2~3일 정도 신선하게 즐길 수 있어요.', goesWellWith: '밥이나 국물 요리와 잘 어울려요.', pairings: [{ name: '미역', reason: '미역의 부드러운 맛이 성게의 진한 풍미를 더욱 살려줘요.' }, { name: '김', reason: '김의 고소함이 성게알의 풍미를 돋우고 식감을 더해줘요.' }, { name: '달걀', reason: '달걀찜이나 달걀말이에 넣으면 부드러운 식감과 고소한 맛이 잘 어우러져요.' }] },
      { name: '꽃새우', emoji: '🦐', description: '살이 탱글하게 오른 늦여름 새우', category: '해산물', origin: '경남 거제', imageUrl: '/images/ingredients/꽃새우.webp' , nutrition: '꽃새우는 단백질이 풍부하여 여름철 떨어진 기력을 보충하고 근육 건강을 지키는 데 도움을 준답니다. 또한, 타우린 성분이 많아 피로 해소와 콜레스테롤 수치를 조절하는 데도 좋답니다.', howToChoose: '껍질에 윤기가 흐르고 투명하며, 몸통이 단단하게 구부러져 탄력 있는 것이 신선한 꽃새우예요. 머리가 몸통에 단단히 붙어있고 검게 변색되지 않은 것을 골라보세요.', tip: '흐르는 물에 가볍게 씻어 머리와 내장을 제거한 후 요리하시면 된답니다. 손질한 새우는 밀폐 용기에 담아 냉장고에 보관하면 1~2일, 냉동 보관 시에는 한 달 정도 신선하게 즐길 수 있어요.', goesWellWith: '찜, 구이, 튀김 등 다양하게 즐겨보세요.', pairings: [{ name: '레몬', reason: '새우의 비린 맛을 잡아주고 상큼한 향을 더해 입맛을 돋우어 줍니다.' }, { name: '마늘', reason: '새우의 풍미를 살려주고 알리신 성분이 살균 작용을 도와줍니다.' }, { name: '버터', reason: '고소한 맛을 더해 새우의 감칠맛을 더욱 풍부하게 해줍니다.' }] },
      { name: '무화과', emoji: '🟣', description: '부드러운 단맛과 향이 진한 늦여름 과일', category: '과일', imageUrl: '/images/ingredients/무화과.webp', origin: '전남 영암' },
      { name: '풋고추', emoji: '🌶️', description: '아삭하고 알싸한 맛으로 여름 밥상을 살려주는 채소', category: '채소', imageUrl: '/images/ingredients/풋고추.webp', origin: '경남 진주' },
      { name: '갓', emoji: '🌿', description: '알싸하고 향긋한 맛으로 가을 김치에 두루 쓰이는 채소', category: '채소', imageUrl: '/images/ingredients/갓.webp', origin: '전남 여수 돌산' },
      { name: '가지', emoji: '🍆', description: '부드러운 식감으로 구이와 볶음에 잘 어울리는 여름 채소', category: '채소', imageUrl: '/images/ingredients/가지.webp', origin: '경남 진주' },
      { name: '오이', emoji: '🥒', description: '수분 가득하고 아삭한 늦여름 대표 채소', category: '채소', imageUrl: '/images/ingredients/오이.webp', origin: '충남 부여' },
      { name: '애호박', emoji: '🥒', description: '부드럽고 단맛이 좋은 늦여름 호박', category: '채소', imageUrl: '/images/ingredients/애호박.webp', origin: '충남 부여' },
      { name: '깻잎', emoji: '🌿', description: '향긋한 향으로 쌈과 무침에 두루 쓰이는 잎채소', category: '채소', imageUrl: '/images/ingredients/깻잎.webp', origin: '경북 청도' },
      { name: '부추', emoji: '🌿', description: '향이 진하고 영양이 풍부한 늦여름 채소', category: '채소', imageUrl: '/images/ingredients/부추.webp', origin: '경기 남양주' },
      { name: '자두', emoji: '🍑', description: '새콤달콤한 과즙이 가득한 늦여름 과일', category: '과일', imageUrl: '/images/ingredients/자두.webp', origin: '경북 김천' },
      { name: '멜론', emoji: '🍈', description: '향긋하고 달콤한 늦여름 과일', category: '과일', imageUrl: '/images/ingredients/멜론.webp', origin: '충남 부여' },
      { name: '민어', emoji: '🐟', description: '살이 부드럽고 담백해 여름 보양식으로 으뜸인 생선', category: '해산물', imageUrl: '/images/ingredients/민어.webp', origin: '전남 신안' },
      { name: '갈치', emoji: '🐟', description: '은빛 살이 부드럽고 고소한 늦여름 생선', category: '해산물', imageUrl: '/images/ingredients/갈치.webp', origin: '제주' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '느타리버섯', emoji: '🍄', description: '부드러운 식감과 은은한 향이 매력적인 버섯', category: '버섯', imageUrl: '/images/ingredients/느타리버섯.webp', origin: '충남 부여' },
      { name: '검은콩', emoji: '🫘', description: '구수한 맛과 영양이 풍부한 콩', category: '곡물', imageUrl: '/images/ingredients/검은콩.webp', origin: '강원 홍천' },
      { name: '녹두', emoji: '🌾', description: '고소하고 담백한 맛으로 빈대떡에 즐겨 쓰는 곡물', category: '곡물', imageUrl: '/images/ingredients/녹두.webp', origin: '경북 안동' },
      { name: '천도복숭아', emoji: '🍑', description: '껍질이 매끈하고 과즙이 풍부한 늦여름 복숭아', category: '과일', imageUrl: '/images/ingredients/천도복숭아.webp', origin: '경북 청도' },
    ],
    recipeIds: ['8-1', '8-2', '8-3', '8-4', '8-5', '8-6', '8-7', '8-8', '8-9', '8-10', '8-11', '8-12', '8-13', '8-14', '8-15'],
  },
  {
    month: 9,
    season: '초가을',
    solarTerm: '백로 · 추분',
    headline: '가을바람 소리와 함께 통통하게 살이 오른 해산물',
    description: '서늘한 바람이 불기 시작하며 가을 무와 대하가 제맛을 냅니다. 풍성한 수확의 계절이 시작돼요.',
    ingredients: [
      { name: '무', emoji: '🥬', description: '단맛이 응축되기 시작하는 가을 무', category: '채소', origin: '강원 평창', imageUrl: '/images/ingredients/무.webp' , nutrition: '가을무에는 소화를 돕는 디아스타제와 아밀라아제 같은 효소가 풍부해서, 가을철 든든한 식사 후 더부룩함을 편안하게 해주는 데 도움을 줘요. 비타민 C도 많이 들어있어 환절기 건강을 지키고 활력을 더하는 데 좋답니다.', howToChoose: '겉껍질이 매끄럽고 윤기가 돌며, 전체적으로 하얗고 단단한 것을 고르시는 것이 좋아요. 손으로 들었을 때 묵직하고 잔뿌리가 적으며, 무청이 싱싱하게 붙어있는 것이 좋답니다.', tip: '무는 흙이 묻은 채로 신문지에 싸서 서늘하고 그늘진 곳에 보관하시면 비교적 오래 드실 수 있어요. 껍질을 벗긴 무는 비닐랩으로 밀봉하여 냉장 보관하시면 신선도를 유지할 수 있답니다.', goesWellWith: '국, 조림, 생채 등 다양하게 활용해 보세요.', pairings: [{ name: '소고기', reason: '무의 소화 효소가 소고기의 소화를 돕고, 맛의 균형을 맞춰준답니다.' }, { name: '멸치', reason: '시원한 무와 멸치의 감칠맛이 어우러져 깊은 국물 맛을 낸답니다.' }, { name: '고춧가루', reason: '무의 시원한 맛에 칼칼함을 더해 입맛을 돋우는 역할을 해요.' }] },
      { name: '대하', emoji: '🦐', description: '살이 탱글하게 오른 가을 새우', category: '해산물', origin: '충남 서천·홍성(쭈꾸미와 함께 유명)', imageUrl: '/images/ingredients/대하.webp' , nutrition: '단백질이 풍부하여 가을철 기력 보충과 면역력 증진에 도움을 주고요. 타우린 성분은 피로 해소와 간 기능 개선에 좋답니다.', howToChoose: '껍질에 윤기가 흐르고 투명하며, 몸통이 단단하고 굽어지지 않은 것이 신선해요. 머리와 꼬리가 끊어지지 않고 붙어 있는 것을 고르시는 것이 좋답니다.', tip: '대하는 흐르는 물에 가볍게 씻어 내장과 머리 쪽에 있는 뾰족한 뿔을 제거해 주세요. 손질한 대하는 밀폐 용기에 담아 냉장 보관하면 1~2일, 냉동 보관하면 한 달 정도 신선하게 즐길 수 있답니다.', goesWellWith: '소금구이나 찜으로 즐겨보세요.', pairings: [{ name: '레몬', reason: '상큼한 향이 새우의 비린 맛을 잡아주고 풍미를 더해준답니다.' }, { name: '마늘', reason: '마늘의 알싸한 맛과 향이 새우의 감칠맛을 살려주고 느끼함을 줄여줘요.' }, { name: '버터', reason: '고소한 버터 향이 새우의 맛을 더욱 풍부하게 만들어준답니다.' }] },
      { name: '표고버섯', emoji: '🍄', description: '향과 식감이 가장 좋은 시기', category: '버섯', origin: '경북 청도·전남 장흥', imageUrl: '/images/ingredients/표고버섯.webp' , nutrition: '표고버섯에는 면역력 증진에 도움을 주는 베타글루칸이 풍부하답니다. 또한, 혈액 순환을 원활하게 하고 비타민D 생성에 좋은 에르고스테롤이 들어있어 가을철 건강 관리에 도움을 줄 수 있어요.', howToChoose: '갓의 두께가 두툼하고 안쪽 주름이 선명하며 갓이 너무 많이 피지 않은 것을 고르세요. 전체적으로 탄력이 느껴지고 표면에 윤기가 도는 것이 신선한 표고버섯이랍니다.', tip: '흐르는 물에 가볍게 씻어 물기를 제거하고, 기둥은 질기므로 잘라내거나 육수를 낼 때 사용해 보세요. 밀폐 용기에 담아 냉장 보관하면 일주일 정도 신선하게 즐길 수 있고, 장기 보관 시에는 슬라이스하여 냉동 보관하는 것도 좋답니다.', goesWellWith: '볶음, 조림, 전 요리에 잘 어울려요.', pairings: [{ name: '쇠고기', reason: '표고버섯의 감칠맛이 쇠고기의 풍미를 더하고, 영양 균형을 맞춰준답니다.' }, { name: '들기름', reason: '표고버섯의 향을 더욱 풍부하게 해주고, 고소한 맛이 잘 어우러져요.' }, { name: '다시마', reason: '함께 육수를 내면 깊고 시원한 감칠맛을 더해준답니다.' }], avoidPairings: [{ name: '과도한 향신료', reason: '표고버섯 본연의 은은한 향을 가릴 수 있으니 주의해 주세요.' }] },
      { name: '배', emoji: '🍐', description: '과즙이 가득한 가을 대표 과일', category: '과일', origin: '충남 천안·전남 나주', imageUrl: '/images/ingredients/배.webp' , nutrition: '배에는 루테올린 성분이 풍부해서 가을철 건조하고 차가운 공기로 인해 칼칼해진 목과 기관지 건강에 도움을 줄 수 있답니다. 또한, 식이섬유가 많아 환절기에 자칫 무거워질 수 있는 장을 편안하게 해주는 데 좋답니다.', howToChoose: '껍질이 맑고 윤기가 돌면서 전체적으로 고른 색을 띠는 배가 좋아요. 손으로 들었을 때 묵직하고 단단하며, 배 고유의 향이 은은하게 나는 것을 선택해보세요.', tip: '배는 흐르는 물에 깨끗이 씻어 껍질째 드시거나 껍질을 벗겨 드시면 되고요. 냉장 보관 시에는 하나씩 신문지에 싸서 냉장고 채소 칸에 넣어두시면 신선함을 더 오래 유지할 수 있답니다.', goesWellWith: '샐러드, 갈비찜, 주스에 활용해보세요.', pairings: [{ name: '소고기', reason: '배의 효소가 소고기의 연육 작용을 도와 육질을 부드럽게 해줘요.' }, { name: '생강', reason: '배의 시원한 맛과 생강의 따뜻한 향이 어우러져 목 건강에 좋아요.' }, { name: '도라지', reason: '기관지에 좋은 배와 도라지가 만나 시너지 효과를 내어줘요.' }], avoidPairings: [{ name: '게', reason: '배와 게를 함께 섭취하면 소화에 부담을 줄 수 있어 피하는 것이 좋아요.' }] },
      { name: '전어', emoji: '🐟', description: '"가을 전어"로 유명한, 기름이 가장 많이 오른 생선', category: '해산물', origin: '전남 광양·여수', imageUrl: '/images/ingredients/전어.webp' },
      { name: '연어', emoji: '🐟', description: '입에서 살살 녹는 가을 대표 회감', category: '해산물', origin: '경북 울진', imageUrl: '/images/ingredients/연어.webp' , nutrition: '오메가-3 지방산이 풍부해 가을철 건조해지기 쉬운 피부 건강과 혈관 건강에 도움을 줄 수 있답니다. 비타민 D도 많아 뼈 건강을 튼튼하게 하고 면역력 강화에도 좋은 영향을 주어요.', howToChoose: '껍질은 은빛 광택이 돌고 살은 선명한 주황색을 띠며 탄력이 있는 것이 신선해요. 아가미는 붉고 깨끗하며 비늘이 잘 붙어 있는 것을 고르시는 것이 좋답니다.', tip: '흐르는 물에 가볍게 씻은 후 물기를 제거하고, 키친타월로 감싸 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 신선하게 즐길 수 있어요. 장기 보관 시에는 한 번 먹을 양만큼 소분하여 냉동 보관해 보세요.', goesWellWith: '구이나 덮밥, 샐러드로 즐겨보세요.', pairings: [{ name: '레몬', reason: '상큼한 맛이 연어의 풍미를 살리고 비린 맛을 잡아줘요.' }, { name: '딜', reason: '허브향이 연어의 맛을 돋우고 고급스러운 풍미를 더해준답니다.' }, { name: '양파', reason: '아삭한 식감과 알싸한 맛이 연어의 느끼함을 줄여줘요.' }] },
      { name: '도다리', emoji: '🐟', description: '실제로는 봄보다 9월이 더 맛있다고 알려진 시기예요', category: '해산물', origin: '경남 고성', imageUrl: '/images/ingredients/도다리.webp' },
      { name: '대추', emoji: '🟤', description: '달큰하고 쫄깃한 가을 보양 열매', category: '과일', imageUrl: '/images/ingredients/대추.webp', origin: '충남 보은' },
      { name: '석류', emoji: '🔴', description: '새콤달콤한 과즙과 알알이 씹는 맛이 매력인 가을 과일', category: '과일', imageUrl: '/images/ingredients/석류.webp', origin: '경남 밀양' },
      { name: '낙지', emoji: '🐙', description: '쫄깃하고 담백한 맛으로 가을 보양식에 좋은 해산물', category: '해산물', imageUrl: '/images/ingredients/낙지.webp', origin: '전남 무안' },
      { name: '가을배추', emoji: '🥬', description: '선선한 날씨에 속이 차오르는 초가을 배추', category: '채소', imageUrl: '/images/ingredients/가을배추.webp', origin: '강원 평창' },
      { name: '시금치', emoji: '🥬', description: '단맛이 올라오는 초가을 시금치', category: '채소', imageUrl: '/images/ingredients/시금치.webp', origin: '전남 신안' },
      { name: '갓', emoji: '🌿', description: '알싱하고 매운 향으로 김치에 즐겨 쓰는 가을 채소', category: '채소', imageUrl: '/images/ingredients/갓.webp', origin: '전남 여수' },
      { name: '토란', emoji: '🥔', description: '부드럽고 구수한 맛이 매력적인 가을 뿌리채소', category: '채소', imageUrl: '/images/ingredients/토란.webp', origin: '전북 정읍' },
      { name: '고구마순', emoji: '🌿', description: '쫄깃하고 향긋한 가을 줄기채소', category: '채소', imageUrl: '/images/ingredients/고구마순.webp', origin: '전남 해남' },
      { name: '무순', emoji: '🌱', description: '알싱한 맛이 매력적인 가을 새싹채소', category: '채소', imageUrl: '/images/ingredients/무순.webp', origin: '경기 평택' },
      { name: '깻잎', emoji: '🌿', description: '향긋한 향으로 쌈과 무침에 두루 쓰이는 잎채소', category: '채소', imageUrl: '/images/ingredients/깻잎.webp', origin: '경북 청도' },
      { name: '사과', emoji: '🍎', description: '새콤달콤한 맛이 들기 시작하는 초가을 사과', category: '과일', imageUrl: '/images/ingredients/사과.webp', origin: '경북 청송' },
      { name: '무화과', emoji: '🍈', description: '달콤하고 부드러운 식감의 초가을 과일', category: '과일', imageUrl: '/images/ingredients/무화과.webp', origin: '전남 영암' },
      { name: '능이버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 귀하게 여겨지는 가을 버섯', category: '버섯', imageUrl: '/images/ingredients/능이버섯.webp', origin: '강원 평창' },
      { name: '검은콩', emoji: '🫘', description: '구수한 맛과 영양이 풍부한 가을 콩', category: '곡물', imageUrl: '/images/ingredients/검은콩.webp', origin: '강원 홍천' },
      { name: '햅쌀', emoji: '🌾', description: '그해 처음 수확한 향긋하고 차진 쌀', category: '곡물', imageUrl: '/images/ingredients/햅쌀.webp', origin: '경기 이천' },
      { name: '유자', emoji: '🍋', description: '향이 진하고 비타민C가 풍부한 초가을 과일', category: '과일', imageUrl: '/images/ingredients/유자.webp', origin: '전남 고흥' },
    ],
    recipeIds: ['9-1', '9-2', '9-3', '9-4', '9-5', '9-6', '9-7', '9-8', '9-9', '9-10', '9-11', '9-12', '9-13', '9-14', '9-15'],
  },
  {
    month: 10,
    season: '가을',
    solarTerm: '한로 · 상강',
    headline: '풍성하게 무르익은 대지의 너그러운 단맛',
    description: '서리가 내리기 시작하며 늙은호박과 사과가 깊은 단맛을 품습니다. 수확의 풍요로움을 가장 진하게 느낄 수 있는 시기예요.',
    ingredients: [
      { name: '늙은호박', emoji: '🎃', description: '달큰한 맛이 응축된 가을 호박', category: '채소', origin: '경기 이천', imageUrl: '/images/ingredients/늙은호박.webp' , nutrition: '늙은 호박은 베타카로틴이 풍부해서 환절기 면역력을 높이고 눈 건강을 지키는 데 도움을 줘요. 또한 식이섬유도 많아 가을철 소화를 돕고 장 건강을 편안하게 해준답니다.', howToChoose: '표면이 단단하고 흠집 없이 매끄러우며, 전체적으로 진한 주황색을 띠는 것이 좋답니다. 꼭지가 마르지 않고 싱싱하게 붙어 있으며, 들었을 때 묵직한 무게감이 느껴지는 것을 선택해 보세요.', tip: '겉껍질은 솔로 깨끗하게 문질러 씻은 후 씨와 태좌를 제거하고 사용하세요. 손질한 호박은 냉장 보관 시 랩으로 싸서 며칠 정도, 장기 보관 시에는 적당한 크기로 잘라 냉동 보관하시면 좋답니다.', goesWellWith: '죽이나 찜, 전으로 부드럽게 즐겨보세요.', pairings: [{ name: '새우젓', reason: '호박의 단맛을 살리고 감칠맛을 더해주며, 소화에도 도움을 준답니다.' }, { name: '팥', reason: '서로의 맛을 보완하여 더욱 깊고 풍부한 맛을 내고, 영양 균형도 맞춰줘요.' }, { name: '콩', reason: '단백질과 비타민의 조화로 영양 흡수를 돕고, 고소한 맛을 더해준답니다.' }] },
      { name: '사과', emoji: '🍎', description: '아삭함과 단맛이 절정인 가을 과일', category: '과일', origin: '경북 청송·충북 충주', imageUrl: '/images/ingredients/사과.webp' , nutrition: '사과에는 식이섬유가 풍부해서 가을철 더부룩하기 쉬운 장을 편안하게 해주고, 폴리페놀 성분은 환절기 건강 관리에 도움을 줄 수 있답니다.', howToChoose: '껍질이 매끄럽고 윤기가 돌며, 단단하고 묵직한 것을 고르는 것이 좋아요. 꼭지 부분이 마르지 않고 싱싱하며, 꼭지 주변에 푸른 기가 살짝 도는 것이 좋답니다.', tip: '사과는 껍질째 드시는 것이 좋으니, 흐르는 물에 깨끗이 씻어 잔류 농약을 제거해 주세요. 냉장 보관 시에는 하나씩 신문지나 키친타월에 싸서 비닐봉지에 넣어두면 신선함을 2주 정도 유지할 수 있답니다.', goesWellWith: '샐러드, 주스, 구이 등 다양하게 활용돼요.', pairings: [{ name: '돼지고기', reason: '사과의 산미가 돼지고기의 기름진 맛을 잡아주고 소화를 돕는답니다.' }, { name: '치즈', reason: '사과의 상큼함과 치즈의 고소함이 어우러져 맛의 균형을 이룬답니다.' }, { name: '견과류', reason: '사과의 아삭한 식감과 견과류의 고소함이 조화로워요.' }], avoidPairings: [{ name: '감', reason: '감과 사과를 함께 먹으면 소화 불량을 유발할 수 있어요.' }] },
      { name: '고구마', emoji: '🍠', description: '구수하고 달콤한 가을 별미', category: '채소', origin: '전남 해남', imageUrl: '/images/ingredients/고구마.webp' , nutrition: '고구마에는 베타카로틴이 풍부하게 들어있어 환절기 면역력 강화에 도움을 주고, 눈 건강에도 이로운 영향을 준답니다. 또한, 식이섬유가 풍부하여 장 건강을 돕고 배변 활동을 원활하게 하는 데 아주 좋답니다.', howToChoose: '껍질이 매끈하고 상처나 흠집이 없는 것을 고르시는 것이 좋아요. 들어보았을 때 묵직하고 단단하며, 잔뿌리가 적고 흙이 적당히 묻어있는 것이 신선하답니다.', tip: '흙이 묻은 채로 신문지에 싸서 서늘하고 통풍이 잘 되는 곳에 보관하시면 2~3주 정도 신선하게 드실 수 있어요. 씻어서 보관하면 쉽게 상할 수 있으니 흙이 묻은 상태로 보관하시는 것이 좋답니다.', goesWellWith: '찜, 구이, 튀김 등 다양하게 활용해보세요.', pairings: [{ name: '우유', reason: '부족한 단백질과 칼슘을 보충해주어 영양 균형을 맞추는 데 좋답니다.' }, { name: '김치', reason: '고구마의 단맛과 김치의 매콤함이 어우러져 맛의 조화를 이룬답니다.' }, { name: '사과', reason: '사과의 산뜻한 맛이 고구마의 단맛을 더욱 돋보이게 해준답니다.' }] },
      { name: '전어', emoji: '🐟', description: '"가을 전어"의 절정, 굽기만 해도 고소한 기름이 흘러요', category: '해산물', origin: '전남 광양·여수', imageUrl: '/images/ingredients/전어.webp' },
      { name: '갈치', emoji: '🐟', description: '살이 통통하게 차오르는 가을 별미', category: '해산물', origin: '제주', imageUrl: '/images/ingredients/갈치.webp' , nutrition: '갈치는 불포화지방산이 풍부해서 혈액순환을 원활하게 하고 혈관 건강에 도움을 줄 수 있어요. 또한, 비타민 A가 많아 가을철 건조해지기 쉬운 눈 건강과 피부 점막을 보호하는 데 좋답니다.', howToChoose: '싱싱한 갈치는 은빛 비늘이 벗겨지지 않고 반짝이며 윤기가 흐른답니다. 몸통을 눌러보았을 때 탄력이 있고 단단하며, 아가미는 선홍색을 띠는 것이 신선한 갈치예요.', tip: '갈치는 비늘을 칼등으로 긁어 제거하고 내장을 깨끗하게 손질한 후 드실 만큼 토막 내어 준비해 보세요. 손질한 갈치는 밀폐용기에 담아 냉장 보관하면 1~2일, 냉동 보관하면 1달 정도 신선하게 드실 수 있답니다.', goesWellWith: '구이나 조림으로 즐겨보세요.', pairings: [{ name: '무', reason: '무의 시원한 맛이 갈치의 감칠맛을 더하고 소화를 돕는답니다.' }, { name: '대파', reason: '대파의 향긋함이 갈치의 비린 맛을 잡아주고 풍미를 더해줘요.' }, { name: '고춧가루', reason: '매콤한 고춧가루 양념이 갈치의 담백함과 어우러져 입맛을 돋워줘요.' }] },
      { name: '방어', emoji: '🐟', description: '기름지고 고소한 맛이 본격적으로 오르기 시작해요', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/방어.webp' , nutrition: '불포화지방산이 풍부해서 추운 계절 혈관 건강을 지키고 혈액 순환을 원활하게 하는 데 도움을 줘요. 비타민 D도 많아 칼슘 흡수를 돕고 뼈 건강을 튼튼하게 유지하는 데 좋답니다.', howToChoose: '살이 단단하고 탄력이 있으며, 눈이 맑고 투명한 것을 고르시는 것이 좋아요. 아가미 속이 선명한 붉은색을 띠고 비늘이 잘 붙어 있는지도 확인해보세요.', tip: '내장과 비늘을 깨끗하게 제거한 후 흐르는 물에 씻어 키친타월로 물기를 제거해주세요. 손질한 방어는 밀봉하여 냉장 보관하시면 2~3일 정도 신선하게 즐기실 수 있답니다.', goesWellWith: '회나 구이로 드시면 맛이 좋답니다.', pairings: [{ name: '무', reason: '무의 소화 효소가 방어의 기름진 맛을 개운하게 해줘요.' }, { name: '레몬', reason: '레몬의 산뜻한 향이 방어의 비린 맛을 잡아주고 풍미를 더해줘요.' }, { name: '생강', reason: '생강의 매운맛과 향이 방어의 비린 맛을 효과적으로 줄여준답니다.' }] },
      { name: '단호박', emoji: '🎃', description: '달콤하고 부드러운 속살이 매력인 가을 호박', category: '채소', imageUrl: '/images/ingredients/단호박.webp', origin: '제주' },
      { name: '석이버섯', emoji: '🍄', description: '쫄깃한 식감과 은은한 향의 가을 버섯', category: '버섯', imageUrl: '/images/ingredients/석이버섯.webp', origin: '강원 평창' },
      { name: '가을배추', emoji: '🥬', description: '서늘한 날씨에 단맛이 오른 김장철 배추', category: '채소', imageUrl: '/images/ingredients/가을배추.webp', origin: '강원 평창·정선' },
      { name: '토란', emoji: '🥔', description: '부드럽고 구수한 맛이 매력적인 가을 뿌리채소', category: '채소', imageUrl: '/images/ingredients/토란.webp', origin: '전북 정읍' },
      { name: '무', emoji: '🥕', description: '단맛이 들어 국물 요리에 좋은 가을 무', category: '채소', imageUrl: '/images/ingredients/무.webp', origin: '강원 평창' },
      { name: '시금치', emoji: '🥬', description: '단맛이 올라오는 가을 시금치', category: '채소', imageUrl: '/images/ingredients/시금치.webp', origin: '전남 신안' },
      { name: '갓', emoji: '🌿', description: '알싱하고 매운 향으로 김치에 즐겨 쓰는 가을 채소', category: '채소', imageUrl: '/images/ingredients/갓.webp', origin: '전남 여수' },
      { name: '감', emoji: '🟠', description: '달콤하고 아삭한 가을 대표 과일', category: '과일', imageUrl: '/images/ingredients/감.webp', origin: '경남 창원·전남 영암' },
      { name: '배', emoji: '🍐', description: '시원하고 달콤한 과즙이 가득한 가을 배', category: '과일', imageUrl: '/images/ingredients/배.webp', origin: '충남 천안·전남 나주' },
      { name: '석류', emoji: '🔴', description: '새콤달콤하고 알알이 톡 터지는 가을 과일', category: '과일', imageUrl: '/images/ingredients/석류.webp', origin: '경남 밀양' },
      { name: '모과', emoji: '🟡', description: '향이 진해 차로 즐기기 좋은 가을 과일', category: '과일', imageUrl: '/images/ingredients/모과.webp', origin: '경북 청도' },
      { name: '꽃게', emoji: '🦀', description: '살이 통통하게 차오르는 가을 수꽃게', category: '해산물', imageUrl: '/images/ingredients/꽃게.webp', origin: '충남 태안·서천' },
      { name: '대하', emoji: '🦐', description: '살이 꽉 차고 탱탱한 가을 대표 새우', category: '해산물', imageUrl: '/images/ingredients/대하.webp', origin: '충남 태안' },
      { name: '굴', emoji: '🦪', description: '살이 통통하게 차오르기 시작하는 가을 굴', category: '해산물', imageUrl: '/images/ingredients/굴.webp', origin: '경남 통영' },
      { name: '햅쌀', emoji: '🌾', description: '그해 처음 수확한 향긋하고 차진 쌀', category: '곡물', imageUrl: '/images/ingredients/햅쌀.webp', origin: '경기 이천' },
      { name: '들깨', emoji: '🌾', description: '고소한 향이 진한 가을 들깨', category: '곡물', imageUrl: '/images/ingredients/들깨.webp', origin: '충남 천안' },
      { name: '단감', emoji: '🟠', description: '아삭하고 달콤한 가을 대표 감', category: '과일', imageUrl: '/images/ingredients/단감.webp', origin: '경남 창원' },
    ],
    recipeIds: ['10-1', '10-2', '10-3', '10-4', '10-5', '10-6', '10-7', '10-8', '10-9', '10-10', '10-11', '10-12', '10-13', '10-14', '10-15'],
  },
  {
    month: 11,
    season: '늦가을',
    solarTerm: '입동 · 소설',
    headline: '찬 바람 불 때 진가를 발휘하는 속이 꽉 찬 살림',
    description: '겨울 채비가 시작되는 시기, 알배추와 굴이 가장 맛있는 때를 맞습니다. 따뜻한 국물 요리가 그리워지는 계절이에요.',
    ingredients: [
      { name: '꽃게', emoji: '🦀', description: '월동 전 살이 가장 꽉 차는 늦가을 수꽃게', category: '해산물', imageUrl: '/images/ingredients/꽃게.webp', origin: '충남 태안·서천' },
      { name: '알배추', emoji: '🥬', description: '속이 단단하게 차오른 가을 배추', category: '채소', origin: '강원 평창', imageUrl: '/images/ingredients/알배추.webp' , nutrition: '알배추는 수분과 식이섬유가 풍부해서 가을철 건조해지기 쉬운 몸에 수분을 보충하고 장 건강을 지키는 데 도움을 줘요. 비타민 C도 많아 환절기 면역력을 높이고 피로회복에도 좋답니다.', howToChoose: '겉잎은 연한 녹색을 띠고 속은 노란색으로 꽉 차 있으며, 들었을 때 묵직하고 단단한 것이 신선한 알배추예요. 밑동을 잘라낸 단면이 깨끗하고 잎 사이 간격이 촘촘한 것을 고르시는 것이 좋답니다.', tip: '알배추는 겉잎을 몇 장 떼어내고 흐르는 물에 깨끗이 씻어 물기를 제거한 뒤 사용하시면 돼요. 신문지나 키친타월에 싸서 비닐봉투에 넣어 냉장 보관하시면 1주일 정도 신선하게 즐기실 수 있답니다.', goesWellWith: '국, 찌개, 겉절이, 전골에 잘 어울려요.', pairings: [{ name: '돼지고기', reason: '알배추의 시원하고 달큰한 맛이 돼지고기의 풍미를 더해주고 소화를 돕는답니다.' }, { name: '된장', reason: '구수한 된장과 알배추의 단맛이 어우러져 깊고 따뜻한 맛을 내준답니다.' }, { name: '고춧가루', reason: '매콤한 고춧가루 양념이 알배추의 아삭한 식감과 잘 어울려 입맛을 돋워줘요.' }] },
      { name: '굴', emoji: '🦪', description: '본격적으로 살이 차오르기 시작하는 굴, "바다의 우유"', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/굴.webp' , nutrition: '굴에는 아연이 풍부하게 들어있어 면역력 강화에 도움을 주고, 추운 겨울철 기력 회복에 좋답니다. 또한 타우린 성분은 피로 해소를 돕고 간 건강을 지키는 데 좋으니, 겨울철 보양식으로도 참 훌륭해요.', howToChoose: '싱싱한 굴은 껍데기가 단단하게 닫혀 있거나, 벌어져 있더라도 살을 만졌을 때 오므라드는 것이 좋아요. 살이 통통하고 유백색 또는 연한 회색빛을 띠며 윤기가 흐르는 것을 고르시면 된답니다.', tip: '굴은 흐르는 물에 가볍게 헹군 후 무즙이나 굵은 소금을 넣고 살살 흔들어 씻으면 불순물과 비린내를 효과적으로 제거할 수 있어요. 손질한 굴은 밀폐 용기에 담아 냉장고에 넣어두시면 2~3일 정도 신선하게 보관할 수 있답니다.', goesWellWith: '초고추장, 레몬즙, 또는 시원한 국물 요리에 잘 어울린답니다.', pairings: [{ name: '레몬', reason: '굴의 비린 맛을 잡아주고 상큼함을 더해줘요.' }, { name: '무', reason: '시원한 맛을 더하고 굴의 소화를 돕는답니다.' }, { name: '미역', reason: '바다 향을 더해주고 영양 균형을 맞춰줘요.' }], avoidPairings: [{ name: '감', reason: '탄닌 성분이 굴의 철분 흡수를 방해할 수 있어요.' }] },
      { name: '홍합', emoji: '🦪', description: '쫄깃하고 진한 국물 맛을 내는 조개', category: '해산물', origin: '경남 거제', imageUrl: '/images/ingredients/홍합.webp' , nutrition: '홍합은 단백질이 풍부하여 추운 날씨에 기력을 보충하고 면역력 강화에 도움을 줘요. 또한 타우린이 많이 들어있어 피로회복과 간 건강을 지키는 데 좋답니다.', howToChoose: '껍질이 깨지지 않고 윤기가 돌며, 입을 다물고 있는 것이 신선해요. 껍질을 만졌을 때 묵직하고 단단한 느낌이 드는 것을 고르시는 것이 좋답니다.', tip: '홍합은 껍질에 붙어있는 수염을 당겨 제거하고, 솔로 껍질을 문질러 이물질을 깨끗하게 씻어주세요. 손질 후에는 밀폐 용기에 담아 냉장 보관하시면 2~3일 정도 신선하게 즐기실 수 있답니다.', goesWellWith: '시원한 국물 요리나 볶음 요리에 잘 어울려요.', pairings: [{ name: '무', reason: '홍합의 시원한 맛을 더욱 살려주고 국물을 깔끔하게 해줘요.' }, { name: '청양고추', reason: '홍합의 비린 맛을 잡아주고 칼칼한 맛으로 풍미를 더해줘요.' }, { name: '마늘', reason: '홍합의 비린내를 효과적으로 제거하고 향긋한 맛을 더해준답니다.' }] },
      { name: '단감', emoji: '🍊', description: '늦가을의 달콤한 마무리 과일', category: '과일', origin: '경남 진주', imageUrl: '/images/ingredients/단감.webp' , nutrition: '단감에는 비타민 C가 풍부하게 들어있어 환절기 면역력 강화에 도움을 주고, 피부 건강을 지키는 데도 좋답니다. 또, 식이섬유가 많아 늦가을 식단에서 장 운동을 활발하게 하고 편안하게 해주는 데 도움을 줄 수 있어요.', howToChoose: '껍질이 윤기 있고 색이 고르며, 만졌을 때 단단하고 묵직한 것을 고르시는 것이 좋아요. 꼭지가 깨끗하고 갈라지지 않은 것이 신선하답니다.', tip: '흐르는 물에 깨끗이 씻어 껍질째 드시거나 껍질을 벗겨 드시면 되고요. 서늘한 곳이나 냉장 보관하시면 신선함을 더 오래 유지할 수 있답니다.', goesWellWith: '샐러드, 수정과, 또는 단독으로 드셔보세요.', pairings: [{ name: '요거트', reason: '유산균과 식이섬유가 만나 장 건강에 시너지를 낼 수 있어요.' }, { name: '치즈', reason: '단감의 달콤함과 치즈의 고소함이 어우러져 풍미가 좋답니다.' }, { name: '견과류', reason: '고소한 맛과 아삭한 식감이 더해져 훌륭한 간식이 된답니다.' }], avoidPairings: [{ name: '게', reason: '단감의 탄닌 성분이 게의 단백질과 만나 소화를 방해할 수 있답니다.' }] },
      { name: '방어', emoji: '🐟', description: '기름이 가장 많이 차올라 회로 인기인 겨울 초입 생선', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/방어.webp' , nutrition: '방어에는 오메가-3 지방산이 풍부하게 들어있어 추운 겨울철 혈액순환을 원활하게 하고 혈관 건강에 도움을 준답니다. 또한, 비타민 D가 많아 겨울철 부족해지기 쉬운 햇빛 비타민을 보충하고 뼈 건강을 지키는 데 좋답니다.', howToChoose: '선명한 붉은색을 띠고 살이 단단하며 탄력이 있는 것이 신선해요. 아가미는 붉고 촉촉하며 비늘이 잘 붙어 있는 방어를 고르시는 것이 좋답니다.', tip: '내장과 비늘을 깨끗하게 제거한 후 흐르는 물에 씻어 물기를 완전히 닦아내세요. 손질한 방어는 밀봉하여 냉장고에서 1~2일, 냉동 보관 시에는 한 달 이내에 드시는 것이 가장 좋답니다.', goesWellWith: '회나 구이로 드시면 맛이 좋답니다.', pairings: [{ name: '무', reason: '무의 소화 효소가 방어의 지방 소화를 돕고 시원한 맛을 더해준답니다.' }, { name: '생강', reason: '생강이 방어의 비린 맛을 잡아주고 향긋함을 더해 풍미를 살려준답니다.' }, { name: '미나리', reason: '미나리의 향긋함이 방어의 맛을 돋우고 영양 균형을 맞춰준답니다.' }] },
      { name: '광어', emoji: '🐟', description: '쫄깃한 식감으로 늦가을 회감의 인기 어종', category: '해산물', origin: '제주', imageUrl: '/images/ingredients/광어.webp' , nutrition: '광어는 단백질 함량이 높고 지방이 적어 소화 부담 없이 즐기기 좋답니다. 특히 아미노산이 풍부해서 추운 날씨에 기력 보충과 피로 회복에 도움을 줄 수 있어요.', howToChoose: '살아있는 광어는 눈이 맑고 투명하며, 아가미 안쪽이 선명한 붉은색을 띠는 것을 고르세요. 몸통을 만졌을 때 탄력이 있고 단단하며, 비늘이 고르게 붙어 있는 것이 신선하답니다.', tip: '광어는 깨끗하게 손질한 후 키친타월로 물기를 제거하여 밀폐 용기에 담아 냉장 보관하면 2~3일 정도 신선하게 즐길 수 있어요. 오래 두고 드실 경우 회 뜨기 전 통째로 냉동 보관하는 것도 좋은 방법이랍니다.', goesWellWith: '회, 초밥, 매운탕으로 즐겨보세요.', pairings: [{ name: '레몬', reason: '상큼한 향이 광어의 비린 맛을 잡아주고 풍미를 더해줘요.' }, { name: '미나리', reason: '특유의 향긋함이 광어의 맛을 돋우고 영양 균형을 맞춰줘요.' }, { name: '무', reason: '시원한 맛이 광어 매운탕의 국물 맛을 깊게 하고 소화를 도와줘요.' }], avoidPairings: [{ name: '감', reason: '떫은맛이 광어의 담백한 맛을 해칠 수 있답니다.' }] },
      { name: '새우', emoji: '🦐', description: '회로도 구이로도 쫀득하게 즐기는 늦가을 별미', category: '해산물', origin: '충남 태안', imageUrl: '/images/ingredients/새우.webp' , nutrition: '새우는 단백질이 풍부해서 추운 날씨에 기력 보충과 면역력 증진에 아주 좋답니다. 또한 타우린이 많이 들어 있어 피로 해소와 간 기능 개선에 도움을 줄 수 있어요.', howToChoose: '껍질에 윤기가 흐르고 투명하며, 몸통이 단단하고 휘어져 있는 것을 고르시는 것이 좋아요. 머리와 꼬리가 떨어지지 않고 붙어있는 것이 신선하답니다.', tip: '새우는 흐르는 물에 가볍게 씻어 내장과 껍질을 제거한 후 사용하시고요. 손질한 새우는 밀폐 용기에 담아 냉장고에서 1~2일, 냉동 보관하시면 한 달까지도 신선하게 드실 수 있답니다.', goesWellWith: '소금구이나 찜으로 즐겨보세요.', pairings: [{ name: '마늘', reason: '새우의 비린 맛을 잡아주고 풍미를 더해줘요.' }, { name: '레몬', reason: '상큼한 맛으로 새우의 감칠맛을 돋우고 비린내를 줄여줘요.' }, { name: '브로콜리', reason: '새우의 단백질과 브로콜리의 비타민이 영양 균형을 맞춰줘요.' }] },
      { name: '시래기', emoji: '🌿', description: '말린 배추잎으로 깊은 맛을 내는 겨울 식재료', category: '채소', imageUrl: '/images/ingredients/시래기.webp', origin: '강원 정선' },
      { name: '쪽파순', emoji: '🧄', description: '알뿌리가 작고 향이 진한 초겨울 파', category: '채소', imageUrl: '/images/ingredients/쪽파순.webp', origin: '전남 신안' },
      { name: '물메기', emoji: '🐟', description: '부드럽고 담백한 살로 해장국에 좋은 겨울 생선', category: '해산물', imageUrl: '/images/ingredients/물메기.webp', origin: '경남 통영·거제' },
      { name: '무', emoji: '🥕', description: '단맛이 들어 국물 요리에 좋은 늦가을 무', category: '채소', imageUrl: '/images/ingredients/무.webp', origin: '강원 평창' },
      { name: '갓', emoji: '🌿', description: '알싱하고 매운 향으로 김장에 즐겨 쓰는 채소', category: '채소', imageUrl: '/images/ingredients/갓.webp', origin: '전남 여수' },
      { name: '시금치', emoji: '🥬', description: '단맛이 깊어지는 늦가을 시금치', category: '채소', imageUrl: '/images/ingredients/시금치.webp', origin: '전남 신안' },
      { name: '늙은호박', emoji: '🎃', description: '달콤하고 속이 꽉 찬 늦가을 호박', category: '채소', imageUrl: '/images/ingredients/늙은호박.webp', origin: '경기 이천' },
      { name: '연근', emoji: '🪷', description: '아삭하면서도 부드러운 단맛의 늦가을 뿌리채소', category: '채소', imageUrl: '/images/ingredients/연근.webp', origin: '전남 무안' },
      { name: '감', emoji: '🟠', description: '달콤하고 아삭한 늦가을 대표 과일', category: '과일', imageUrl: '/images/ingredients/감.webp', origin: '경남 창원·전남 영암' },
      { name: '사과', emoji: '🍎', description: '저장성이 좋아 늦가을에 가장 맛있는 사과', category: '과일', imageUrl: '/images/ingredients/사과.webp', origin: '경북 청송' },
      { name: '석류', emoji: '🔴', description: '새콤달콤하고 알알이 톡 터지는 늦가을 과일', category: '과일', imageUrl: '/images/ingredients/석류.webp', origin: '경남 밀양' },
      { name: '유자', emoji: '🍋', description: '향이 진하고 비타민C가 풍부한 늦가을 과일', category: '과일', imageUrl: '/images/ingredients/유자.webp', origin: '전남 고흥' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '능이버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 귀하게 여겨지는 가을 버섯', category: '버섯', imageUrl: '/images/ingredients/능이버섯.webp', origin: '강원 평창' },
      { name: '검은콩', emoji: '🫘', description: '구수한 맛과 영양이 풍부한 콩', category: '곡물', imageUrl: '/images/ingredients/검은콩.webp', origin: '강원 홍천' },
      { name: '들깨', emoji: '🌾', description: '고소한 향이 진한 늦가을 들깨', category: '곡물', imageUrl: '/images/ingredients/들깨.webp', origin: '충남 천안' },
      { name: '배', emoji: '🍐', description: '시원하고 달콤한 과즙이 가득한 늦가을 배', category: '과일', imageUrl: '/images/ingredients/배.webp', origin: '충남 천안' },
    ],
    recipeIds: ['11-1', '11-2', '11-3', '11-4', '11-5', '11-6', '11-7', '11-8', '11-9', '11-10', '11-11', '11-12', '11-13', '11-14', '11-15'],
  },
  {
    month: 12,
    season: '초겨울',
    solarTerm: '대설 · 동지',
    headline: '추운 겨울 밤, 우리 집 주방을 데우는 온기',
    description: '한 해의 끝, 가장 춥고 어두운 밤이 길어지는 동짓달입니다. 굴과 명태처럼 진한 국물을 내는 식재료로 몸을 데워보세요.',
    ingredients: [
      { name: '굴', emoji: '🦪', description: '살이 가장 통통하게 차오르는 한겨울 굴', category: '해산물', origin: '경남 통영', imageUrl: '/images/ingredients/굴.webp' , nutrition: '아연이 풍부해서 면역력 강화에 도움을 주고, 추운 겨울철 감기 예방에 좋답니다. 타우린도 많아 피로회복과 간 건강에 이로운 영향을 줄 수 있어요.', howToChoose: '껍질이 있는 굴은 입을 꽉 다물고 있거나, 살짝 벌어져 있어도 건드리면 바로 닫는 것이 싱싱한 것이랍니다. 봉지 굴은 살이 통통하고 우윳빛 광택이 돌며, 가장자리의 검은 테두리가 선명한 것을 고르시면 좋아요.', tip: '굴은 흐르는 물에 가볍게 헹궈 이물질을 제거한 후, 무즙이나 소금물에 살살 흔들어 씻어주면 비린 맛을 줄일 수 있어요. 손질한 굴은 밀폐 용기에 담아 냉장고에 넣어두시면 1~2일 정도 보관이 가능하답니다.', goesWellWith: '초고추장이나 레몬즙을 곁들여 보세요.', pairings: [{ name: '무', reason: '무의 디아스타아제 효소가 굴의 소화를 돕고 비린 맛을 잡아줘요.' }, { name: '미역', reason: '미역의 알긴산이 굴의 영양 흡수를 돕고 맛의 균형을 맞춰준답니다.' }, { name: '레몬', reason: '레몬의 산뜻한 향이 굴의 비린 맛을 잡아주고 풍미를 더해줘요.' }], avoidPairings: [{ name: '감', reason: '감의 탄닌 성분이 굴의 철분 흡수를 방해할 수 있답니다.' }] },
      { name: '명태', emoji: '🐟', description: '겨울 동해를 대표하는 생선', category: '해산물', origin: '강원 고성', imageUrl: '/images/ingredients/명태.webp' , nutrition: '명태는 단백질이 풍부하여 추운 겨울철 기력 보충과 면역력 증진에 도움을 준답니다. 또한, 비타민 B군이 많아 겨울철 피로 회복과 활력 증진에도 참 좋답니다.', howToChoose: '싱싱한 명태는 눈이 맑고 투명하며, 아가미 안쪽이 선명한 붉은색을 띠는 것이 좋답니다. 몸통을 눌러보았을 때 탄력이 있고 단단하며, 비늘이 벗겨지지 않고 윤기가 도는 것을 선택해보세요.', tip: '명태는 흐르는 물에 깨끗이 씻어 내장을 제거하고, 지느러미를 가위로 잘라 손질해보세요. 손질한 명태는 키친타월로 물기를 제거한 후 밀봉하여 냉장 보관하면 2~3일 정도 신선하게 즐길 수 있답니다. 장기 보관 시에는 한 번 먹을 양만큼 소분하여 냉동 보관하는 것이 좋아요.', goesWellWith: '시원한 국물 요리나 매콤한 조림에 잘 어울려요.', pairings: [{ name: '무', reason: '무의 시원한 맛이 명태의 감칠맛을 더하고 소화를 도와줘요.' }, { name: '콩나물', reason: '아삭한 식감과 시원한 맛이 명태 요리의 풍미를 살려줘요.' }, { name: '두부', reason: '부드러운 두부가 명태의 담백한 맛과 잘 어우러져요.' }] },
      { name: '무', emoji: '🥬', description: '단맛이 깊어져 국물 요리와 동치미에 좋은 겨울 무', category: '채소', origin: '강원 평창', imageUrl: '/images/ingredients/무.webp' , nutrition: '동치미무에는 비타민 C가 풍부하게 들어있어 추운 겨울철 면역력을 높이고 감기를 예방하는 데 도움을 줄 수 있답니다. 또한, 소화를 돕는 효소들이 많아 기름진 음식과 함께 드시면 속을 편안하게 해주는 효과도 기대할 수 있어요.', howToChoose: '표면이 매끄럽고 단단하며, 무청이 싱싱하고 푸른색을 띠는 것이 좋답니다. 들었을 때 묵직한 무게감이 느껴지고 잔뿌리가 적은 것을 골라보세요.', tip: '흙이 묻은 채로 신문지에 싸서 서늘하고 그늘진 곳에 보관하면 좋답니다. 껍질을 벗긴 무는 비닐 랩으로 싸서 냉장 보관하면 며칠간 신선하게 드실 수 있어요.', goesWellWith: '시원한 동치미를 담가보세요.', pairings: [{ name: '소고기', reason: '무의 시원한 맛이 소고기의 깊은 맛과 어우러져 국물 맛을 풍성하게 한답니다.' }, { name: '멸치', reason: '멸치의 감칠맛이 무의 단맛과 조화를 이루어 시원하고 깊은 맛을 낸답니다.' }, { name: '생강', reason: '생강의 향이 무의 시원함과 어우러져 음식의 풍미를 더해준답니다.' }], avoidPairings: [{ name: '오이', reason: '오이의 아스코르비나아제 효소가 무의 비타민 C를 파괴할 수 있어 함께 먹는 것은 피하는 것이 좋답니다.' }] },
      { name: '유자', emoji: '🍋', description: '향긋한 향으로 겨울 감기를 예방하는 과일', category: '과일', origin: '전남 고흥', imageUrl: '/images/ingredients/유자.webp' , nutrition: '유자에는 비타민 C가 풍부하게 들어있어 추운 겨울철 감기 예방과 면역력 증진에 도움을 준답니다. 또한, 구연산은 피로 해소에 좋고, 리모넨 성분은 혈액순환을 원활하게 해주는 데 도움을 줄 수 있어요.', howToChoose: '껍질이 맑고 윤기가 흐르며, 표면이 단단하고 흠집이 없는 것을 고르시는 것이 좋아요. 손으로 들었을 때 묵직한 무게감이 느껴지는 것이 과즙이 풍부하답니다.', tip: '유자는 흐르는 물에 깨끗이 씻어 껍질째 사용하고, 씨는 쓴맛이 날 수 있으니 제거해 주세요. 냉장 보관 시에는 밀폐 용기나 비닐봉투에 넣어 2주 정도 신선하게 보관할 수 있답니다.', goesWellWith: '청, 차, 드레싱으로 즐기기 좋아요.', pairings: [{ name: '꿀', reason: '유자의 신맛을 중화시키고 달콤함을 더해 맛의 균형을 맞춰준답니다.' }, { name: '생강', reason: '몸을 따뜻하게 해주는 성질이 있어 유자와 함께 감기 예방에 더욱 좋답니다.' }, { name: '돼지고기', reason: '유자의 상큼함이 돼지고기의 느끼함을 잡아주고 풍미를 더해준답니다.' }] },
      { name: '대게', emoji: '🦀', description: '살이 가장 꽉 차는 한 해의 마지막 별미', category: '해산물', origin: '경북 영덕·울진', imageUrl: '/images/ingredients/대게.webp' , nutrition: '대게는 단백질이 풍부하여 추운 겨울철 기력 보충과 면역력 증진에 도움을 줄 수 있답니다. 또한, 타우린 성분도 함유되어 있어 피로 회복과 간 건강을 지키는 데 긍정적인 영향을 줄 수 있어요.', howToChoose: '살이 꽉 찬 대게는 배 부분이 단단하고 윤기가 돌며, 다리를 움직였을 때 힘이 느껴지는 것이 신선하답니다. 몸통을 들었을 때 묵직한 무게감이 느껴지는 것이 좋은 대게예요.', tip: '대게는 솔로 깨끗이 씻어 손질한 후, 찜기에 뒤집어 넣어 찌면 내장이 흘러내리지 않아 더욱 맛있게 즐길 수 있어요. 찌기 전에는 살아있는 상태로 냉장 보관하는 것이 좋고, 찌고 남은 것은 살을 발라 냉동 보관하면 오래 드실 수 있답니다.', goesWellWith: '찜으로 즐기거나 게장으로 만들어보세요.', pairings: [{ name: '미나리', reason: '대게의 풍미를 살려주고 향긋함을 더해줘요.' }, { name: '무', reason: '대게의 시원한 맛을 더욱 깊게 해주고 소화를 도와줘요.' }, { name: '된장', reason: '대게의 감칠맛을 끌어올리고 구수한 맛을 더해줘요.' }] },
      { name: '꼬막', emoji: '🦪', description: '겨울 초입부터 살이 통통하게 오르기 시작해요', category: '해산물', origin: '전남 보성·벌교', imageUrl: '/images/ingredients/꼬막.webp' , nutrition: '꼬막은 겨울철 기력을 보충해 주는 단백질과 필수 아미노산이 풍부하답니다. 또한, 철분이 풍부해서 추운 날씨에 쉽게 지치거나 빈혈이 있는 분들께 특히 좋답니다.', howToChoose: '껍질이 깨지지 않고 윤기가 돌며, 껍질을 닫았을 때 틈이 벌어지지 않은 것을 고르시는 것이 좋아요. 손으로 만졌을 때 묵직하고 단단한 느낌이 드는 것이 신선하답니다.', tip: '꼬막은 해감하는 것이 중요해요. 소금물에 담가 어둡고 시원한 곳에서 1시간 정도 두시면 되고요. 해감 후에는 삶아서 살만 발라 냉동 보관하시면 한 달 정도 신선하게 드실 수 있어요.', goesWellWith: '매콤한 양념장과 비빔밥으로 즐겨보세요.', pairings: [{ name: '부추', reason: '부추의 향긋함이 꼬막의 풍미를 더해주고, 따뜻한 성질이 찬 성질을 보완해줘요.' }, { name: '마늘', reason: '마늘의 알싸한 맛이 꼬막의 비린 맛을 잡아주고 풍미를 살려준답니다.' }, { name: '미나리', reason: '미나리의 상큼한 향과 아삭한 식감이 꼬막 무침의 맛을 더욱 풍성하게 해줘요.' }], avoidPairings: [{ name: '감', reason: '감의 떫은맛 성분이 꼬막의 철분 흡수를 방해할 수 있어요.' }] },
      { name: '과메기', emoji: '🐟', description: '청어나 꽁치를 얼리고 녹여 말린 겨울 별미', category: '해산물', origin: '경북 포항(구룡포)', imageUrl: '/images/ingredients/과메기.webp' , nutrition: '과메기는 겨울철 부족하기 쉬운 오메가-3 지방산이 풍부해서 혈액순환을 돕고 뇌 건강에도 좋은 영향을 준답니다. 또한, 비타민 D가 많아 추운 날씨에 약해지기 쉬운 뼈 건강을 지키고 면역력 강화에도 도움을 줄 수 있어요.', howToChoose: '몸통이 통통하고 윤기가 흐르며, 살이 단단하게 느껴지는 것을 고르시는 것이 좋아요. 껍질이 잘 벗겨져 있고 붉은빛이 선명한 것이 신선하답니다.', tip: '과메기 껍질은 깨끗하게 벗겨내고 먹기 좋은 크기로 썰어 준비해 주세요. 냉장 보관 시에는 밀폐 용기에 담아 2~3일 내에 드시는 것이 좋고, 장기 보관은 냉동 보관해 주세요.', goesWellWith: '김, 다시마와 초고추장과 함께 즐겨보세요.', pairings: [{ name: '미역', reason: '해조류의 알긴산이 과메기의 비린 맛을 잡아주고 맛의 조화를 이뤄요.' }, { name: '마늘', reason: '알리신 성분이 과메기의 비린 맛을 줄여주고 풍미를 더해준답니다.' }, { name: '대파', reason: '시원하고 아삭한 식감이 과메기의 기름진 맛을 개운하게 해줘요.' }] },
      { name: '모과', emoji: '🟡', description: '향이 진하고 새콤해 차로 즐기기 좋은 겨울 과일', category: '과일', imageUrl: '/images/ingredients/모과.webp', origin: '경북 청도' },
      { name: '메주콩', emoji: '🟫', description: '단백질이 풍부해 장 담그기에 쓰이는 겨울 콩', category: '곡물', imageUrl: '/images/ingredients/메주콩.webp', origin: '경북 안동' },
      { name: '곶감', emoji: '🟠', description: '말려서 단맛이 농축된 겨울철 별미 과일', category: '과일', imageUrl: '/images/ingredients/곶감.webp', origin: '경북 상주' },
      { name: '갓', emoji: '🌿', description: '알싱하고 매운 향으로 김치에 즐겨 쓰는 겨울 채소', category: '채소', imageUrl: '/images/ingredients/갓.webp', origin: '전남 여수' },
      { name: '시금치', emoji: '🥬', description: '단맛이 가장 깊어지는 한겨울 시금치', category: '채소', imageUrl: '/images/ingredients/시금치.webp', origin: '전남 신안' },
      { name: '연근', emoji: '🪷', description: '아삭하면서도 부드러운 단맛의 겨울 뿌리채소', category: '채소', imageUrl: '/images/ingredients/연근.webp', origin: '전남 무안' },
      { name: '우엉', emoji: '🥕', description: '향긋하고 아삭한 식감의 겨울 뿌리채소', category: '채소', imageUrl: '/images/ingredients/우엉.webp', origin: '경기 김포' },
      { name: '시래기', emoji: '🌿', description: '구수한 맛으로 국과 찜에 즐겨 쓰는 말린 겨울 채소', category: '채소', imageUrl: '/images/ingredients/시래기.webp', origin: '강원 정선' },
      { name: '봄동', emoji: '🥬', description: '겉은 푸르고 속은 노란 달큰한 겨울 배추', category: '채소', imageUrl: '/images/ingredients/봄동.webp', origin: '전남 해남' },
      { name: '한라봉', emoji: '🍊', description: '향긋하고 달콤한 제주 겨울 감귤', category: '과일', imageUrl: '/images/ingredients/한라봉.webp', origin: '제주' },
      { name: '귤', emoji: '🍊', description: '새콤달콤하고 향긋한 한겨울 대표 과일', category: '과일', imageUrl: '/images/ingredients/귤.webp', origin: '제주' },
      { name: '표고버섯', emoji: '🍄', description: '향이 진하고 쫄깃한 식감으로 어디든 잘 어울리는 버섯', category: '버섯', imageUrl: '/images/ingredients/표고버섯.webp', origin: '경북 청도·전남 장흥' },
      { name: '팽이버섯', emoji: '🍄', description: '가늘고 아삭한 식감으로 탕과 볶음에 즐겨 쓰는 버섯', category: '버섯', imageUrl: '/images/ingredients/팽이버섯.webp', origin: '충남 부여' },
      { name: '흑미', emoji: '🌾', description: '구수한 맛과 풍부한 안토시아닌이 매력적인 곡물', category: '곡물', imageUrl: '/images/ingredients/흑미.webp', origin: '경기 여주' },
      { name: '사과', emoji: '🍎', description: '저장성이 좋아 한겨울에도 아삭한 사과', category: '과일', imageUrl: '/images/ingredients/사과.webp', origin: '경북 청송' },
    ],
    recipeIds: ['12-1', '12-2', '12-3', '12-4', '12-5', '12-6', '12-7', '12-8', '12-9', '12-10', '12-11', '12-12', '12-13', '12-14', '12-15'],
  },
];

export function getMonthData(month: number): MonthData | undefined {
  return monthsData.find((m) => m.month === month);
}

/**
 * 식재료 이름으로 전체 달 데이터를 훑어 정보를 찾음.
 * 같은 식재료가 여러 달에 걸쳐 나오는 경우(예: 도다리) 등장하는 모든 월을 함께 반환.
 */
export function findIngredientByName(
  name: string
): { ingredient: SeasonalIngredient; months: number[]; byMonth: Record<number, SeasonalIngredient> } | undefined {
  const months: number[] = [];
  const byMonth: Record<number, SeasonalIngredient> = {};
  let found: SeasonalIngredient | undefined;

  for (const m of monthsData) {
    const match = m.ingredients.find((i) => i.name === name);
    if (match) {
      months.push(m.month);
      byMonth[m.month] = match;
      if (!found) found = match;
    }
  }

  return found ? { ingredient: found, months, byMonth } : undefined;
}

/**
 * 특정 달 기준으로 식재료 정보를 해석한다.
 * 같은 재료라도 달마다 설명이 다르므로(꽃게: 4·5월 봄 암꽃게 / 10·11월 가을 수꽃게)
 * 해당 달의 항목을 우선 쓰되, 그 달 항목에 없는 선택 필드(영양·손질법 등)는
 * 다른 달 항목에서 채워 넣는다.
 */
export function resolveIngredientForMonth(
  found: { ingredient: SeasonalIngredient; byMonth: Record<number, SeasonalIngredient> },
  month: number
): SeasonalIngredient {
  const base = { ...found.ingredient } as unknown as Record<string, unknown>;
  // 선택 필드는 어느 달 항목에든 채워져 있으면 가져온다
  for (const entry of Object.values(found.byMonth)) {
    for (const [k, v] of Object.entries(entry)) {
      if (v !== undefined && base[k] === undefined) base[k] = v;
    }
  }
  const merged = base as unknown as SeasonalIngredient;
  // 해당 달 항목이 있으면 그 달의 값(설명·산지 등)으로 덮어쓴다
  return found.byMonth[month] ? { ...merged, ...found.byMonth[month] } : merged;
}

/**
 * 이름 일부로 12개월 전체를 통틀어 검색. 같은 식재료가 여러 달에 등장해도
 * 한 번만 반환됨 (대표 데이터 1개 + 어느 달에 검색해도 제철 배지가 정확히 나옴).
 * 제철 탭의 검색바처럼, "지금 보고 있는 달"에 갇히지 않고 전체에서 찾을 때 사용.
 */
export function searchIngredientsAcrossMonths(query: string): SeasonalIngredient[] {
  const q = query.trim();
  if (!q) return [];

  const seen = new Set<string>();
  const results: SeasonalIngredient[] = [];

  for (const m of monthsData) {
    for (const ing of m.ingredients) {
      if (seen.has(ing.name)) continue;
      if (ing.name.includes(q)) {
        seen.add(ing.name);
        results.push(ing);
      }
    }
  }

  return results;
}

/** [3, 9, 11] -> "3·9·11월", [6,7,8] -> "6~8월", [6] -> "6월" */
export function formatSeasonMonths(months: number[]): string {
  const sorted = [...months].sort((a, b) => a - b);
  const isContiguous = sorted.every((m, i) => i === 0 || m === sorted[i - 1] + 1);
  if (sorted.length === 1) return `${sorted[0]}월`;
  if (isContiguous) return `${sorted[0]}~${sorted[sorted.length - 1]}월`;
  return `${sorted.join('·')}월`;
}

export const CAMPING_TYPES = [
  { type: 'normal', label: '일반캠핑', icon: 'ri-home-8-line' },
  { type: 'glamping', label: '글램핑', icon: 'ri-hotel-line' },
  { type: 'caravan', label: '카라반', icon: 'ri-truck-line' },
  { type: 'pension', label: '팬션', icon: 'ri-building-line' },
  { type: 'hotel', label: '호텔', icon: 'ri-hotel-line' },
  { type: 'pet', label: '반려동물', icon: 'ri-heart-3-line' },
  { type: 'sharing', label: '공유숙박', icon: 'ri-home-4-line' },
  { type: 'hotspring', label: '온천', icon: 'ri-water-flash-line' },
  { type: 'resort', label: '리조트', icon: 'ri-hotel-line' },
];

export const SEASONAL_CAMPSITES = [
  {
    id: 'spring-camping-01',
    title: '벚꽃 캠핑 명소',
    region: '경기도 양평, 강원도 춘천',
    image:
      'https://readdy.ai/api/search-image?query=Spring%20camping%20in%20Korea%20with%20cherry%20blossoms%2C%20peaceful%20atmosphere%2C%20tent%20setup%20near%20flowering%20trees%2C%20beautiful%20nature%20scenery%2C%20professional%20photography&width=560&height=300&seq=101&orientation=landscape',
    price: 95000,
    rating: 4.6,
    description: '봄바람과 함께하는 캠핑, 벚꽃이 만발한 자연 속에서 힐링',
    distance: '35km',
    facilities: '데크사이트,화장실,샤워실,취사장,주차장',
    badge: '계절 특화',
    season: '봄',
    seasonColor: 'bg-primary',
  },
  {
    id: 'summer-camping-02',
    title: '계곡 캠핑 베스트',
    region: '가평 계곡, 홍천 수동계곡',
    image:
      'https://readdy.ai/api/search-image?query=Summer%20camping%20in%20Korea%20near%20river%20or%20lake%2C%20refreshing%20water%20activities%2C%20tents%20under%20shade%2C%20clear%20blue%20sky%2C%20professional%20photography&width=560&height=300&seq=102&orientation=landscape',
    price: 110000,
    rating: 4.8,
    description: '시원한 물놀이와 함께하는 여름 계곡 캠핑',
    distance: '42km',
    facilities: '계곡,물놀이,데크사이트,화장실,샤워실',
    badge: '물놀이 가능',
    season: '여름',
    seasonColor: 'bg-secondary',
  },
  {
    id: 'autumn-camping-03',
    title: '단풍 캠핑 명소',
    region: '내장산, 설악산 주변',
    image:
      'https://readdy.ai/api/search-image?query=Autumn%20camping%20in%20Korea%20with%20colorful%20fall%20foliage%2C%20tents%20surrounded%20by%20red%20and%20orange%20trees%2C%20beautiful%20mountain%20view%2C%20professional%20photography&width=560&height=300&seq=103&orientation=landscape',
    price: 125000,
    rating: 4.9,
    description: '가을 정취를 느끼는 캠핑, 아름다운 단풍과 함께',
    distance: '58km',
    facilities: '등산로,단풍명소,데크사이트,화장실,카페',
    badge: '단풍 명소',
    season: '가을',
    seasonColor: 'bg-orange-500',
  },
  {
    id: 'winter-camping-04',
    title: '겨울 캠핑 추천',
    region: '평창, 홍천 알파인리조트',
    image:
      'https://readdy.ai/api/search-image?query=Winter%20camping%20in%20Korea%20with%20snow%2C%20cozy%20tent%20setup%20with%20warm%20lighting%2C%20snowy%20landscape%2C%20professional%20photography&width=560&height=300&seq=104&orientation=landscape',
    price: 140000,
    rating: 4.4,
    description: '눈 내리는 캠핑의 낭만, 겨울 특화 시설 완비',
    distance: '65km',
    facilities: '난방시설,스키장,온천,카페,레스토랑',
    badge: '겨울 특화',
    season: '겨울',
    seasonColor: 'bg-blue-500',
  },
];

export const POPULAR_CAMPSITES = [
  {
    id: 'b17e06a2-c8bb-4255-901e-710cba572e47',
    title: '양평 숲속의 아침',
    region: '경기도 양평군 강하면',
    image:
      'https://readdy.ai/api/search-image?query=Korean%20forest%20camping%20site%20with%20wooden%20deck%20platforms%20for%20tents%2C%20natural%20surroundings%2C%20professional%20photography&width=800&height=400&seq=106&orientation=landscape',
    price: 80000,
    rating: 4.7,
    reviews: 96,
    description: '남한강 뷰, 데크 사이트, 반려동물 동반 가능',
    distance: 25,
  },
  {
    id: 'b17e06a2-c8bb-4255-901e-710cba572e48',
    title: '가평 더 글램 글램핑',
    region: '경기도 가평군 청평면',
    image:
      'https://readdy.ai/api/search-image?query=Luxury%20glamping%20site%20in%20Korea%20with%20modern%20dome%20tents%2C%20outdoor%20furniture%2C%20beautiful%20forest%20surroundings%2C%20professional%20photography&width=800&height=400&seq=105&orientation=landscape',
    price: 150000,
    rating: 3.1,
    reviews: 128,
    description: '프라이빗 온수풀, 바베큐장 완비',
    distance: 5,
  },
  {
    id: 'b17e06a2-c8bb-4255-901e-710cba572e49',
    title: '춘천 호반 카라반',
    region: '강원도 춘천시 서면',
    image:
      'https://readdy.ai/api/search-image?query=Riverside%20camping%20in%20Korea%20with%20modern%20caravan%20facilities%2C%20beautiful%20water%20view%2C%20professional%20photography&width=800&height=400&seq=107&orientation=landscape',
    price: 180000,
    rating: 4.9,
    reviews: 215,
    description: '의암호 전망, 프리미엄 카라반, 수상레저 가능',
    distance: 75,
  },
];

export const ACCORDION_ITEMS = [
  {
    id: 'beginner',
    title: '초보자 캠핑 가이드',
    icon: 'ri-user-star-line',
    content: [
      '1. 첫 캠핑은 시설이 잘 갖춰진 오토캠핑장을 선택하세요.',
      '2. 텐트 설치 연습은 집에서 미리 해보는 것이 좋습니다.',
      '3. 날씨 예보를 꼭 확인하고 우천 대비책을 마련하세요.',
      '4. 음식은 가능한 간단하게 준비하고, 일회용품 사용을 줄이세요.',
      '5. 체크리스트를 만들어 필수 장비를 빠뜨리지 않도록 하세요.',
    ],
  },
  {
    id: 'safety',
    title: '캠핑 안전 수칙',
    icon: 'ri-shield-check-line',
    content: [
      '1. 화재 위험이 있는 장비는 항상 주의해서 사용하세요.',
      '2. 일산화탄소 중독 예방을 위해 텐트 내 취사를 금지하세요.',
      '3. 야생동물이 출몰할 수 있는 지역에서는 음식물 보관에 주의하세요.',
      '4. 응급처치 키트를 항상 구비하고 사용법을 숙지하세요.',
      '5. 캠핑장 주변 지형과 비상 연락처를 미리 확인하세요.',
    ],
  },
  {
    id: 'cooking',
    title: '캠핑 요리 팁',
    icon: 'ri-fire-line',
    content: [
      '1. 집에서 미리 손질하고 양념해온 재료를 사용하면 편리합니다.',
      '2. 알루미늄 호일을 활용한 요리는 설거지가 간편합니다.',
      '3. 다용도 조리도구를 준비해 짐을 줄이세요.',
      '4. 냉장이 필요한 식재료는 아이스박스에 보관하세요.',
      '5. 간단한 원팬 요리 레시피를 미리 준비하세요.',
    ],
  },
  {
    id: 'eco',
    title: '친환경 캠핑 방법',
    icon: 'ri-recycle-line',
    content: [
      '1. 일회용품 사용을 최소화하고 다회용 식기를 사용하세요.',
      '2. 생분해성 세제를 사용하여 자연을 보호하세요.',
      '3. 쓰레기는 분리수거하고 캠핑장을 떠날 때 깨끗이 정리하세요.',
      '4. 태양광 충전기 등 친환경 에너지를 활용하세요.',
      '5. 자연 그대로의 상태를 존중하고 식물이나 돌을 채집하지 마세요.',
    ],
  },
];

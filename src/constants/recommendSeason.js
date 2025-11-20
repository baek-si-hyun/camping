export const SEASONS = [
  { id: 'spring', name: '봄', icon: 'ri-flower-line', color: 'text-pink-500', gradient: 'from-pink-50 to-rose-50' },
  { id: 'summer', name: '여름', icon: 'ri-sun-line', color: 'text-yellow-500', gradient: 'from-blue-50 to-cyan-50' },
  { id: 'autumn', name: '가을', icon: 'ri-leaf-line', color: 'text-orange-500', gradient: 'from-orange-50 to-amber-50' },
  { id: 'winter', name: '겨울', icon: 'ri-snowy-line', color: 'text-cyan-500', gradient: 'from-indigo-50 to-blue-50' },
];

export const SPRING_CAMPSITES = [
  {
    title: '양평 벚꽃마을 캠핑장',
    region: '경기도 양평군 양서면 용담리',
    price: 85000,
    rating: 4.6,
    reviews: 142,
    description: '남한강변을 따라 피어나는 벚꽃과 함께하는 캠핑, 4월 초 벚꽃 축제 기간 방문 추천',
    tags: ['벚꽃 명소', '계곡 인접', '반려동물 동반'],
    image:
      'https://readdy.ai/api/search-image?query=Spring%20camping%20in%20Korea%20with%20cherry%20blossoms%2C%20peaceful%20atmosphere%2C%20tent%20setup%20near%20flowering%20trees%2C%20beautiful%20nature%20scenery%2C%20professional%20photography%2C%20clear%20blue%20sky&width=800&height=400&seq=201&orientation=landscape',
    badge: '벚꽃명소',
    facilities: '캠핑,바베큐장,샤워실,편의점,주차장',
    distance: '38km',
  },
  {
    title: '춘천 호반 캠핑장',
    region: '강원도 춘천시 서면',
    price: 70000,
    rating: 4.4,
    reviews: 215,
    description: '의암호가 보이는 전망 좋은 사이트, 봄철 야생화 관찰 코스 인접',
    tags: ['호수 뷰', '숲속 캠핑', '데크 사이트'],
    image:
      'https://readdy.ai/api/search-image?query=Spring%20camping%20in%20Korea%20with%20mountain%20view%2C%20tent%20setup%20near%20forest%2C%20beautiful%20nature%20scenery%2C%20professional%20photography&width=800&height=400&seq=203&orientation=landscape',
    badge: '호수뷰',
    facilities: '캠핑,호수뷰,데크,샤워실,주차장',
    distance: '52km',
  },
  {
    title: '가평 청춘 글램핑',
    region: '경기도 가평군 상면 수목원로',
    price: 120000,
    rating: 4.6,
    reviews: 98,
    description: '편안한 글램핑 시설과 봄꽃 정원, 개인 바베큐장 완비, 커플 추천',
    tags: ['글램핑', '바베큐', '온수 샤워'],
    image:
      'https://readdy.ai/api/search-image?query=Spring%20camping%20in%20Korea%20with%20green%20hills%2C%20wildflowers%2C%20tent%20setup%20in%20meadow%2C%20beautiful%20nature%20scenery%2C%20professional%20photography&width=800&height=400&seq=202&orientation=landscape',
    badge: '봄 추천',
    facilities: '글램핑,바베큐,온수샤워,커플추천',
    distance: '45km',
  },
];

export const SUMMER_CAMPSITES = [
  {
    title: '가평 청평 계곡 캠핑장',
    region: '경기도 가평군 청평면 대성리',
    price: 90000,
    rating: 4.6,
    reviews: 176,
    description: '깨끗한 계곡물과 울창한 숲, 어린이 물놀이장 완비, 가족 캠핑 추천',
    tags: ['계곡 접근성', '그늘 많음', '수영장'],
    image:
      'https://readdy.ai/api/search-image?query=Summer%20camping%20in%20Korea%20near%20river%20or%20lake%2C%20refreshing%20water%20activities%2C%20tents%20under%20shade%2C%20clear%20blue%20sky%2C%20professional%20photography&width=800&height=400&seq=204&orientation=landscape',
    badge: '여름 추천',
    facilities: '캠핑,바베큐장,수영장,그늘많음,주차장',
    distance: '45km',
  },
];

export const AUTUMN_CAMPSITES = [
  {
    title: '가평 단풍 캠핑장',
    region: '경기도 가평군 설악면',
    price: 95000,
    rating: 4.7,
    reviews: 189,
    description: '단풍이 아름다운 산속 캠핑장, 가을철 단풍 명소 인접',
    tags: ['단풍 명소', '산속 캠핑', '전망 좋음'],
    image:
      'https://readdy.ai/api/search-image?query=Autumn%20camping%20in%20Korea%20with%20colorful%20fall%20foliage%2C%20red%20and%20yellow%20leaves%2C%20tent%20setup%20in%20mountain%2C%20beautiful%20nature%20scenery%2C%20professional%20photography&width=800&height=400&seq=205&orientation=landscape',
    badge: '가을 추천',
    facilities: '캠핑,바베큐장,샤워실,주차장',
    distance: '50km',
  },
];

export const WINTER_CAMPSITES = [
  {
    title: '가평 설경 캠핑장',
    region: '경기도 가평군 설악면',
    price: 110000,
    rating: 4.5,
    reviews: 156,
    description: '눈 덮인 설경을 감상하며 즐기는 겨울 캠핑, 난방 시설 완비',
    tags: ['설경 명소', '난방 완비', '프라이빗'],
    image:
      'https://readdy.ai/api/search-image?query=Winter%20camping%20in%20Korea%20with%20snow%20covered%20landscape%2C%20tent%20setup%20in%20snow%2C%20beautiful%20winter%20scenery%2C%20professional%20photography&width=800&height=400&seq=206&orientation=landscape',
    badge: '겨울 추천',
    facilities: '캠핑,바베큐장,난방시설,주차장',
    distance: '55km',
  },
];

export const SEASON_CAMPSITES = {
  spring: SPRING_CAMPSITES,
  summer: SUMMER_CAMPSITES,
  autumn: AUTUMN_CAMPSITES,
  winter: WINTER_CAMPSITES,
};

export const SEASON_ACCORDION_ITEMS = {
  spring: [
    {
      id: 'checklist',
      title: '봄 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-pink-100 text-pink-600',
      content: [
        '1. 일교차 대비 겹옷 (아침저녁 추위 대비)',
        '2. 방수 기능이 있는 텐트와 타프',
        '3. 봄비 대비 우산과 레인코트',
        '4. 꽃가루 알레르기 대비 약품',
        '5. 벌레 퇴치제 (초봄부터 벌레 출현)',
        '6. 보온성 좋은 침낭 (밤 기온 하락 대비)',
        '7. 따뜻한 음료를 위한 보온병',
      ],
    },
    {
      id: 'precautions',
      title: '봄 캠핑 주의사항',
      icon: 'ri-information-line',
      color: 'bg-blue-100 text-blue-600',
      content: [
        '1. 일교차가 크므로 옷차림에 신경쓰세요.',
        '2. 봄비가 자주 내리므로 방수 준비를 철저히 하세요.',
        '3. 황사/미세먼지 정보를 확인하고 마스크를 준비하세요.',
        '4. 꽃가루 알레르기가 있다면 약을 챙기세요.',
        '5. 해가 짧으므로 일찍 텐트를 설치하는 것이 좋습니다.',
      ],
    },
    {
      id: 'activities',
      title: '봄 캠핑 추천 활동',
      icon: 'ri-plant-line',
      color: 'bg-green-100 text-green-600',
      content: [
        '1. 봄꽃 관찰 및 사진 촬영',
        '2. 가벼운 산책과 트레킹',
        '3. 봄나물 채집 (캠핑장 규정 확인 필수)',
        '4. 별자리 관찰 (봄철 별자리)',
        '5. 봄 테마 요리 (봄나물 요리, 딸기 디저트 등)',
      ],
    },
  ],
  summer: [
    {
      id: 'checklist',
      title: '여름 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-blue-100 text-blue-600',
      content: [
        '1. 시원한 옷과 수영복',
        '2. 선크림과 모자',
        '3. 냉장고와 아이스박스',
        '4. 선풍기나 휴대용 선풍기',
        '5. 모기 퇴치제',
        '6. 그늘막과 타프',
        '7. 충분한 물과 음료',
      ],
    },
  ],
  autumn: [
    {
      id: 'checklist',
      title: '가을 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-orange-100 text-orange-600',
      content: [
        '1. 일교차 대비 옷차림',
        '2. 보온성 좋은 침낭',
        '3. 난로나 히터',
        '4. 따뜻한 음료',
        '5. 방수 장비',
        '6. 단풍 관찰용 카메라',
        '7. 충분한 연료',
      ],
    },
  ],
  winter: [
    {
      id: 'checklist',
      title: '겨울 캠핑 준비물 체크리스트',
      icon: 'ri-list-check-2',
      color: 'bg-indigo-100 text-indigo-600',
      content: [
        '1. 방한복과 방한 장갑',
        '2. 보온성 좋은 침낭',
        '3. 난로와 연료',
        '4. 4계절용 텐트와 추가 보온재',
        '5. 고효율 버너와 충분한 연료',
        '6. 전기 히터 (전기 사용 가능 캠핑장)',
        '7. 따뜻한 음료와 음식',
      ],
    },
  ],
};

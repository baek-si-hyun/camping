export const CATEGORIES = [
  { name: '전체', icon: 'ri-filter-3-line' },
  { name: '관광명소', icon: 'ri-camera-line' },
  { name: '맛집', icon: 'ri-restaurant-line' },
  { name: '카페', icon: 'ri-cup-line' },
  { name: '자연', icon: 'ri-time-line' },
  { name: '문화', icon: 'ri-time-line' },
];

const CATEGORY_LABELS = {
  관광명소: '관광 탐방',
  맛집: '맛집 탐방',
  카페: '카페 투어',
  자연: '자연 힐링',
  문화: '문화 체험',
};

export const getCategoryLabel = (category) => CATEGORY_LABELS[category] || category;

export const ATTRACTIONS_DATA = [
  {
    id: 1,
    name: '남한산성',
    categories: ['관광명소', '문화'],
    rating: 4.6,
    description: '조선시대 산성과 아름다운 자연경관',
    duration: '90분 소요',
    travelTime: '15분 이동',
    distance: '2.3km',
    image:
      'https://readdy.ai/api/search-image?query=Beautiful%20Korean%20traditional%20temple%20with%20colorful%20roof%20tiles%20and%20mountain%20backdrop%2C%20serene%20atmosphere%2C%20cultural%20heritage%20site%2C%20professional%20photography%2C%20golden%20hour%20lighting&width=288&height=160&seq=101&orientation=landscape',
    lat: 37.8315,
    lng: 127.5109,
    detailDescription:
      '조선시대 산성으로 유네스코 세계문화유산에 등재된 역사적 명소입니다. 아름다운 자연경관과 함께 역사를 체험할 수 있습니다.',
    detailImage:
      'https://readdy.ai/api/search-image?query=Beautiful%20Korean%20traditional%20temple%20with%20colorful%20roof%20tiles%20and%20mountain%20backdrop%2C%20serene%20atmosphere%2C%20cultural%20heritage%20site%2C%20professional%20photography%2C%20golden%20hour%20lighting&width=375&height=200&seq=201&orientation=landscape',
  },
  {
    id: 2,
    name: '광주 남한산성 맛집거리',
    categories: ['맛집', '문화'],
    rating: 4.4,
    description: '전통 한식과 지역 특산품 맛집',
    duration: '60분 소요',
    travelTime: '10분 이동',
    distance: '2.8km',
    image:
      'https://readdy.ai/api/search-image?query=Korean%20traditional%20market%20with%20colorful%20food%20stalls%2C%20bustling%20atmosphere%2C%20local%20street%20food%20vendors%2C%20authentic%20Korean%20cuisine%2C%20vibrant%20market%20scene&width=288&height=160&seq=102&orientation=landscape',
    lat: 37.8415,
    lng: 127.5209,
    detailDescription:
      '남한산성 인근의 전통 한식 맛집들이 모여있는 거리로, 지역 특산품과 전통 음식을 맛볼 수 있습니다.',
    detailImage:
      'https://readdy.ai/api/search-image?query=Korean%20traditional%20market%20with%20colorful%20food%20stalls%2C%20bustling%20atmosphere%2C%20local%20street%20food%20vendors%2C%20authentic%20Korean%20cuisine%2C%20vibrant%20market%20scene&width=375&height=200&seq=202&orientation=landscape',
  },
  {
    id: 3,
    name: '검단산 자연휴양림',
    categories: ['자연', '관광명소'],
    rating: 4.7,
    description: '울창한 숲과 맑은 공기의 힐링 공간',
    duration: '120분 소요',
    travelTime: '20분 이동',
    distance: '4.1km',
    image:
      'https://readdy.ai/api/search-image?query=Beautiful%20Korean%20garden%20with%20traditional%20pavilion%2C%20serene%20pond%20with%20lotus%20flowers%2C%20peaceful%20nature%20setting%2C%20cultural%20landscape%2C%20morning%20light&width=288&height=160&seq=103&orientation=landscape',
    lat: 37.8515,
    lng: 127.5309,
    detailDescription:
      '울창한 숲과 맑은 공기로 유명한 자연휴양림입니다. 산책로와 휴식 공간이 잘 조성되어 있어 힐링하기 좋습니다.',
    detailImage:
      'https://readdy.ai/api/search-image?query=Beautiful%20Korean%20garden%20with%20traditional%20pavilion%2C%20serene%20pond%20with%20lotus%20flowers%2C%20peaceful%20nature%20setting%2C%20cultural%20landscape%2C%20morning%20light&width=375&height=200&seq=203&orientation=landscape',
  },
  {
    id: 4,
    name: '하남 카페거리',
    categories: ['카페', '맛집'],
    rating: 4.5,
    description: '감성 카페와 디저트 맛집이 모인 거리',
    duration: '45분 소요',
    travelTime: '12분 이동',
    distance: '3.5km',
    image:
      'https://readdy.ai/api/search-image?query=Cozy%20Korean%20coffee%20shop%20interior%20with%20warm%20lighting%2C%20wooden%20furniture%2C%20artisanal%20coffee%20setup%2C%20comfortable%20atmosphere%2C%20modern%20cafe%20design&width=288&height=160&seq=104&orientation=landscape',
    lat: 37.8615,
    lng: 127.5409,
    detailDescription:
      '감성적인 카페들이 모여있는 거리로, 다양한 디저트와 음료를 즐길 수 있습니다. 인스타그램 핫플레이스로도 유명합니다.',
    detailImage:
      'https://readdy.ai/api/search-image?query=Cozy%20Korean%20coffee%20shop%20interior%20with%20warm%20lighting%2C%20wooden%20furniture%2C%20artisanal%20coffee%20setup%2C%20comfortable%20atmosphere%2C%20modern%20cafe%20design&width=375&height=200&seq=204&orientation=landscape',
  },
  {
    id: 5,
    name: '성남아트센터',
    categories: ['문화', '관광명소'],
    rating: 4.3,
    description: '다양한 문화 공연과 전시가 열리는 공간',
    duration: '90분 소요',
    travelTime: '18분 이동',
    distance: '5.2km',
    image:
      'https://readdy.ai/api/search-image?query=Modern%20Korean%20cultural%20center%20exterior%20at%20night%20with%20dramatic%20lighting%2C%20architecture%20photography%2C%20performing%20arts%20venue%2C%20urban%20scenery&width=288&height=160&seq=105&orientation=landscape',
    lat: 37.8715,
    lng: 127.5509,
    detailDescription:
      '다양한 공연과 전시가 열리는 문화 공간으로, 연중 다양한 프로그램이 운영됩니다. 가족 단위 문화 체험에 적합합니다.',
    detailImage:
      'https://readdy.ai/api/search-image?query=Modern%20Korean%20cultural%20center%20exterior%20at%20night%20with%20dramatic%20lighting%2C%20architecture%20photography%2C%20performing%20arts%20venue%2C%20urban%20scenery&width=375&height=200&seq=205&orientation=landscape',
  },
  {
    id: 6,
    name: '모란민속5일장',
    categories: ['맛집', '문화'],
    rating: 4.2,
    description: '전통 5일장의 정취와 다양한 먹거리',
    duration: '75분 소요',
    travelTime: '25분 이동',
    distance: '6.8km',
    image:
      'https://readdy.ai/api/search-image?query=Korean%20traditional%20market%20with%20fresh%20produce%2C%20local%20vendors%2C%20authentic%20atmosphere%2C%20colorful%20vegetables%20and%20fruits%2C%20bustling%20market%20life&width=288&height=160&seq=106&orientation=landscape',
    lat: 37.8815,
    lng: 127.5609,
    detailDescription:
      '전통 5일장의 정취를 느낄 수 있는 곳으로, 다양한 먹거리와 전통 상품들을 구경하고 구매할 수 있습니다.',
    detailImage:
      'https://readdy.ai/api/search-image?query=Korean%20traditional%20market%20with%20fresh%20produce%2C%20local%20vendors%2C%20authentic%20atmosphere%2C%20colorful%20vegetables%20and%20fruits%2C%20bustling%20market%20life&width=375&height=200&seq=206&orientation=landscape',
  },
];
